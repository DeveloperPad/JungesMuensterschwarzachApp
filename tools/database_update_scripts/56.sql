INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('event_checkInDate', 'Check-In Date', 'Eincheck-Datum');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('event_eventEnrollmentPublicMediaUsageConsent_short', 'Consent public media usage', 'Mediennutzung Öffentlichkeitsarbeit');
UPDATE `strings` SET `en` = 'Media usage', `de` = 'Mediennutzung' WHERE `strings`.`identifier` = 'event_eventEnrollmentPublicMediaUsageConsent_short';