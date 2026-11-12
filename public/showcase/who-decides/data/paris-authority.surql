-- Paris: the hand-written part of the dataset
--
-- This file holds the judgements: which bodies exist, which issues they
-- decide and how much of each, how members reach them, which votes count as
-- measures, and when the next elections are. Everything that can be read from
-- a public register (outlines, officials, seats, votes) is in generated.surql,
-- which build.ts writes from the files in raw/.
--
-- To add an issue, add an `issue`, its `decides` edges and its measures here,
-- and the vote ids to build.ts. Nothing in schema.surql changes.

-- Places above the ones build.ts reads from outlines -----------------------

CREATE place:eu SET name = 'European Union', kind = 'union';
CREATE place:france SET name = 'France', kind = 'country';
CREATE place:idf SET name = 'Île-de-France', kind = 'region';
CREATE place:grand_paris SET name = 'Grand Paris', kind = 'metropolis';
CREATE place:paris SET name = 'Paris', kind = 'city';
CREATE place:paris_centre SET name = 'Paris Centre', kind = 'sector';

RELATE place:france->within->place:eu;
RELATE place:idf->within->place:france;
RELATE place:grand_paris->within->place:idf;
RELATE place:paris->within->place:grand_paris;
RELATE place:paris_centre->within->place:paris;

-- Bodies -------------------------------------------------------------------

CREATE body:conseil_de_paris CONTENT {
	name: 'Conseil de Paris',
	kind: 'city council',
	seats: 163,
	url: 'https://www.paris.fr/pages/fonctionnement-du-conseil-de-paris-216',
};
CREATE body:syctom CONTENT {
	name: 'Syctom',
	kind: 'joint waste authority',
	url: 'https://www.syctom-paris.fr',
};
CREATE body:mgp CONTENT {
	name: 'Conseil de la Métropole du Grand Paris',
	kind: 'metropolitan council',
	seats: 208,
	url: 'https://www.metropolegrandparis.fr',
};
CREATE body:idf_council CONTENT {
	name: "Conseil régional d'Île-de-France",
	kind: 'regional council',
	seats: 209,
	url: 'https://www.iledefrance.fr',
};
CREATE body:presidency CONTENT {
	name: 'President of the Republic',
	kind: 'head of state',
	seats: 1,
	url: 'https://www.elysee.fr',
};
CREATE body:assemblee CONTENT {
	name: 'Assemblée nationale',
	kind: 'lower house',
	seats: 577,
	url: 'https://www.assemblee-nationale.fr',
};
CREATE body:senat CONTENT {
	name: 'Sénat',
	kind: 'upper house',
	seats: 348,
	url: 'https://www.senat.fr',
};
CREATE body:idfm CONTENT {
	name: 'Île-de-France Mobilités',
	kind: 'transport authority',
	seats: 33,
	url: 'https://www.iledefrance-mobilites.fr',
};
CREATE body:european_parliament CONTENT {
	name: 'European Parliament',
	kind: 'parliament',
	seats: 720,
	url: 'https://www.europarl.europa.eu',
};

RELATE body:conseil_de_paris->acts_for->place:paris;
RELATE body:syctom->acts_for->place:paris;
RELATE body:mgp->acts_for->place:grand_paris;
RELATE body:idf_council->acts_for->place:idf;
RELATE body:presidency->acts_for->place:france;
RELATE body:assemblee->acts_for->place:france;
RELATE body:senat->acts_for->place:france;
RELATE body:european_parliament->acts_for->place:eu;
RELATE body:idfm->acts_for->place:idf;

RELATE body:conseil_de_paris->appoints->body:syctom CONTENT {
	note: "The Conseil de Paris designates Paris's delegates to the Syctom committee.",
};
RELATE body:conseil_de_paris->appoints->body:mgp CONTENT {
	note: "Paris's members of the Métropole council are chosen from among the Paris councillors.",
};
RELATE body:conseil_de_paris->appoints->body:senat CONTENT {
	seats: 12,
	note: "Paris councillors, with delegates they choose, form the electoral college that elects Paris's 12 senators.",
};

RELATE body:idf_council->appoints->body:idfm CONTENT {
	seats: 17,
	note: 'The regional council elects 17 of the 33 members of the Île-de-France Mobilités board, and the regional president chairs it.',
};
RELATE body:conseil_de_paris->appoints->body:idfm CONTENT {
	seats: 5,
	note: 'The Conseil de Paris elects 5 of the 33 members of the Île-de-France Mobilités board.',
};

-- Issues -------------------------------------------------------------------

CREATE issue:household_waste CONTENT {
	name: 'Household waste',
	summary: 'Collecting, treating and reducing household rubbish, and keeping streets clean.',
};
CREATE issue:public_transport CONTENT {
	name: 'Public transport and streets',
	summary: 'Public transport services and fares, cycling and walking, traffic and parking, and low-emission zones.',
};
CREATE issue:income_tax CONTENT {
	name: 'Income tax',
	summary: 'The brackets and rates of personal income tax.',
};

-- Weights are editorial. Each `basis` says what the body controls, so that a
-- reader can disagree with a number and change it.

RELATE body:conseil_de_paris->decides->issue:household_waste CONTENT {
	weight: 0.45,
	basis: 'Collects household waste, cleans the streets and sets the rate of the household waste collection tax (TEOM).',
};
RELATE body:syctom->decides->issue:household_waste CONTENT {
	weight: 0.20,
	basis: 'Treats and sorts the household waste collected in Paris and the neighbouring communes, and runs the incineration and sorting plants.',
};
RELATE body:idf_council->decides->issue:household_waste CONTENT {
	weight: 0.05,
	basis: 'Adopts the regional waste prevention and management plan (PRPGD), which sets treatment capacity and targets.',
};
RELATE body:assemblee->decides->issue:household_waste CONTENT {
	weight: 0.10,
	basis: 'Votes national waste law, such as the 2020 anti-waste law (AGEC), and the tax on landfill and incineration (TGAP). Has the final word when the two chambers disagree.',
};
RELATE body:senat->decides->issue:household_waste CONTENT {
	weight: 0.05,
	basis: 'Votes national waste law as the second chamber.',
};
RELATE body:presidency->decides->issue:household_waste CONTENT {
	weight: 0.05,
	basis: 'The Government, appointed by the President, proposes national waste law and issues the decrees that apply it.',
};
RELATE body:european_parliament->decides->issue:household_waste CONTENT {
	weight: 0.10,
	basis: 'Makes EU waste law with the Council, including the Waste Framework Directive and the Packaging and Packaging Waste Regulation.',
};

RELATE body:assemblee->decides->issue:income_tax CONTENT {
	weight: 0.60,
	basis: 'Votes the annual finance law, which sets the income tax brackets and rates. Has the final word when the two chambers disagree.',
};
RELATE body:senat->decides->issue:income_tax CONTENT {
	weight: 0.20,
	basis: 'Votes the finance law as the second chamber.',
};
RELATE body:presidency->decides->issue:income_tax CONTENT {
	weight: 0.20,
	basis: 'The Government, appointed by the President, drafts the finance bill and can pass it without a vote under article 49.3 of the Constitution.',
};
-- Zero weights are kept on purpose: they record that the question was asked.
RELATE body:european_parliament->decides->issue:income_tax CONTENT {
	weight: 0,
	basis: 'No authority over income tax rates. EU tax measures need unanimity in the Council (article 115 TFEU), and the Parliament is only consulted.',
};
RELATE body:conseil_de_paris->decides->issue:income_tax CONTENT {
	weight: 0,
	basis: 'No authority over income tax. The city sets local taxes such as the property tax (taxe foncière).',
};

RELATE body:idfm->decides->issue:public_transport CONTENT {
	weight: 0.30,
	basis: 'Runs public transport across Île-de-France, including the metro, RER, buses and trams, and sets the fares, such as the Navigo and Imagine R passes.',
};
RELATE body:conseil_de_paris->decides->issue:public_transport CONTENT {
	weight: 0.25,
	basis: 'Decides how Paris streets are shared: cycle lanes, pedestrian streets, parking and its price, and traffic on city roads. Also contributes to the budget of Île-de-France Mobilités.',
};
RELATE body:idf_council->decides->issue:public_transport CONTENT {
	weight: 0.10,
	basis: "Funds much of Île-de-France Mobilités' investment, and its president chairs the Île-de-France Mobilités board.",
};
RELATE body:mgp->decides->issue:public_transport CONTENT {
	weight: 0.05,
	basis: 'Adopted the low-emission zone (ZFE) for Greater Paris, which mayors apply in their communes.',
};
RELATE body:assemblee->decides->issue:public_transport CONTENT {
	weight: 0.12,
	basis: 'Votes national transport law, including the rules for low-emission zones (ZFE), and fuel taxes. Has the final word when the two chambers disagree.',
};
RELATE body:senat->decides->issue:public_transport CONTENT {
	weight: 0.05,
	basis: 'Votes national transport law as the second chamber.',
};
RELATE body:presidency->decides->issue:public_transport CONTENT {
	weight: 0.08,
	basis: 'The Government, appointed by the President, sets national transport policy, oversees the state-owned rail and Paris transport operators (SNCF and RATP), and issues the decrees that apply transport law.',
};
RELATE body:european_parliament->decides->issue:public_transport CONTENT {
	weight: 0.05,
	basis: 'Makes EU law with the Council on vehicle CO2 standards, rail and passenger rights.',
};

-- Measures -----------------------------------------------------------------
--
-- Each measure is one recorded vote. build.ts loads the individual votes for
-- every measure listed here, keyed by the same id.

CREATE measure:paris_2026_imagine_r CONTENT {
	title: 'Vœu 67, Conseil de Paris session of 16-19 June 2026, roll-call vote (annexe 16)',
	summary: 'Ask for the Imagine R transport pass to be free for every young person in Île-de-France.',
	issue: issue:public_transport,
	body: body:conseil_de_paris,
	date: d'2026-06-16',
	result: 'rejected',
	url: 'https://cdn.paris.fr/paris/2026/06/29/sommaire_juin_2026-sViD.pdf',
};
CREATE measure:paris_2026_traffic_plan CONTENT {
	title: 'Vœu 27, Conseil de Paris session of 15-18 July 2026, roll-call vote (annexe 13)',
	summary: 'Ask for a Paris traffic plan and smart traffic management.',
	issue: issue:public_transport,
	body: body:conseil_de_paris,
	date: d'2026-07-15',
	result: 'rejected',
	url: 'https://cdn.paris.fr/paris/2026/08/07/sommaire_juillet_2026-fj3k.pdf',
};
CREATE measure:an_2026_keep_zfe CONTENT {
	title: 'Amendment 7 to the single article of the bill to abolish low-emission zones (first reading)',
	summary: 'Delete the article that abolishes low-emission zones (ZFE), so that the zones stay in place.',
	issue: issue:public_transport,
	body: body:assemblee,
	date: d'2026-10-08',
	result: 'rejected',
	url: 'https://www.assemblee-nationale.fr/dyn/17/scrutins/8613',
};
CREATE measure:an_2026_brackets CONTENT {
	title: 'Amendment 17 to article 2 ter, finance bill for 2026 (new reading)',
	summary: 'Index every income tax bracket to inflation for 2026, raising each threshold by about 1.1% (the first from €11,497 to €11,624).',
	issue: issue:income_tax,
	body: body:assemblee,
	date: d'2026-01-14',
	result: 'adopted',
	url: 'https://www.assemblee-nationale.fr/dyn/17/scrutins/5012',
};
CREATE measure:an_2027_three_brackets CONTENT {
	title: 'Amendments 143, 2115, 3778 and 3927 to article 2, finance bill for 2027 (first reading)',
	summary: 'Limit the 2027 indexation of income tax brackets to the three lowest brackets.',
	issue: issue:income_tax,
	body: body:assemblee,
	date: d'2026-10-15',
	result: 'rejected',
	url: 'https://www.assemblee-nationale.fr/dyn/17/scrutins/8733',
};
CREATE measure:an_2027_brackets CONTENT {
	title: 'Article 2, finance bill for 2027 (first reading)',
	summary: 'Raise the thresholds of every income tax bracket by 2.1% for 2027.',
	issue: issue:income_tax,
	body: body:assemblee,
	date: d'2026-10-15',
	result: 'adopted',
	url: 'https://www.assemblee-nationale.fr/dyn/17/scrutins/8737',
};
CREATE measure:ep_2026_epr_suspension CONTENT {
	title: 'Suspending the application of the rules on extended producer responsibility for waste, waste electrical and electronic equipment and single use plastic waste (A10-0267/2026)',
	summary: 'Temporarily suspend parts of the EU extended producer responsibility rules for waste, electronic equipment and single-use plastics, ahead of new EU circularity rules.',
	issue: issue:household_waste,
	body: body:european_parliament,
	date: d'2026-10-20',
	result: 'adopted',
	url: 'https://howtheyvote.eu/votes/198335',
};

-- Elections ----------------------------------------------------------------
--
-- Dates are the scheduled months. Check them against the official calendar
-- before publishing, since a dissolution or a decree can move them.

CREATE election:presidential_2027 CONTENT {
	name: 'Presidential election',
	body: body:presidency,
	date: d'2027-04-01',
	date_note: 'April 2027; a decree sets the exact dates.',
	place: place:france,
	seats: 1,
	direct: true,
};
CREATE election:regional_2028 CONTENT {
	name: 'Île-de-France regional election',
	body: body:idf_council,
	date: d'2028-03-01',
	date_note: 'March 2028.',
	place: place:idf,
	seats: 209,
	direct: true,
};
CREATE election:legislative_2029 CONTENT {
	name: 'Legislative election',
	body: body:assemblee,
	date: d'2029-06-01',
	date_note: 'June 2029 at the latest; earlier if the Assemblée is dissolved.',
	place: place:france,
	seats: 1,
	direct: true,
};
CREATE election:european_2029 CONTENT {
	name: 'European Parliament election',
	body: body:european_parliament,
	date: d'2029-06-01',
	date_note: 'June 2029.',
	place: place:france,
	seats: 81,
	direct: true,
};
CREATE election:senate_paris_2029 CONTENT {
	name: 'Senate election for Paris',
	body: body:senat,
	date: d'2029-09-01',
	date_note: 'September 2029. Residents do not vote: an electoral college made up mostly of Paris councillors does.',
	place: place:paris,
	seats: 12,
	direct: false,
};
CREATE election:municipal_2032 CONTENT {
	name: 'Paris municipal election',
	body: body:conseil_de_paris,
	date: d'2032-03-01',
	date_note: 'March 2032.',
	place: place:paris,
	seats: 163,
	direct: true,
};
