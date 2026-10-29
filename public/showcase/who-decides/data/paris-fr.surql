-- Paris: French text, loaded after data/france/fr.surql

-- "Paris 9th arrondissement" becomes "Paris 9e arrondissement". The number
-- is read from the record id, such as place:paris_09.
FOR $p IN (SELECT VALUE id FROM place WHERE kind = 'arrondissement') {
	UPDATE $p SET name = 'Paris ' + <string> <int> record::id($p).slice(6) + 'e arrondissement';
};

UPDATE appoints SET note = 'Le Conseil de Paris désigne les délégués de Paris au comité du Syctom.' WHERE in = body:conseil_de_paris AND out = body:syctom;
UPDATE appoints SET note = 'Les membres parisiens du conseil de la Métropole sont choisis parmi les conseillers de Paris.' WHERE in = body:conseil_de_paris AND out = body:mgp;
UPDATE appoints SET note = "Les conseillers de Paris, avec les délégués qu'ils désignent, forment le collège électoral qui élit les 12 sénateurs de Paris." WHERE in = body:conseil_de_paris AND out = body:senat;
UPDATE appoints SET note = "Le Conseil de Paris élit 5 des 33 membres du conseil d'administration d'Île-de-France Mobilités." WHERE in = body:conseil_de_paris AND out = body:idfm;
UPDATE appoints SET note = "Le conseil régional élit 17 des 33 membres du conseil d'administration d'Île-de-France Mobilités, et la Région en assure la présidence." WHERE in = body:idf_council AND out = body:idfm;

UPDATE decides SET basis = "Collecte les déchets ménagers, nettoie les rues et fixe le taux de la taxe d'enlèvement des ordures ménagères (TEOM)." WHERE in = body:conseil_de_paris AND out = issue:household_waste;
UPDATE decides SET basis = "Traite et trie les déchets ménagers collectés à Paris et dans les communes voisines, et exploite les centres d'incinération et de tri." WHERE in = body:syctom AND out = issue:household_waste;
UPDATE decides SET basis = 'Adopte le plan régional de prévention et de gestion des déchets (PRPGD), qui fixe les capacités de traitement et les objectifs.' WHERE in = body:idf_council AND out = issue:household_waste;
UPDATE decides SET basis = "Aucune compétence sur l'impôt sur le revenu. La Ville fixe des impôts locaux comme la taxe foncière." WHERE in = body:conseil_de_paris AND out = issue:income_tax;
UPDATE decides SET basis = 'Organise les transports en commun dans toute l\'Île-de-France, dont le métro, le RER, les bus et les tramways, et fixe les tarifs, comme ceux des passes Navigo et Imagine R.' WHERE in = body:idfm AND out = issue:public_transport;
UPDATE decides SET basis = "Décide du partage des rues de Paris : pistes cyclables, rues piétonnes, stationnement et son prix, et circulation sur les voies de la Ville. Contribue aussi au budget d'Île-de-France Mobilités." WHERE in = body:conseil_de_paris AND out = issue:public_transport;
UPDATE decides SET basis = "Finance une grande part des investissements d'Île-de-France Mobilités, et la présidence de la Région préside son conseil d'administration." WHERE in = body:idf_council AND out = issue:public_transport;
UPDATE decides SET basis = 'A adopté la zone à faibles émissions (ZFE) du Grand Paris, que les maires appliquent dans leurs communes.' WHERE in = body:mgp AND out = issue:public_transport;
UPDATE decides SET basis = "Le Gouvernement, nommé par le Président, fixe la politique nationale des transports, exerce la tutelle des opérateurs publics du rail et des transports parisiens (SNCF et RATP), et prend les décrets d'application du droit des transports." WHERE in = body:presidency AND out = issue:public_transport;

UPDATE measure:paris_2026_imagine_r SET
	title = 'Vœu 67, séance du Conseil de Paris des 16-19 juin 2026, scrutin public (annexe 16)',
	summary = 'Demander la gratuité du passe Imagine R pour tous les jeunes d\'Île-de-France.';
UPDATE measure:paris_2026_traffic_plan SET
	title = 'Vœu 27, séance du Conseil de Paris des 15-18 juillet 2026, scrutin public (annexe 13)',
	summary = 'Demander un plan de circulation pour Paris et une gestion intelligente du trafic.';

UPDATE election:regional_2028 SET name = 'Élections régionales en Île-de-France', date_note = 'Mars 2028.';
UPDATE election:senate_paris_2029 SET name = 'Élections sénatoriales à Paris', date_note = 'Septembre 2029. Les habitants ne votent pas : un collège électoral composé surtout de conseillers de Paris élit les sénateurs.';
UPDATE election:municipal_2032 SET name = 'Élections municipales à Paris', date_note = 'Mars 2032.';
