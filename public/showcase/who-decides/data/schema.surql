-- Civic authority graph
--
-- Which elected bodies decide an issue for the people who live at one point,
-- how each member voted on that issue, and which upcoming elections can change
-- the balance. Nothing in this file names a country, a city or an issue: a
-- dataset supplies places, bodies, issues, measures, votes and elections, and
-- the functions at the end work on any of them.

-- Places ------------------------------------------------------------------

-- Any area a person can live in or a body can act for: a neighbourhood, a
-- constituency, a city, a region, a country, a union of countries. Only the
-- smallest places need an outline. Larger ones are reached through `within`.
DEFINE TABLE place SCHEMAFULL;
DEFINE FIELD name ON place TYPE string;
DEFINE FIELD kind ON place TYPE string;
DEFINE FIELD area ON place TYPE option<geometry<polygon | multipolygon>>;

-- A place lies inside another. A place can have several parents, since a
-- constituency and an arrondissement both lie inside the same city.
DEFINE TABLE within TYPE RELATION IN place OUT place SCHEMAFULL;
DEFINE INDEX within_pair ON within FIELDS in, out UNIQUE;

-- Bodies ------------------------------------------------------------------

-- A council, parliament, office or joint authority. `seats` is the full size
-- of the body, which divides its authority between its members. It can be
-- left out for a body whose members the dataset does not list.
DEFINE TABLE body SCHEMAFULL;
DEFINE FIELD name ON body TYPE string;
DEFINE FIELD kind ON body TYPE string;
DEFINE FIELD seats ON body TYPE option<int> ASSERT $value = NONE OR $value > 0;
DEFINE FIELD url ON body TYPE option<string>;

-- The places whose residents a body makes decisions for.
DEFINE TABLE acts_for TYPE RELATION IN body OUT place SCHEMAFULL;
DEFINE INDEX acts_for_pair ON acts_for FIELDS in, out UNIQUE;

-- One body chooses some or all members of another: a city council sending
-- delegates to a joint waste authority, or electors choosing senators.
-- `seats` is how many it chooses, where the dataset knows it.
DEFINE TABLE appoints TYPE RELATION IN body OUT body SCHEMAFULL;
DEFINE FIELD seats ON appoints TYPE option<int>;
DEFINE FIELD note ON appoints TYPE string;

-- Issues ------------------------------------------------------------------

DEFINE TABLE issue SCHEMAFULL;
DEFINE FIELD name ON issue TYPE string;
DEFINE FIELD summary ON issue TYPE string;

-- How much of the public authority over an issue a body holds. Weights are
-- relative: for any one resident they are divided by the total of the bodies
-- that act for that resident, so they do not need to add up to 1. `basis`
-- says what the body controls, which is what makes the weight checkable.
DEFINE TABLE decides TYPE RELATION IN body OUT issue SCHEMAFULL;
DEFINE FIELD weight ON decides TYPE number ASSERT $value >= 0;
DEFINE FIELD basis ON decides TYPE string;
DEFINE INDEX decides_pair ON decides FIELDS in, out UNIQUE;

-- People ------------------------------------------------------------------

-- `refs` holds identifiers in the source registers, such as an Assemblée
-- nationale actor id, so that every record can be traced back.
DEFINE TABLE official SCHEMAFULL;
DEFINE FIELD name ON official TYPE string;
DEFINE FIELD born ON official TYPE option<datetime>;
DEFINE FIELD refs ON official TYPE array<string> DEFAULT [];

-- A current seat. `seat` is the place that elects it: a constituency for a
-- deputy, the whole city for a city councillor, the country for a president.
DEFINE TABLE holds TYPE RELATION IN official OUT body SCHEMAFULL;
DEFINE FIELD seat ON holds TYPE record<place>;
DEFINE FIELD role ON holds TYPE option<string>;
DEFINE FIELD since ON holds TYPE option<datetime>;
DEFINE INDEX holds_pair ON holds FIELDS in, out UNIQUE;

-- A political group inside one body. Some councils record votes per group
-- rather than per member, and a member then takes the group's vote.
DEFINE TABLE faction SCHEMAFULL;
DEFINE FIELD name ON faction TYPE string;
DEFINE FIELD body ON faction TYPE record<body>;

DEFINE TABLE member_of TYPE RELATION IN official OUT faction SCHEMAFULL;
DEFINE INDEX member_of_pair ON member_of FIELDS in, out UNIQUE;

-- Votes -------------------------------------------------------------------

-- One recorded vote in one body: an amendment, an article, a resolution.
DEFINE TABLE measure SCHEMAFULL;
DEFINE FIELD title ON measure TYPE string;
DEFINE FIELD summary ON measure TYPE string;
DEFINE FIELD issue ON measure TYPE record<issue>;
DEFINE FIELD body ON measure TYPE record<body>;
DEFINE FIELD date ON measure TYPE datetime;
DEFINE FIELD result ON measure TYPE 'adopted' | 'rejected';
DEFINE FIELD url ON measure TYPE string;

-- A member's own vote, or a group's vote where only that was recorded.
DEFINE TABLE voted TYPE RELATION IN official | faction OUT measure SCHEMAFULL;
DEFINE FIELD position ON voted TYPE 'for' | 'against' | 'abstain';
DEFINE INDEX voted_pair ON voted FIELDS in, out UNIQUE;
DEFINE INDEX voted_measure ON voted FIELDS out;

-- Elections ---------------------------------------------------------------

-- A future election to a body. `seats` is how many seats a resident's ballot
-- fills, used only when the dataset has no current holders for that body.
-- `direct` is false where residents do not vote themselves, as with senators
-- chosen by electors.
DEFINE TABLE election SCHEMAFULL;
DEFINE FIELD name ON election TYPE string;
DEFINE FIELD body ON election TYPE record<body>;
DEFINE FIELD date ON election TYPE datetime;
DEFINE FIELD date_note ON election TYPE string;
DEFINE FIELD place ON election TYPE record<place>;
DEFINE FIELD seats ON election TYPE int;
DEFINE FIELD direct ON election TYPE bool;

-- Functions ---------------------------------------------------------------

-- Every place a point lies in: the smallest places by outline, then
-- everything those lie within.
DEFINE FUNCTION fn::places($at: geometry<point>) -> array<record<place>> {
	LET $smallest = SELECT VALUE id FROM place WHERE area != NONE AND $at INSIDE area;
	$smallest.map(|$p| [$p].concat($p.{..+collect}(->within->place))).flatten().distinct()
};

-- The bodies that decide an issue for someone living in these places, with
-- each body's share of the authority over it.
DEFINE FUNCTION fn::bodies($places: array<record<place>>, $issue: record<issue>) -> array<object> {
	LET $rows = SELECT in AS body, weight, basis FROM decides
		WHERE out = $issue AND in->acts_for->place ANYINSIDE $places;
	LET $total = math::sum($rows.weight);
	$rows.map(|$r| $r + { share: IF $total > 0 { $r.weight / $total } ELSE { 0 } })
};

-- How an official voted on a measure: their own vote, or else the vote of
-- their group in that body. NONE when neither was recorded.
DEFINE FUNCTION fn::vote($official: record<official>, $measure: record<measure>) -> option<string> {
	LET $own = SELECT VALUE position FROM voted WHERE in = $official AND out = $measure;
	IF $own.len() > 0 {
		RETURN $own[0];
	};
	LET $factions = $official->member_of->faction;
	(SELECT VALUE position FROM voted WHERE in IN $factions AND out = $measure)[0]
};

-- How far an official's recorded votes match a resident's positions on
-- measures in one body: 1 when every recorded vote matches, 0 when none do,
-- NONE when the official has no recorded vote for or against any of them.
-- Abstentions count as no recorded vote.
DEFINE FUNCTION fn::alignment($official: record<official>, $positions: array<object>) -> option<number> {
	LET $votes = $positions
		.map(|$p| { wanted: $p.position, cast: fn::vote($official, $p.measure) })
		.filter(|$v| $v.cast IN ['for', 'against']);
	IF $votes.len() = 0 {
		RETURN NONE;
	};
	$votes.filter(|$v| $v.cast = $v.wanted).len() / $votes.len()
};

-- One body's members, each weighted by their part of the body's authority
-- over an issue, with how far their votes match the resident's positions.
DEFINE FUNCTION fn::members($body: record<body>, $share: number, $positions: array<object>) -> array<object> {
	LET $own = $positions.filter(|$p| $p.measure.body = $body);
	LET $holders = SELECT in AS official, seat FROM holds WHERE out = $body;
	-- Registers can still list a member who has been replaced, so the divisor
	-- is never smaller than the number of holders, and the members' weights
	-- never add up to more than the body's share.
	LET $divisor = math::max([$body.seats ?? 0, $holders.len()]);
	LET $per_seat = IF $divisor > 0 { $share / $divisor } ELSE { 0 };
	$holders.map(|$h| $h + { weight: $per_seat, alignment: fn::alignment($h.official, $own) })
};

-- Agreement with a resident, per issue. `positions` is an array of
-- { measure, position } where position is 'for' or 'against'. Each figure is
-- a share of the authority over the issue:
--   agree       held by members whose recorded votes match the positions
--   oppose      held by members whose recorded votes go the other way
--   unrecorded  held by members with no recorded vote, by bodies with no
--               measures in `positions`, and by empty seats
DEFINE FUNCTION fn::agreement($at: geometry<point>, $positions: array<object>) -> array<object> {
	LET $places = fn::places($at);
	LET $issues = $positions.map(|$p| $p.measure.issue).distinct();
	$issues.map(|$issue| {
		LET $bodies = fn::bodies($places, $issue).map(|$b| {
			LET $members = fn::members($b.body, $b.share, $positions.filter(|$p| $p.measure.issue = $issue));
			LET $known = $members.filter(|$m| $m.alignment != NONE);
			LET $agree = math::sum($known.map(|$m| $m.weight * $m.alignment));
			LET $oppose = math::sum($known.map(|$m| $m.weight * (1 - $m.alignment)));
			{
				body: $b.body.name,
				share: $b.share,
				basis: $b.basis,
				seats: $b.body.seats,
				members_loaded: $members.len(),
				members_with_votes: $known.len(),
				agree: $agree,
				oppose: $oppose,
				unrecorded: $b.share - $agree - $oppose,
			}
		});
		LET $agree = math::sum($bodies.agree);
		LET $oppose = math::sum($bodies.oppose);
		{
			issue: $issue.name,
			-- The headline figure: of the authority whose votes are on record,
			-- the part that voted the way the resident would have.
			agree_of_recorded: IF $agree + $oppose > 0 { math::fixed($agree / ($agree + $oppose), 3) } ELSE { NONE },
			agree: math::fixed($agree, 4),
			oppose: math::fixed($oppose, 4),
			unrecorded: math::fixed(math::sum($bodies.unrecorded), 4),
			bodies: $bodies.map(|$b| $b + {
				share: math::fixed($b.share, 4),
				agree: math::fixed($b.agree, 4),
				oppose: math::fixed($b.oppose, 4),
				unrecorded: math::fixed($b.unrecorded, 4),
			}),
		}
	})
};

-- The people whose seats a resident votes for, directly or through electors, and how each voted
-- on the measures in `positions`. Bodies with more than `limit` such seats,
-- such as a city council elected as a whole, are summarised instead: for
-- each measure, how many members of each group voted each way.
DEFINE FUNCTION fn::representatives($at: geometry<point>, $positions: array<object>, $limit: int) -> array<object> {
	LET $places = fn::places($at);
	-- Only bodies with an election for these places. Appointed boards, such as
	-- a transport authority, are reached through `appoints` instead.
	LET $elected = SELECT VALUE body FROM election WHERE place IN $places;
	LET $seats = SELECT in AS official, out AS body, role FROM holds WHERE seat IN $places AND out IN $elected;
	$seats.map(|$s| $s.body).distinct().map(|$body| {
		LET $mine = $seats.filter(|$s| $s.body = $body);
		LET $measures = $positions.filter(|$p| $p.measure.body = $body);
		{
			body: $body.name,
			seats: $mine.len(),
			people: IF $mine.len() <= $limit {
				$mine.map(|$s| {
					name: $s.official.name,
					role: $s.role,
					groups: ($s.official->member_of->faction).name,
					votes: $measures.map(|$p| {
						measure: $p.measure.summary,
						you: $p.position,
						they: fn::vote($s.official, $p.measure) ?? 'no recorded vote',
					}),
				})
			} ELSE { NONE },
			groups: IF $mine.len() > $limit {
				$measures.map(|$p| {
					LET $cast = $mine.map(|$s| {
						party: (($s.official->member_of->faction).filter(|$f| $f.body = $body).name)[0] ?? 'No group',
						they: fn::vote($s.official, $p.measure) ?? 'no recorded vote',
					});
					{
						measure: $p.measure.summary,
						you: $p.position,
						tally: (SELECT party, they, count() AS members FROM $cast GROUP BY party, they ORDER BY party, they),
					}
				})
			} ELSE { NONE },
		}
	})
};

-- Upcoming direct elections a resident votes in, ranked by how much of the
-- authority over their issues is held by people who voted against them and
-- whose seats are on that ballot. Authority a body passes on through
-- `appoints` is counted as well, as unrecorded, since the delegates are not
-- chosen until after the election.
DEFINE FUNCTION fn::elections($at: geometry<point>, $positions: array<object>) -> array<object> {
	LET $places = fn::places($at);
	LET $issues = $positions.map(|$p| $p.measure.issue).distinct();
	LET $upcoming = SELECT * FROM election WHERE direct AND date > time::now() AND place IN $places ORDER BY date;
	LET $ranked = $upcoming.map(|$e| {
		LET $per_issue = $issues.map(|$issue| {
			LET $bodies = fn::bodies($places, $issue);
			LET $share = math::sum($bodies.filter(|$b| $b.body = $e.body).share);
			LET $members = fn::members($e.body, $share, $positions.filter(|$p| $p.measure.issue = $issue))
				.filter(|$m| $m.seat IN $places);
			-- Without holders in the dataset, the ballot's seats stand in for them.
			LET $direct = IF $members.len() > 0 { math::sum($members.weight) } ELSE { $share * $e.seats / $e.body.seats };
			LET $oppose = math::sum($members.filter(|$m| $m.alignment != NONE).map(|$m| $m.weight * (1 - $m.alignment)));
			LET $via = $e.body->appoints.map(|$a| {
				LET $theirs = math::sum($bodies.filter(|$b| $b.body = $a.out).share);
				{
					body: $a.out.name,
					note: $a.note,
					body_share: math::fixed($theirs, 4),
					-- NONE where the dataset does not say how many seats are appointed
					share: IF $a.seats != NONE AND $a.out.seats != NONE { $theirs * $a.seats / $a.out.seats } ELSE { NONE },
				}
			}).filter(|$v| $v.body_share > 0);
			{
				issue: $issue.name,
				at_stake: $direct,
				held_against_you: $oppose,
				appointed: $via.map(|$v| $v + { share: IF $v.share != NONE { math::fixed($v.share, 4) } ELSE { NONE } }),
			}
		});
		{
			election: $e.name,
			date: $e.date,
			date_note: $e.date_note,
			held_against_you: math::fixed(math::sum($per_issue.held_against_you), 4),
			at_stake: math::fixed(math::sum($per_issue.at_stake), 4),
			issues: $per_issue.map(|$i| $i + {
				at_stake: math::fixed($i.at_stake, 4),
				held_against_you: math::fixed($i.held_against_you, 4),
			}),
		}
	});
	SELECT * FROM $ranked ORDER BY held_against_you DESC, at_stake DESC
};
