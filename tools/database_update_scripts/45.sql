ALTER TABLE `newsletter_registrations` ADD `registered` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `code`;
ALTER TABLE `newsletter_registrations` ADD `activated` TIMESTAMP NULL DEFAULT NULL AFTER `activateUntil`, ADD INDEX (`activated`);