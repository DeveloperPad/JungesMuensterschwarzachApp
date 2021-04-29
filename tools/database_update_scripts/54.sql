UPDATE `access_levels` SET `accessLevel` = '5' WHERE `access_levels`.`accessLevel` = 50;
UPDATE `access_levels` SET `accessLevel` = '4', `accessIdentifier` = 'account_accessLevel_courseLeader' WHERE `access_levels`.`accessLevel` = 40;
UPDATE `access_levels` SET `accessLevel` = '2' WHERE `access_levels`.`accessLevel` = 30;
UPDATE `access_levels` SET `accessLevel` = '1' WHERE `access_levels`.`accessLevel` = 20;
UPDATE `access_levels` SET `accessLevel` = '0' WHERE `access_levels`.`accessLevel` = 10;
INSERT INTO `access_levels` (`accessLevel`, `accessIdentifier`) VALUES ('3', 'account_accessLevel_courseInstructor');
UPDATE `strings` SET `identifier` = 'account_accessLevel_courseLeader', `en` = 'Course Leader', `de` = 'Kursleitung' WHERE `strings`.`identifier` = 'account_accessLevel_moderator';
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_accessLevel_courseInstructor', 'Course Instructor', 'Kursleiter');
UPDATE `strings` SET `de` = 'Zugang zu den gespeicherten personenbezogenen Daten haben nur sehr wenige Personen.\r\nDies sind in vollem Umfang die Entwickler und die Kursleitung sowie in begrenztem Umfang die Kursleiter.\r\n\r\nDie Passwörter der Benutzer-Accounts werden zudem bereits vor dem Speichern in die Datenbank verschlüsselt und können deshalb von niemandem eingesehen werden.\r\n\r\nDie Datenbank selbst ist mit sehr sicheren Anmeldedaten geschützt, sodass Unbefugten der Zugang versagt ist.' WHERE `strings`.`identifier` = 'privacy_policy_technical_security_access_paragraph';
