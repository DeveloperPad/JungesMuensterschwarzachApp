ALTER TABLE `account_data` CHANGE `birthdate` `birthdate` TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE `account_data` CHANGE `registrationDate` `registrationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `account_data` CHANGE `modificationDate` `modificationDate` TIMESTAMP NULL DEFAULT NULL;