ALTER TABLE `account_data` CHANGE `registrationDate` `registrationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `account_data` ADD `allowNewsletter` TINYINT NOT NULL DEFAULT '0' AFTER `allowPost`, ADD INDEX (`allowNewsletter`);
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_allowNewsletter', 'Allow us to send newsletter mails.', 'Uns erlauben, Newsletter per E-Mail zuzustellen.');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_allowNewsletter_invalid', 'Receiving newsletters must be a binary value (yes/no)!', 'Das Erhalten von Newslettern muss ein binärer Wert sein (ja/nein)!');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_allowNewsletter_label', 'Newsletter', 'Newsletter');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_allowNewsletter_updated', 'Receiving newsletters has been updated.', 'Der Erhalt von Newslettern wurde erfolgreich aktualisiert.');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_allowNewsletter_registration', 'I want to be informed about news related to Junges Münsterschwarzach via e-mail newsletter at irregular intervals.', 'Ich möchte über Neuigkeiten bezüglich Junges Münsterschwarzach per E-Mail-Newsletter in unregelmäßigen Abständen informiert werden.');
