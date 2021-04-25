ALTER TABLE `account_data` ADD `supplementaryAddress` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER `houseNumber`;
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_supplementaryAddress_invalid', 'This supplementary address is not valid.', 'Dieser Adresszusatz ist ungültig.');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_supplementaryAddress_updated', 'The supplementary address got updated successfully.', 'Der Adresszusatz wurde erfolgreich aktualisiert.');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_supplementaryAddress', 'Supplementary address', 'Adresszusatz');
INSERT INTO `strings` (`identifier`, `en`, `de`) VALUES ('account_supplementaryAddress_placeholder', 'Enter the supplementary address here.', 'Gib den Addresszusatz ein.');
