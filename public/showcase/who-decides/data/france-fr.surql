-- French text shared by every French dataset
--
-- Loaded after a city's own files into a second database, so the page can
-- show the same records in French. Only text fields change: ids, weights,
-- dates and votes stay as the English dataset has them. Each city's fr.surql
-- loads after this one and can override any line.

UPDATE place:eu SET name = 'Union européenne';

UPDATE body:presidency SET name = 'Président de la République';
UPDATE body:european_parliament SET name = 'Parlement européen';

UPDATE issue:household_waste SET name = 'Déchets ménagers', summary = 'Collecte, traitement et réduction des ordures ménagères, et propreté des rues.';
UPDATE issue:public_transport SET name = 'Transports en commun et voirie', summary = 'Offre et tarifs des transports en commun, vélo et marche, circulation et stationnement, et zones à faibles émissions.';
UPDATE issue:income_tax SET name = 'Impôt sur le revenu', summary = "Les tranches et les taux de l'impôt sur le revenu.";

UPDATE decides SET basis = "Vote la loi nationale sur les déchets, comme la loi anti-gaspillage de 2020 (AGEC), et la taxe sur la mise en décharge et l'incinération (TGAP). A le dernier mot en cas de désaccord entre les deux chambres." WHERE in = body:assemblee AND out = issue:household_waste;
UPDATE decides SET basis = 'Vote la loi nationale sur les déchets en tant que seconde chambre.' WHERE in = body:senat AND out = issue:household_waste;
UPDATE decides SET basis = "Le Gouvernement, nommé par le Président, propose la loi nationale sur les déchets et prend les décrets qui l'appliquent." WHERE in = body:presidency AND out = issue:household_waste;
UPDATE decides SET basis = "Fait le droit européen des déchets avec le Conseil, dont la directive-cadre sur les déchets et le règlement sur les emballages et les déchets d'emballages." WHERE in = body:european_parliament AND out = issue:household_waste;

UPDATE decides SET basis = "Vote la loi de finances annuelle, qui fixe les tranches et les taux de l'impôt sur le revenu. A le dernier mot en cas de désaccord entre les deux chambres." WHERE in = body:assemblee AND out = issue:income_tax;
UPDATE decides SET basis = 'Vote la loi de finances en tant que seconde chambre.' WHERE in = body:senat AND out = issue:income_tax;
UPDATE decides SET basis = "Le Gouvernement, nommé par le Président, prépare le projet de loi de finances et peut le faire adopter sans vote grâce à l'article 49.3 de la Constitution." WHERE in = body:presidency AND out = issue:income_tax;
UPDATE decides SET basis = "Aucune compétence sur les taux de l'impôt sur le revenu. Les mesures fiscales de l'UE exigent l'unanimité au Conseil (article 115 TFUE), et le Parlement est seulement consulté." WHERE in = body:european_parliament AND out = issue:income_tax;

UPDATE decides SET basis = 'Vote la loi nationale sur les transports, dont les règles des zones à faibles émissions (ZFE), et les taxes sur les carburants. A le dernier mot en cas de désaccord entre les deux chambres.' WHERE in = body:assemblee AND out = issue:public_transport;
UPDATE decides SET basis = 'Vote la loi nationale sur les transports en tant que seconde chambre.' WHERE in = body:senat AND out = issue:public_transport;
UPDATE decides SET basis = "Fait le droit européen avec le Conseil sur les normes de CO2 des véhicules, le rail et les droits des passagers." WHERE in = body:european_parliament AND out = issue:public_transport;

UPDATE measure:an_2026_keep_zfe SET
	title = "Amendement n° 7 à l'article unique du texte visant à supprimer les zones à faibles émissions (première lecture)",
	summary = "Supprimer l'article qui abolit les zones à faibles émissions (ZFE), afin de les maintenir.";
UPDATE measure:an_2026_brackets SET
	title = "Amendement n° 17 à l'article 2 ter, projet de loi de finances pour 2026 (nouvelle lecture)",
	summary = "Indexer toutes les tranches de l'impôt sur le revenu sur l'inflation pour 2026, en relevant chaque seuil d'environ 1,1 % (le premier passant de 11 497 € à 11 624 €).";
UPDATE measure:an_2027_three_brackets SET
	title = "Amendements n° 143, 2115, 3778 et 3927 à l'article 2, projet de loi de finances pour 2027 (première lecture)",
	summary = "Limiter l'indexation 2027 des tranches de l'impôt sur le revenu aux trois premières tranches.";
UPDATE measure:an_2027_brackets SET
	title = 'Article 2, projet de loi de finances pour 2027 (première lecture)',
	summary = "Relever de 2,1 % les seuils de toutes les tranches de l'impôt sur le revenu pour 2027.";
UPDATE measure:ep_2026_epr_suspension SET
	title = "Suspension de l'application des règles relatives à la responsabilité élargie des producteurs pour les déchets, les déchets d'équipements électriques et électroniques et les déchets de plastique à usage unique (A10-0267/2026)",
	summary = "Suspendre temporairement une partie des règles européennes de responsabilité élargie des producteurs pour les déchets, les équipements électroniques et les plastiques à usage unique, en attendant de nouvelles règles européennes sur l'économie circulaire.";

UPDATE election:presidential_2027 SET name = 'Élection présidentielle', date_note = 'Avril 2027 ; un décret fixe les dates exactes.';
UPDATE election:legislative_2029 SET name = 'Élections législatives', date_note = "Juin 2029 au plus tard ; plus tôt en cas de dissolution de l'Assemblée.";
UPDATE election:european_2029 SET name = 'Élections européennes', date_note = 'Juin 2029.';

-- Roles that only repeat the body's name are dropped, since French marks
-- them for gender and the dataset does not record it. Roles read from the
-- Répertoire national des élus are already in French and stay.
UPDATE holds SET role = NONE WHERE role IN ['Member', 'Deputy', 'Councillor', 'Senator', 'Delegate'];
UPDATE holds SET role = 'Président de la République' WHERE role = 'President';
