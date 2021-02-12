ALTER TABLE `event_images` DROP FOREIGN KEY fk_event_images_image_id;
ALTER TABLE `news_images` DROP FOREIGN KEY fk_news_images_imageId;
ALTER TABLE `image_library` CHANGE `imageId` `imageId` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `event_images` ADD CONSTRAINT `fk_event_images_image_id` FOREIGN KEY (`imageId`) REFERENCES `image_library`(`imageId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `news_images` ADD CONSTRAINT `fk_news_images_imageId` FOREIGN KEY (`imageId`) REFERENCES `image_library`(`imageId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `image_library` DROP `category`;
ALTER TABLE `image_library` CHANGE `path` `path` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;
ALTER TABLE `image_library` DROP `crc32`;
ALTER TABLE `image_library` DROP `size`;
INSERT INTO `strings` (`identifier`, `en`, `de`, `mode`) VALUES ('image_moving_failed', 'The uploaded image could not be moved to the destination folder on the server!', 'Das hochgeladene Bild konnte nicht ins Zielverzeichnis auf dem Server verschoben werden!', 'ANDROID+IOS+WEB');
DELETE FROM `indices` WHERE `indices`.`indexType` = 'image';