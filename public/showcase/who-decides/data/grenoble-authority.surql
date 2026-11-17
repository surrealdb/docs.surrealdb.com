-- Grenoble: the hand-written part of the dataset
--
-- This file holds the judgements: which bodies exist, which issues they
-- decide and how much of each, how members reach them, which votes count as
-- measures, and when the next elections are. Everything that can be read from
-- a public register (outlines, officials, seats, groups, votes) is in
-- generated.surql, which build.ts writes from the files in raw/.
--
-- To add an issue, add an `issue`, its `decides` edges and its measures here,
-- and the vote references to build.ts. Nothing in schema.surql changes.

-- Places above the communes and constituencies build.ts reads from outlines

CREATE place:eu SET name = 'European Union', kind = 'union';
CREATE place:france SET name = 'France', kind = 'country';
CREATE place:aura SET name = 'Auvergne-Rhône-Alpes', kind = 'region';
CREATE place:isere SET name = 'Isère', kind = 'département';
CREATE place:grenoble_metropole SET name = 'Grenoble-Alpes Métropole', kind = 'metropolis';

RELATE place:france->within->place:eu;
RELATE place:aura->within->place:france;
RELATE place:isere->within->place:aura;
RELATE place:grenoble_metropole->within->place:isere;

-- Bodies -------------------------------------------------------------------

CREATE body:ville_grenoble CONTENT {
	name: 'Conseil municipal de Grenoble',
	kind: 'city council',
	seats: 59,
	url: 'https://www.grenoble.fr/121-conseil-municipal.htm',
};
CREATE body:metropole CONTENT {
	name: 'Conseil métropolitain de Grenoble-Alpes Métropole',
	kind: 'metropolitan council',
	seats: 110,
	url: 'https://www.grenoblealpesmetropole.fr/279-seances-du-conseil.htm',
};
CREATE body:smmag CONTENT {
	name: "Syndicat mixte des mobilités de l'aire grenobloise (SMMAG)",
	kind: 'transport authority',
	seats: 29,
	url: 'https://smmag.fr/le-smmag/les-elus/',
};
CREATE body:isere_council CONTENT {
	name: "Conseil départemental de l'Isère",
	kind: 'departmental council',
	seats: 58,
	url: 'https://www.isere.fr',
};
CREATE body:aura_council CONTENT {
	name: 'Conseil régional Auvergne-Rhône-Alpes',
	kind: 'regional council',
	seats: 204,
	url: 'https://www.auvergnerhonealpes.fr',
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
CREATE body:european_parliament CONTENT {
	name: 'European Parliament',
	kind: 'parliament',
	seats: 720,
	url: 'https://www.europarl.europa.eu',
};

RELATE body:ville_grenoble->acts_for->place:grenoble;
RELATE body:metropole->acts_for->place:grenoble_metropole;
RELATE body:aura_council->acts_for->place:aura;
RELATE body:smmag->acts_for->place:grenoble_metropole;
RELATE body:isere_council->acts_for->place:isere;
RELATE body:presidency->acts_for->place:france;
RELATE body:assemblee->acts_for->place:france;
RELATE body:senat->acts_for->place:france;
RELATE body:european_parliament->acts_for->place:eu;

RELATE body:ville_grenoble->appoints->body:senat CONTENT {
	note: "Grenoble's councillors, with delegates they choose, are part of the electoral college that elects the 5 senators for Isère.",
};

RELATE body:metropole->appoints->body:smmag CONTENT {
	seats: 16,
	note: 'The Métropole council appoints 16 of the 29 SMMAG delegates.',
};
RELATE body:isere_council->appoints->body:smmag CONTENT {
	seats: 4,
	note: 'The departmental council appoints 4 of the 29 SMMAG delegates.',
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

RELATE body:metropole->decides->issue:household_waste CONTENT {
	weight: 0.50,
	basis: 'Collects and treats household waste for its 49 communes, runs the Athanor sorting centre and incinerator and the Murianette composting site, and sets the household waste collection tax (TEOM).',
};
RELATE body:ville_grenoble->decides->issue:household_waste CONTENT {
	weight: 0.15,
	basis: 'Cleans the streets and public spaces of Grenoble with its own street-cleaning service, empties public bins, and runs its own projects such as collecting packaging thrown away in public spaces.',
};
RELATE body:aura_council->decides->issue:household_waste CONTENT {
	weight: 0.05,
	basis: 'Adopts the regional waste prevention and management plan, part of the regional plan (SRADDET), which sets treatment capacity and targets.',
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
RELATE body:metropole->decides->issue:income_tax CONTENT {
	weight: 0,
	basis: 'No authority over income tax. The Métropole sets local taxes such as the household waste collection tax.',
};
RELATE body:ville_grenoble->decides->issue:income_tax CONTENT {
	weight: 0,
	basis: 'No authority over income tax. The city sets local taxes such as the property tax (taxe foncière).',
};

RELATE body:smmag->decides->issue:public_transport CONTENT {
	weight: 0.35,
	basis: 'Runs public transport around Grenoble, including trams, buses and bike hire (M réso), sets the fares and reduced fares, and plans cycle routes.',
};
RELATE body:metropole->decides->issue:public_transport CONTENT {
	weight: 0.20,
	basis: 'Builds and maintains roads and the Chronovélo cycle network, runs public car parks, and set up the low-emission zone (ZFE) with the communes.',
};
RELATE body:ville_grenoble->decides->issue:public_transport CONTENT {
	weight: 0.05,
	basis: 'Sets on-street parking rules and prices in Grenoble, and the mayor regulates traffic on city streets.',
};
RELATE body:aura_council->decides->issue:public_transport CONTENT {
	weight: 0.10,
	basis: 'Runs regional trains (TER) and intercity coaches, and co-funds local transport projects.',
};
RELATE body:isere_council->decides->issue:public_transport CONTENT {
	weight: 0.03,
	basis: 'Maintains departmental roads.',
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
	weight: 0.06,
	basis: 'The Government, appointed by the President, sets national transport policy, oversees the state-owned rail operator (SNCF), and issues the decrees that apply transport law.',
};
RELATE body:european_parliament->decides->issue:public_transport CONTENT {
	weight: 0.04,
	basis: 'Makes EU law with the Council on vehicle CO2 standards, rail and passenger rights.',
};

-- Measures -----------------------------------------------------------------
--
-- Each measure is one recorded vote. build.ts loads the individual or group
-- votes for every measure listed here, keyed by the same id.

CREATE measure:metro_2026_methanisation CONTENT {
	title: 'Deliberation DEL19062026281, Métropole council of 19 June 2026',
	summary: 'Amend the contract for a food-waste methanisation unit at the Murianette composting site: raise the office building above the flood level the State required (€80,942) and prepare its roof for solar panels.',
	issue: issue:household_waste,
	body: body:metropole,
	date: d'2026-06-19',
	result: 'adopted',
	url: 'https://www.grenoblealpesmetropole.fr/cms_viewFile.php?idtf=6655&path=PV-CM-19-06-2026.pdf',
};
CREATE measure:metro_2026_waste_surplus CONTENT {
	title: 'Deliberation DEL19062026303, Métropole council of 19 June 2026',
	summary: 'Use the 2025 surplus of the waste collection and treatment budget: €9.99 million to fund investment and €4.55 million carried into the operating budget.',
	issue: issue:household_waste,
	body: body:metropole,
	date: d'2026-06-19',
	result: 'adopted',
	url: 'https://www.grenoblealpesmetropole.fr/cms_viewFile.php?idtf=6655&path=PV-CM-19-06-2026.pdf',
};
CREATE measure:city_2026_packaging_collection CONTENT {
	title: 'Deliberation 25 (42889), city council of 26 May 2026',
	summary: 'Apply to the Citéo/Adelphe call for projects to collect, for recycling, packaging thrown away outside the home.',
	issue: issue:household_waste,
	body: body:ville_grenoble,
	date: d'2026-05-26',
	result: 'adopted',
	url: 'https://www.grenoble.fr/include/viewFile.php?idtf=53652&name=Liste+des+d%C3%A9lib%C3%A9rations+du+conseil+municipal+du+26+mai+2026',
};
CREATE measure:smmag_2026_student_fares CONTENT {
	title: 'Deliberation 31 (DL20260702078), SMMAG committee of 2 July 2026',
	summary: 'Keep the lowest public transport fare (Pastel A, €2.50 a month) open to low-income students without a grant, using the solidarity health cover (CSS) as proof.',
	issue: issue:public_transport,
	body: body:smmag,
	date: d'2026-07-02',
	result: 'adopted',
	url: 'https://smmag.fr/wp-content/uploads/2026/10/Jeudi-2-juillet-2026-Proces-Verbal.pdf',
};
CREATE measure:city_2026_disability_parking CONTENT {
	title: 'Deliberation 77 (43389), city council of 29 June 2026',
	summary: 'Create an e-ticket and a free parking subscription for holders of the disability mobility card (carte mobilité inclusion) with the parking mention.',
	issue: issue:public_transport,
	body: body:ville_grenoble,
	date: d'2026-06-29',
	result: 'adopted',
	url: 'https://www.grenoble.fr/include/viewFile.php?idtf=53903&name=Liste+des+d%C3%A9lib%C3%A9rations+du+conseil+municipal+du+29+juin+2026',
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
CREATE election:departmental_2028 CONTENT {
	name: 'Isère departmental election',
	body: body:isere_council,
	date: d'2028-03-01',
	date_note: 'March 2028. Each canton elects a pair of councillors.',
	place: place:isere,
	seats: 2,
	direct: true,
};
CREATE election:regional_2028 CONTENT {
	name: 'Auvergne-Rhône-Alpes regional election',
	body: body:aura_council,
	date: d'2028-03-01',
	date_note: 'March 2028.',
	place: place:aura,
	seats: 204,
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
CREATE election:senate_isere_2029 CONTENT {
	name: 'Senate election for Isère',
	body: body:senat,
	date: d'2029-09-01',
	date_note: 'September 2029. Residents do not vote: an electoral college made up mostly of municipal councillors and their delegates does.',
	place: place:isere,
	seats: 5,
	direct: false,
};
CREATE election:municipal_2032 CONTENT {
	name: 'Grenoble municipal election',
	body: body:ville_grenoble,
	date: d'2032-03-01',
	date_note: 'March 2032.',
	place: place:grenoble,
	seats: 59,
	direct: true,
};
CREATE election:metropole_2032 CONTENT {
	name: 'Métropole councillors, on the municipal ballot',
	body: body:metropole,
	date: d'2032-03-01',
	date_note: "March 2032. Each commune's Métropole councillors are elected on the same ballot as its municipal council.",
	place: place:grenoble_metropole,
	seats: 110,
	direct: true,
};
