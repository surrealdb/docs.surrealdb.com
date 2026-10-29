-- Grenoble: French text, loaded after data/france/fr.surql

UPDATE appoints SET note = "Les conseillers municipaux de Grenoble, avec les délégués qu'ils désignent, font partie du collège électoral qui élit les 5 sénateurs de l'Isère." WHERE in = body:ville_grenoble AND out = body:senat;
UPDATE appoints SET note = 'Le conseil métropolitain désigne 16 des 29 délégués du SMMAG.' WHERE in = body:metropole AND out = body:smmag;
UPDATE appoints SET note = 'Le conseil départemental désigne 4 des 29 délégués du SMMAG.' WHERE in = body:isere_council AND out = body:smmag;

UPDATE decides SET basis = "Collecte et traite les déchets ménagers de ses 49 communes, exploite le centre de tri et l'incinérateur Athanor et la plateforme de compostage de Murianette, et fixe la taxe d'enlèvement des ordures ménagères (TEOM)." WHERE in = body:metropole AND out = issue:household_waste;
UPDATE decides SET basis = "Nettoie les rues et les espaces publics de Grenoble avec son propre service de propreté, vide les corbeilles de rue et mène ses propres projets, comme la collecte des emballages jetés dans l'espace public." WHERE in = body:ville_grenoble AND out = issue:household_waste;
UPDATE decides SET basis = 'Adopte le plan régional de prévention et de gestion des déchets, intégré au schéma régional (SRADDET), qui fixe les capacités de traitement et les objectifs.' WHERE in = body:aura_council AND out = issue:household_waste;

UPDATE decides SET basis = "Aucune compétence sur l'impôt sur le revenu. La Métropole fixe des impôts locaux comme la taxe d'enlèvement des ordures ménagères." WHERE in = body:metropole AND out = issue:income_tax;
UPDATE decides SET basis = "Aucune compétence sur l'impôt sur le revenu. La Ville fixe des impôts locaux comme la taxe foncière." WHERE in = body:ville_grenoble AND out = issue:income_tax;

UPDATE decides SET basis = 'Organise les transports en commun de l\'agglomération grenobloise, dont les tramways, les bus et la location de vélos (M réso), fixe les tarifs et les tarifs réduits, et planifie les itinéraires cyclables.' WHERE in = body:smmag AND out = issue:public_transport;
UPDATE decides SET basis = 'Construit et entretient les voiries et le réseau cyclable Chronovélo, gère les parkings publics, et a mis en place la zone à faibles émissions (ZFE) avec les communes.' WHERE in = body:metropole AND out = issue:public_transport;
UPDATE decides SET basis = 'Fixe les règles et les tarifs du stationnement sur voirie à Grenoble, et le maire réglemente la circulation dans les rues de la ville.' WHERE in = body:ville_grenoble AND out = issue:public_transport;
UPDATE decides SET basis = 'Organise les trains régionaux (TER) et les cars interurbains, et cofinance des projets de transport locaux.' WHERE in = body:aura_council AND out = issue:public_transport;
UPDATE decides SET basis = 'Entretient les routes départementales.' WHERE in = body:isere_council AND out = issue:public_transport;
UPDATE decides SET basis = "Le Gouvernement, nommé par le Président, fixe la politique nationale des transports, exerce la tutelle de l'opérateur ferroviaire public (SNCF), et prend les décrets d'application du droit des transports." WHERE in = body:presidency AND out = issue:public_transport;

UPDATE measure:metro_2026_methanisation SET
	title = 'Délibération DEL19062026281, conseil métropolitain du 19 juin 2026',
	summary = "Modifier le marché d'une unité de méthanisation des biodéchets sur la plateforme de compostage de Murianette : surélever le bâtiment de bureaux au-dessus du niveau d'inondation exigé par l'État (80 942 €) et préparer son toit pour des panneaux solaires.";
UPDATE measure:metro_2026_waste_surplus SET
	title = 'Délibération DEL19062026303, conseil métropolitain du 19 juin 2026',
	summary = "Affecter l'excédent 2025 du budget de collecte et de traitement des déchets : 9,99 millions d'euros pour financer l'investissement et 4,55 millions d'euros reportés en fonctionnement.";
UPDATE measure:city_2026_packaging_collection SET
	title = 'Délibération 25 (42889), conseil municipal du 26 mai 2026',
	summary = "Répondre à l'appel à projets de Citéo et Adelphe pour collecter, en vue de leur recyclage, les emballages jetés hors du foyer.";
UPDATE measure:smmag_2026_student_fares SET
	title = 'Délibération 31 (DL20260702078), comité syndical du SMMAG du 2 juillet 2026',
	summary = "Garder le tarif de transport le plus bas (Pastel A, 2,50 € par mois) ouvert aux étudiants à faibles revenus non boursiers, avec la complémentaire santé solidaire (CSS) comme justificatif.";
UPDATE measure:city_2026_disability_parking SET
	title = 'Délibération 77 (43389), conseil municipal du 29 juin 2026',
	summary = 'Créer un ticket dématérialisé et un abonnement de stationnement gratuit pour les titulaires de la carte mobilité inclusion portant la mention stationnement.';

UPDATE election:departmental_2028 SET name = "Élections départementales en Isère", date_note = 'Mars 2028. Chaque canton élit un binôme de conseillers.';
UPDATE election:regional_2028 SET name = 'Élections régionales en Auvergne-Rhône-Alpes', date_note = 'Mars 2028.';
UPDATE election:senate_isere_2029 SET name = "Élections sénatoriales en Isère", date_note = 'Septembre 2029. Les habitants ne votent pas : un collège électoral composé surtout de conseillers municipaux et de leurs délégués élit les sénateurs.';
UPDATE election:municipal_2032 SET name = 'Élections municipales à Grenoble', date_note = 'Mars 2032.';
UPDATE election:metropole_2032 SET name = 'Conseillers métropolitains, élus avec les municipales', date_note = 'Mars 2032. Les conseillers métropolitains de chaque commune sont élus sur le même bulletin que son conseil municipal.';
