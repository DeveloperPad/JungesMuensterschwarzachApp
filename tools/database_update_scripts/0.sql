-- MySQL dump 10.13  Distrib 5.7.21, for Win64 (x86_64)
--
-- Host: localhost    Database: junges_muensterschwarzach_app
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_levels`
--

DROP TABLE IF EXISTS `access_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_levels` (
  `accessLevel` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `accessIdentifier` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`accessLevel`),
  UNIQUE KEY `accessName` (`accessIdentifier`),
  KEY `accessLevel` (`accessLevel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_levels`
--

LOCK TABLES `access_levels` WRITE;
/*!40000 ALTER TABLE `access_levels` DISABLE KEYS */;
INSERT INTO `access_levels` VALUES (50,'account_accessLevel_developer'),(30,'account_accessLevel_editor'),(10,'account_accessLevel_guest'),(40,'account_accessLevel_moderator'),(20,'account_accessLevel_user');
/*!40000 ALTER TABLE `access_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_data`
--

DROP TABLE IF EXISTS `account_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_data` (
  `userId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `displayName` varchar(30) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `eMailAddress` varchar(100) NOT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `houseNumber` varchar(10) DEFAULT NULL,
  `zipCode` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `eatingHabits` text,
  `allowPost` tinyint(1) NOT NULL DEFAULT '0',
  `passwordHash` varchar(255) NOT NULL,
  `sessionHash` varchar(255) DEFAULT NULL,
  `isActivated` tinyint(1) NOT NULL DEFAULT '0',
  `accessLevel` tinyint(3) unsigned NOT NULL DEFAULT '20',
  `registrationDate` date NOT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `eMailAddress` (`eMailAddress`),
  UNIQUE KEY `displayName` (`displayName`),
  UNIQUE KEY `sessionHash` (`sessionHash`),
  KEY `userID` (`userId`),
  KEY `accessLevel` (`accessLevel`),
  CONSTRAINT `fk_account_data_accessLevel` FOREIGN KEY (`accessLevel`) REFERENCES `access_levels` (`accessLevel`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_data`
--

LOCK TABLES `account_data` WRITE;
/*!40000 ALTER TABLE `account_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_devices`
--

DROP TABLE IF EXISTS `account_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_devices` (
  `userId` int(10) unsigned DEFAULT NULL,
  `browserFingerprint` varchar(255) NOT NULL,
  `fcmToken` varchar(255) NOT NULL,
  UNIQUE KEY `fcmToken` (`fcmToken`),
  KEY `fk_account_devices_user_id` (`userId`),
  CONSTRAINT `fk_account_devices_user_id` FOREIGN KEY (`userId`) REFERENCES `account_data` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_devices`
--

LOCK TABLES `account_devices` WRITE;
/*!40000 ALTER TABLE `account_devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_tokens`
--

DROP TABLE IF EXISTS `account_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_tokens` (
  `code` varchar(255) NOT NULL,
  `tokenType` enum('ACTIVATION','PASSWORD_RESET','E_MAIL_UPDATE','DELETION') NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `validUntil` date NOT NULL,
  PRIMARY KEY (`code`),
  KEY `fk_account_tokens_userId` (`userId`),
  CONSTRAINT `fk_account_tokens_userId` FOREIGN KEY (`userId`) REFERENCES `account_data` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_tokens`
--

LOCK TABLES `account_tokens` WRITE;
/*!40000 ALTER TABLE `account_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_transfers`
--

DROP TABLE IF EXISTS `account_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_transfers` (
  `userId` int(10) unsigned NOT NULL,
  `newEMailAddress` varchar(100) NOT NULL,
  `oldEMailAddressConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`) USING BTREE,
  UNIQUE KEY `newEMailAddress` (`newEMailAddress`),
  CONSTRAINT `fk_account_transfers_userId` FOREIGN KEY (`userId`) REFERENCES `account_data` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_transfers`
--

LOCK TABLES `account_transfers` WRITE;
/*!40000 ALTER TABLE `account_transfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_arrivals`
--

DROP TABLE IF EXISTS `event_arrivals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_arrivals` (
  `eventArrivalId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventArrivalTitle` varchar(100) NOT NULL,
  `eventArrivalContent` text NOT NULL,
  PRIMARY KEY (`eventArrivalId`),
  UNIQUE KEY `eventOfferTitle` (`eventArrivalTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_arrivals`
--

LOCK TABLES `event_arrivals` WRITE;
/*!40000 ALTER TABLE `event_arrivals` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_arrivals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_enrollments`
--

DROP TABLE IF EXISTS `event_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_enrollments` (
  `enrollmentId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `eventEnrollmentComment` text NOT NULL,
  `enrollmentDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollmentId`),
  KEY `fk_event_participation_event_id` (`eventId`),
  KEY `fk_event_participation_user_id` (`userId`),
  CONSTRAINT `fk_event_participation_event_id` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_event_participation_user_id` FOREIGN KEY (`userId`) REFERENCES `account_data` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_enrollments`
--

LOCK TABLES `event_enrollments` WRITE;
/*!40000 ALTER TABLE `event_enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_images`
--

DROP TABLE IF EXISTS `event_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_images` (
  `eventId` int(10) unsigned NOT NULL,
  `imageId` int(10) unsigned NOT NULL,
  KEY `fk_event_images_event_id` (`eventId`),
  KEY `fk_event_images_image_id` (`imageId`),
  CONSTRAINT `fk_event_images_event_id` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_event_images_image_id` FOREIGN KEY (`imageId`) REFERENCES `image_library` (`imageId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_images`
--

LOCK TABLES `event_images` WRITE;
/*!40000 ALTER TABLE `event_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_locations`
--

DROP TABLE IF EXISTS `event_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_locations` (
  `eventLocationId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventLocationTitle` varchar(100) NOT NULL,
  `eventLocationLatitude` decimal(10,7) NOT NULL,
  `eventLocationLongitude` decimal(10,7) NOT NULL,
  PRIMARY KEY (`eventLocationId`),
  UNIQUE KEY `eventLocationTitle` (`eventLocationTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_locations`
--

LOCK TABLES `event_locations` WRITE;
/*!40000 ALTER TABLE `event_locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_offers`
--

DROP TABLE IF EXISTS `event_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_offers` (
  `eventOfferId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventOfferTitle` varchar(100) NOT NULL,
  `eventOfferContent` text NOT NULL,
  PRIMARY KEY (`eventOfferId`),
  UNIQUE KEY `eventOfferTitle` (`eventOfferTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_offers`
--

LOCK TABLES `event_offers` WRITE;
/*!40000 ALTER TABLE `event_offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_packing_lists`
--

DROP TABLE IF EXISTS `event_packing_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_packing_lists` (
  `eventPackingListId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventPackingListTitle` varchar(100) NOT NULL,
  `eventPackingListContent` text NOT NULL,
  PRIMARY KEY (`eventPackingListId`),
  UNIQUE KEY `eventPackingListTitle` (`eventPackingListTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_packing_lists`
--

LOCK TABLES `event_packing_lists` WRITE;
/*!40000 ALTER TABLE `event_packing_lists` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_packing_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_prices`
--

DROP TABLE IF EXISTS `event_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_prices` (
  `eventPriceId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventPriceTitle` varchar(100) NOT NULL,
  `eventPriceContent` text NOT NULL,
  PRIMARY KEY (`eventPriceId`),
  UNIQUE KEY `eventPriceTitle` (`eventPriceTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_prices`
--

LOCK TABLES `event_prices` WRITE;
/*!40000 ALTER TABLE `event_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_schedules`
--

DROP TABLE IF EXISTS `event_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_schedules` (
  `eventScheduleId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventScheduleTitle` varchar(100) NOT NULL,
  `eventScheduleContent` text NOT NULL,
  PRIMARY KEY (`eventScheduleId`),
  UNIQUE KEY `eventScheduleTitle` (`eventScheduleTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_schedules`
--

LOCK TABLES `event_schedules` WRITE;
/*!40000 ALTER TABLE `event_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_target_groups`
--

DROP TABLE IF EXISTS `event_target_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_target_groups` (
  `eventTargetGroupId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventTargetGroupTitle` varchar(100) NOT NULL,
  `eventTargetGroupContent` text NOT NULL,
  PRIMARY KEY (`eventTargetGroupId`),
  UNIQUE KEY `eventTargetGroupTitle` (`eventTargetGroupTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_target_groups`
--

LOCK TABLES `event_target_groups` WRITE;
/*!40000 ALTER TABLE `event_target_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_target_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `eventId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `eventTitle` varchar(100) NOT NULL,
  `eventTopic` varchar(100) NOT NULL,
  `eventDetails` text NOT NULL,
  `eventStart` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventEnd` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventEnrollmentStart` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventEnrollmentEnd` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventOfferId` int(10) unsigned NOT NULL,
  `eventScheduleId` int(10) unsigned NOT NULL,
  `eventTargetGroupId` int(10) unsigned NOT NULL,
  `eventPriceId` int(10) unsigned NOT NULL,
  `eventPackingListId` int(10) unsigned NOT NULL,
  `eventLocationId` int(10) unsigned NOT NULL,
  `eventArrivalId` int(10) unsigned NOT NULL,
  `requiredAccessLevel` tinyint(3) unsigned NOT NULL,
  `eventModificationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`eventId`),
  KEY `fk_events_event_location_id` (`eventLocationId`),
  KEY `fk_events_event_offer_id` (`eventOfferId`),
  KEY `fk_events_event_packing_list_id` (`eventPackingListId`),
  KEY `fk_events_event_price_id` (`eventPriceId`),
  KEY `fk_events_event_schedule_id` (`eventScheduleId`),
  KEY `fk_events_event_target_group_id` (`eventTargetGroupId`),
  KEY `fk_events_required_access_level` (`requiredAccessLevel`),
  KEY `fk_events_event_arrival_id` (`eventArrivalId`),
  CONSTRAINT `fk_events_event_arrival_id` FOREIGN KEY (`eventArrivalId`) REFERENCES `event_arrivals` (`eventArrivalId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_event_location_id` FOREIGN KEY (`eventLocationId`) REFERENCES `event_locations` (`eventLocationId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_event_offer_id` FOREIGN KEY (`eventOfferId`) REFERENCES `event_offers` (`eventOfferId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_event_packing_list_id` FOREIGN KEY (`eventPackingListId`) REFERENCES `event_packing_lists` (`eventPackingListId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_event_price_id` FOREIGN KEY (`eventPriceId`) REFERENCES `event_prices` (`eventPriceId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_event_schedule_id` FOREIGN KEY (`eventScheduleId`) REFERENCES `event_schedules` (`eventScheduleId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_event_target_group_id` FOREIGN KEY (`eventTargetGroupId`) REFERENCES `event_target_groups` (`eventTargetGroupId`) ON UPDATE CASCADE,
  CONSTRAINT `fk_events_required_access_level` FOREIGN KEY (`requiredAccessLevel`) REFERENCES `access_levels` (`accessLevel`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_library`
--

DROP TABLE IF EXISTS `image_library`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image_library` (
  `imageId` int(10) unsigned NOT NULL,
  `category` enum('NEWS','EVENT') CHARACTER SET utf8 NOT NULL,
  `path` varchar(255) CHARACTER SET utf8 NOT NULL,
  `crc32` varchar(25) COLLATE utf8_bin NOT NULL,
  `size` int(10) unsigned NOT NULL,
  PRIMARY KEY (`imageId`),
  UNIQUE KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_library`
--

LOCK TABLES `image_library` WRITE;
/*!40000 ALTER TABLE `image_library` DISABLE KEYS */;
/*!40000 ALTER TABLE `image_library` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indices`
--

DROP TABLE IF EXISTS `indices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indices` (
  `indexType` varchar(255) COLLATE utf8_bin NOT NULL,
  `indexValue` int(11) NOT NULL,
  PRIMARY KEY (`indexType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indices`
--

LOCK TABLES `indices` WRITE;
/*!40000 ALTER TABLE `indices` DISABLE KEYS */;
INSERT INTO `indices` VALUES ('database',0),('image',0);
/*!40000 ALTER TABLE `indices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `newsId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `summary` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `authorId` int(10) unsigned DEFAULT NULL,
  `requiredAccessLevel` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `postingDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modificationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`newsId`),
  KEY `authorId` (`authorId`),
  KEY `requiredAccessLevel` (`requiredAccessLevel`),
  CONSTRAINT `fk_news_accessLevel` FOREIGN KEY (`requiredAccessLevel`) REFERENCES `access_levels` (`accessLevel`) ON UPDATE CASCADE,
  CONSTRAINT `fk_news_userId` FOREIGN KEY (`authorId`) REFERENCES `account_data` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_images`
--

DROP TABLE IF EXISTS `news_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_images` (
  `newsId` int(10) unsigned NOT NULL,
  `imageId` int(10) unsigned NOT NULL,
  KEY `imageId` (`imageId`),
  KEY `newsId` (`newsId`),
  CONSTRAINT `fk_news_images_imageId` FOREIGN KEY (`imageId`) REFERENCES `image_library` (`imageId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_news_images_newsId` FOREIGN KEY (`newsId`) REFERENCES `news` (`newsId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_images`
--

LOCK TABLES `news_images` WRITE;
/*!40000 ALTER TABLE `news_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `news_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `strings`
--

DROP TABLE IF EXISTS `strings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strings` (
  `identifier` varchar(100) COLLATE utf8_bin NOT NULL,
  `en` text COLLATE utf8_bin NOT NULL,
  `de` text COLLATE utf8_bin NOT NULL,
  `mode` enum('ANDROID','IOS','WEB','ANDROID+IOS','ANDROID+IOS+WEB') COLLATE utf8_bin NOT NULL DEFAULT 'ANDROID+IOS+WEB',
  PRIMARY KEY (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `strings`
--

LOCK TABLES `strings` WRITE;
/*!40000 ALTER TABLE `strings` DISABLE KEYS */;
INSERT INTO `strings` VALUES ('account_accessLevel','Access level','Berechtigungsstufe','WEB'),('account_accessLevel_developer','Developer','Entwickler','WEB'),('account_accessLevel_editor','Editor','Redakteur','WEB'),('account_accessLevel_guest','Guest','Gast','WEB'),('account_accessLevel_invalid','The selected access level is invalid.','Die ausgewählte Berechtigungsstufe ist ungültig.','WEB'),('account_accessLevel_moderator','Moderator','Moderator','WEB'),('account_accessLevel_updated','The access level got updated successfully.','Die Berechtigungsstufe wurde erfolgreich aktualisiert.','WEB'),('account_accessLevel_user','User','Benutzer','WEB'),('account_add','Create new account','Neuen Account anlegen','WEB'),('account_allowPost','Allow us to send physical mails to the provided address.','Uns erlauben, Post an die angegebene Adresse zu senden.','ANDROID+IOS+WEB'),('account_allowPost_invalid','The reception of physical mails must be a binary value (yes/no)!','Das Erhalten von physischer Post muss ein binärer Wert sein (ja/nein)!','ANDROID+IOS+WEB'),('account_allowPost_label','Postal delivery','Postzustellung','WEB'),('account_allowPost_updated','The reception of physical mails got updated successfully.','Der Erhalt physischer Post wurde erfolgreich aktualisiert.','WEB'),('account_birthdate','Birthdate','Geburtsdatum','ANDROID+IOS+WEB'),('account_birthdate_invalid','The birthdate cannot be in the future.','Das Geburtsdatum kann nicht in der Zukunft liegen.','ANDROID+IOS+WEB'),('account_birthdate_malformed','This birthdate is malformed.','Das Format des Geburtsdatums ist nicht korrekt.','ANDROID+IOS+WEB'),('account_birthdate_placeholder','Enter the birthdate here.','Gib das Geburtsdatum ein.','ANDROID+IOS+WEB'),('account_birthdate_updated','The birthdate got updated successfully.','Das Geburtsdatum wurde erfolgreich aktualisiert.','WEB'),('account_city','City','Wohnort','ANDROID+IOS+WEB'),('account_city_invalid','This city name is not valid.','Dieser Ortsname ist ungültig.','ANDROID+IOS+WEB'),('account_city_placeholder','Enter the city here.','Gib den Wohnort ein.','ANDROID+IOS+WEB'),('account_city_updated','The city got updated successfully.','Der Wohnort wurde erfolgreich aktualisiert.','WEB'),('account_country','Country','Land','ANDROID+IOS+WEB'),('account_country_invalid','This country name is not valid.','Dieser Ländername ist ungültig.','ANDROID+IOS+WEB'),('account_country_placeholder','Enter the country here.','Gib das Land ein.','ANDROID+IOS+WEB'),('account_country_updated','The country got updated successfully.','Das Land wurde erfolgreich aktualisiert.','WEB'),('account_creation_failed','Your account could not been created. Please contact an administrator.','Der Account konnte nicht erstellt werden. Kontaktiere bitte einen Administrator.','ANDROID+IOS+WEB'),('account_creation_success','The account has been successfully created, but needs to be activated with a token, which has been sent to the specified e-mail address.','Der Account wurde erfolgreich erstellt, aber muss noch mit einem Token aktiviert werden, der an die angegebene E-Mail-Adresse gesendet wurde.','ANDROID+IOS+WEB'),('account_credentials_event','These credentials are required for enrolling in events.','Diese Accountdaten werden für die Teilnahme an Veranstaltungen benötigt.','ANDROID+IOS+WEB'),('account_credentials_insufficient','The credentials could not been fully received by the webservice.','Die Nutzerdaten sind nicht vollständig beim Webservice angekommen.','ANDROID+IOS+WEB'),('account_credentials_mark','*','*','ANDROID+IOS+WEB'),('account_credentials_signUp','These credentials are required for having an account.','Diese Accountdaten werden für das Innehaben eines Accounts benötigt.','ANDROID+IOS+WEB'),('account_data','User Data','Benutzerdaten','ANDROID+IOS'),('account_data_not_loaded','User Data could not be loaded.','Die Benutzerdaten konnten nicht geladen werden.','ANDROID+IOS+WEB'),('account_deletion','Delete this account permanently','Diesen Account endgültig löschen','ANDROID+IOS+WEB'),('account_deletion_confirmation_message','Do you really want to delete your account permanently?\r\nThis will remove all data we collected about you and disenroll you from all events.','Möchtest du deinen Account wirklich unwiderruflich löschen?\r\nDies wird alle über dich gesammelte Daten löschen und dich von allen Veranstaltungen abmelden.','ANDROID+IOS+WEB'),('account_deletion_confirmation_title','Account Deletion Confirmation','Bestätigung der Account-Löschung','ANDROID+IOS+WEB'),('account_deletion_initiiated','An e-mail has been sent to the e-mail address in order to verify, that the account should be deleted for sure.','Eine E-Mail wurde an die E-Mail-Adresse gesendet, um sicherzustellen, dass der Account wirklich gelöscht werden soll.','ANDROID+IOS+WEB'),('account_deletion_success','The account has been deleted successfully.','Der Account wurde erfolgreich gelöscht.','ANDROID+IOS+WEB'),('account_displayName','Display name','Anzeigename','ANDROID+IOS+WEB'),('account_displayName_invalid','The display name cannot be empty.','Du musst einen Anzeigenamen wählen.','ANDROID+IOS+WEB'),('account_displayName_placeholder','Enter the display name here.','Gib den Anzeigenamen ein.','ANDROID+IOS+WEB'),('account_displayName_taken','The specified display name is already taken.','Dieser Anzeigename ist bereits vergeben.','ANDROID+IOS+WEB'),('account_displayName_updated','The display name got successfully updated.','Der Anzeigename wurde erfolgreich aktualisiert.','ANDROID+IOS+WEB'),('account_eMailAddress','E-Mail-Address','E-Mail-Adresse','ANDROID+IOS+WEB'),('account_eMailAddress_invalid','This is not a valid e-mail address.','Diese E-Mail-Adresse ist ungültig.','ANDROID+IOS+WEB'),('account_eMailAddress_not_taken','There is no account registered with this e-mail address.','Auf diese E-Mail-Adresse ist kein Account registriert.','ANDROID+IOS+WEB'),('account_eMailAddress_not_updated','The e-mail address could not be updated. Please contact an administrator.','Die E-Mail-Adresse konnte nicht aktualisiert werden. Kontaktiere bitte einen Administrator.','ANDROID+IOS+WEB'),('account_eMailAddress_placeholder','Enter the e-mail address here.','Gib die E-Mail-Adresse ein.','ANDROID+IOS+WEB'),('account_eMailAddress_taken','An account is already registered with this e-mail address.','Auf diese E-Mail-Adresse ist bereits ein Account registriert.','ANDROID+IOS+WEB'),('account_eMailAddress_updated','The e-mail address got updated successfully.','Die E-Mail-Adresse wurde erfolgreich aktualisiert.','ANDROID+IOS+WEB'),('account_eatingHabits','Eating habits','Essgewohnheiten','ANDROID+IOS+WEB'),('account_eatingHabits_invalid','The eating habits\' length is not valid.','Die Textlänge der Essgewohnheiten ist nicht gültig.','ANDROID+IOS+WEB'),('account_eatingHabits_placeholder','Enter the eating habits here.','Gib die Essgewohnheiten ein.','ANDROID+IOS+WEB'),('account_eatingHabits_updated','The eating habits got updated successfully.','Die Essgewohnheiten wurden erfolgreich aktualisiert.','WEB'),('account_explanation_heading_account','Account Data','Accountdaten','ANDROID+IOS'),('account_explanation_heading_event','Enrollment data for events','Anmeldedaten bei Veranstaltungen','ANDROID+IOS'),('account_explanation_heading_main','Why do we need your data?','Warum benötigen wir deine Daten?','ANDROID+IOS'),('account_explanation_heading_update','Updating and deleting your data','Aktualisierung und Löschung deiner Daten','ANDROID+IOS+WEB'),('account_explanation_paragraph_account','You need your own user account in order to use some of our services, which are based on the communication between users. This account represents you as a person in our virtual community.\r\nIn order that only you have access to your account, the e-mail address and corresponding password are required to log in. You have to open a link, which we are going to send to your provided e-mail address, to finish the process of signing up. Thereby you prove the validity and your ownership of the specified e-mail address. If you forget your password, we can then send an instruction to your e-mail address, which explains how to reset your password.\r\nFor the main part you are responsible for the security of your account by yourself. Because of this you should use a strong password (13 characters minimum, upper- and lowercase as well as special characters and numbers) and you may not make it available to someone else except yourself.\r\nFurthermore, we need a display name for your account, with which other users of our community can identify you distinctly. However, this nickname pseudonymizes you, so that you do not have to reveal your true name.','Um einige unserer angebotenen Dienste, die auf der Kommunikation zwischen Nutzern basieren, nutzen zu können, benötigst du deinen eigenen Benutzeraccount. Dieser Account repräsentiert dich als Person in unserer virtuellen Gemeinschaft.\r\nDamit nur du Zugriff auf deinen Account hast, werden zum Einloggen deine E-Mail-Adresse und das dazugehörige Passwort benötigt. Nach der Registrierung musst du deinen Account aktivieren, indem du einen Link aufrufst, den wir dir per E-Mail zusenden. Damit bestätigst du sowohl die Echtheit als auch den Besitz über die angegebene E-Mail-Adresse. Solltest du nämlich dein Passwort vergessen, können wir dir an deine E-Mail-Adresse eine Anleitung zum Zurücksetzen des Passworts zusenden.\r\nFür die Sicherheit deines Accounts bist in erster Linie du selbst verantwortlich. Aus diesem Grund solltest du ein starkes Passwort (mindestens 13 Zeichen, Groß- und Kleinbuchstaben sowie Zahlen und Sonderzeichen) verwenden und es niemandem zugänglich machen.\r\nWeiterhin benötigen wir einen Anzeigenamen von dir, über den dich die anderen Nutzer unserer Community eindeutig identifizieren können. Dieser Nutzername pseudonymisiert dich jedoch, sodass du deinen realen Namen nicht preisgeben musst.','ANDROID+IOS'),('account_explanation_paragraph_event','If you want to participate in our courses, we are going to need additional data when enrolling for the first time, even though you have already created a user account. From the second enrollment onwards you just need one click and do not have to fill out another form.\r\nFirst of all, we require your contact information. These are your last name, first name, street name, house number, zip code, city and country. When the course is over, we send you a virtual circular mail with a retrospect of the recent course to your e-mail address. If you want to receive a physical copy via postal delivery as well, you can check a checkbox in your account data to inform us about this.\r\nMoreover, we need your phone number, so that we could contact you as quickly as possible, if there was an urgent cause regarding the course. Additionally, we would like to get your birthdate to validate the age limit of the course. Last but not least you ought to tell us your eating habits (food intolerances, vegetarian/vegan lifestyle and so on), so that we can align our menu beforehand.','Wenn du an unseren Kursen teilnehmen möchtest, benötigen wir für deine erste Kursanmeldung trotz der bereits getätigten Accountregistrierung noch weitere Daten. Ab der zweiten Kursanmeldung benötigst du zum Einschreiben nur noch einen einzigen Klick und musst nicht erneut irgendwelche Formulare ausfüllen.\r\nFür die Anmeldungen benötigen wir in erster Linie deine Kontaktdaten. Dazu zählen Name, Vorname, Straße, Hausnummer, Postleitzahl, Wohnort und Heimatstaat. Nach dem Kurs senden wir dir nämlich per E-Mail den virtuellen Rundbrief mit Rückblick auf den stattgefundenen Kurs an deine E-Mail-Adresse zu. Solltest du zusätzlich eine physische Ausfertigung per Post erhalten wollen, kannst du uns dies durch Setzen eines Häkchens in deinen Accountdaten mitteilen.\r\nZusätzlich brauchen wir deine Telefonnummer, um dich bei dringenden Anliegen bezüglich des Kurses zügig erreichen zu können. Außerdem möchten wir dein Geburtsdatum wissen, um die Altersbeschränkung des Kurses überprüfen zu können. Zu guter Letzt solltest du uns noch deine Essgewohnheiten (Nahrungsmittelunverträglichkeiten, vegetarische/vegane Lebensweise oder ähnliches) mitteilen, damit wir bereits im Vorfeld unseren Essensplan danach ausrichten können.','ANDROID+IOS'),('account_explanation_paragraph_update','Basically you can update your data or delete the whole account anytime.\r\nHowever, the deletion of a specific data field is not possible, once set. If you do have a valid reason to delete a single data field, you can contact us.','Grundsätzlich gilt, dass du deine Daten jederzeit aktualisieren oder den kompletten Account löschen kannst.\r\nDie Löschung eines einzelnen Datums ist jedoch nicht möglich, sobald es einmal angegeben wurde. Sollte dies aus besonderen Gründen dennoch nötig sein, kontaktiere uns bitte.','ANDROID+IOS'),('account_explanation_reference','Read here, why we need these data.','Lies hier nach, warum wir diese Daten benötigen.','ANDROID+IOS'),('account_firstName','First name','Vorname','ANDROID+IOS+WEB'),('account_firstName_invalid','The first name cannot be empty.','Du musst einen Vornamen angeben.','ANDROID+IOS+WEB'),('account_firstName_placeholder','Enter the first name here.','Gib den Vornamen ein.','ANDROID+IOS+WEB'),('account_firstName_updated','The first name got updated successfully.','Der Vorname wurde erfolgreich aktualisiert.','ANDROID+IOS+WEB'),('account_houseNumber','House number','Hausnummer','ANDROID+IOS+WEB'),('account_houseNumber_invalid','This house number is not valid.','Diese Hausnummer ist ungültig.','ANDROID+IOS+WEB'),('account_houseNumber_placeholder','Enter the house number here.','Gib die Hausnummer ein.','ANDROID+IOS+WEB'),('account_houseNumber_updated','The house number got updated successfully.','Die Hausnummer wurde erfolgreich aktualisiert.','WEB'),('account_id','User id','Benutzer-Id','WEB'),('account_id_not_exists','The respective account could not be found. Please contact an administrator.','Der entsprechende Account konnte nicht gefunden werden. Kontaktiere bitte einen Administrator!','ANDROID+IOS+WEB'),('account_isActivated_activation_failed','The account could not be activated. Please contact an administrator!','Der Account konnte nicht aktiviert werden. Kontaktiere bitte einen Administrator.','ANDROID+IOS+WEB'),('account_isActivated_activation_success','The account is has been activated.','Der Account wurde aktiviert.','ANDROID+IOS+WEB'),('account_isActivated_already','The account is already activated.','Der Account ist bereits aktiviert.','ANDROID+IOS+WEB'),('account_isActivated_deactivation_failed','The account could not be deactivated.','Der Account konnte nicht deaktiviert werden.','WEB'),('account_isActivated_deactivation_success','The account is has been deactivated.','Der Account wurde deaktiviert.','WEB'),('account_isActivated_invalid','The new account activation state is invalid.','Der neue Aktivierungsstatus des Accounts ist ungültig.','ANDROID+IOS+WEB'),('account_isActivated_not','Your account needs to be activated before proceeding.','Dein Account muss zunächst aktiviert werden, bevor du fortfährst.','ANDROID+IOS+WEB'),('account_lastName','Last name','Nachname','ANDROID+IOS+WEB'),('account_lastName_invalid','The last name may not be empty.','Du musst einen Nachnamen angeben.','ANDROID+IOS+WEB'),('account_lastName_placeholder','Enter the last name here.','Gib den Nachnamen ein.','ANDROID+IOS+WEB'),('account_lastName_updated','The last name got updated successfully.','Der Nachname wurde erfolgreich aktualisiert.','ANDROID+IOS+WEB'),('account_list','User list','Benutzerliste','WEB'),('account_list_back','Back to user list','Zurück zur Benutzerliste','WEB'),('account_management','User management','Benutzerverwaltung','WEB'),('account_overview','User overview','Benutzer-Übersicht','WEB'),('account_overview_back','Back to account overview','Zurück zur Benutzer-Übersicht','WEB'),('account_password','Password','Passwort','ANDROID+IOS+WEB'),('account_passwordRepetition','Password Repetition','Passwort wiederholen','ANDROID+IOS+WEB'),('account_passwordRepetition_incorrect','The specified passwords do not match.','Die angegebenen Passwörter stimmen nicht überein.','ANDROID+IOS+WEB'),('account_passwordRepetition_new','New password repetition','Neues Passwort wiederholen','ANDROID+IOS+WEB'),('account_passwordRepetition_placeholder','Enter the password here again.','Gib hier das Passwort erneut ein.','ANDROID+IOS+WEB'),('account_password_incorrect','This password is incorrect.','Das angegebene Passwort ist nicht korrekt.','ANDROID+IOS+WEB'),('account_password_invalid','The password needs to be at least 4 characters long.','Das Passwort muss mindestens 4 Zeichen lang sein.','ANDROID+IOS+WEB'),('account_password_new','New password','Neues Passwort','ANDROID+IOS+WEB'),('account_password_new_placeholder','Change the password here.','Ändere das Passwort hier.','ANDROID+IOS+WEB'),('account_password_not_updated','The password could not be updated.','Das Passwort konnte nicht aktualisiert werden.','ANDROID+IOS+WEB'),('account_password_placeholder','Enter the password here.','Gib hier das Passwort ein.','ANDROID+IOS+WEB'),('account_password_reset','Reset password','Passwort zurücksetzen','WEB'),('account_password_updated','The password got updated successfully.','Das Passwort wurde erfolgreich aktualisiert.','ANDROID+IOS+WEB'),('account_phoneNumber','Phone number','Telefonnummer','ANDROID+IOS+WEB'),('account_phoneNumber_invalid','This phone number is not valid.','Diese Telefonnummer ist ungültig.','ANDROID+IOS+WEB'),('account_phoneNumber_placeholder','Enter the phone number here.','Gib die Telefonnummer ein.','ANDROID+IOS+WEB'),('account_phoneNumber_updated','The phone number got updated successfully.','Die Telefonnummer wurde erfolgreich aktualisiert.','WEB'),('account_session_expired','Your session has expired. Please log in again.','Deine Sitzung ist abgelaufen. Melde dich bitte erneut an.','ANDROID+IOS+WEB'),('account_sign_in','Sign In','Anmelden','ANDROID+IOS+WEB'),('account_sign_in_admin','Sign In (Administration)','Anmelden (Administration)','WEB'),('account_sign_in_form','Sign in form','Anmeldeformular','WEB'),('account_sign_in_guest','Sign in as a guest','Als Gast anmelden','ANDROID+IOS'),('account_sign_in_now','Already have an account?\r\nSign in now!','Du besitzt bereits einen Account?\r\nDann logge dich ein!','ANDROID+IOS'),('account_sign_out','Sign Out','Ausloggen','ANDROID+IOS+WEB'),('account_sign_up','Sign Up','Registrieren','ANDROID+IOS+WEB'),('account_sign_up_now','Do not have an account?\r\nSign up now!','Du besitzt noch keinen Account?\r\nDann registriere dich jetzt!','ANDROID+IOS'),('account_sign_up_success','Signing up successful','Registrierung erfolgreich','ANDROID+IOS'),('account_streetName','Street name','Straße','ANDROID+IOS+WEB'),('account_streetName_invalid','This street name is not valid.','Dieser Straßenname ist ungültig.','ANDROID+IOS+WEB'),('account_streetName_placeholder','Enter the street name here.','Gib die Straße ein.','ANDROID+IOS+WEB'),('account_streetName_updated','The street name got updated successfully.','Der Straßenname wurde erfolgreich aktualisiert.','WEB'),('account_transfer_initialized','An e-mail has been sent to the old e-mail address to verify that the account owner agrees to the e-mail address update. ','Eine E-Mail wurde an die alte E-Mail-Adresse geschickt, um das Einverständnis des Account-Besitzers für den Transfer einzuholen.','ANDROID+IOS+WEB'),('account_transfer_not_exists','There is no account transfer in progress for that account.','Für diesen Account ist kein Account-Transfer im Gange.','ANDROID+IOS+WEB'),('account_transfer_not_initialized','The account transfer could not be initialized.','Der Account-Transfer konnte nicht initiiert werden.','ANDROID+IOS+WEB'),('account_transfer_progressed','An e-mail has been sent to the new e-mail address to verify the authenticity of the new account owner.','Eine E-Mail wurde an die neue E-Mail-Adresse geschickt, um die Authentizität des neuen Account-Besitzers sicherzustellen.','ANDROID+IOS+WEB'),('account_zipCode','Zip code','Postleitzahl','ANDROID+IOS+WEB'),('account_zipCode_invalid','This zip code is not valid.','Diese Postleitzahl ist ungültig.','ANDROID+IOS+WEB'),('account_zipCode_placeholder','Enter the zip code here.','Gib die Postleitzahl ein.','ANDROID+IOS+WEB'),('account_zipCode_updated','The zip code got updated successfully.','Die Postleitzahl wurde erfolgreich aktualisiert.','WEB'),('app_serviceWorker_cache_loaded','The app is being served from cache.','Die App wurde aus dem Cache geladen.','ANDROID+IOS+WEB'),('app_serviceWorker_cache_saved','The app is cached for offline use.','Die App wurde zur Offline-Nutzung im Cache gespeichert.','ANDROID+IOS+WEB'),('app_serviceWorker_offline','No internet connection found. App is running in offline mode.','Keine Internetverbindung gefunden. Die App läuft im Offline-Modus.','ANDROID+IOS+WEB'),('app_serviceWorker_update_available','The app has been updated.','Die App wurde aktualisiert.','ANDROID+IOS+WEB'),('colon',':',':','ANDROID+IOS+WEB'),('contact_facebook','Facebook','Facebook','ANDROID+IOS'),('contact_instagram','Instagram','Instagram','ANDROID+IOS'),('contact_support','Technical Support','Technischer Support','ANDROID+IOS'),('contact_website','Website','Website','ANDROID+IOS'),('date_time_suffix','CET',' Uhr','ANDROID+IOS'),('error_message_NEP','Your permissions are not high enough!','Deine Berechtigungen reichen nicht aus!','ANDROID+IOS+WEB'),('error_message_account_required','You have to sign up in order to continue.','Du musst dich registrieren, um fortzufahren.','ANDROID+IOS+WEB'),('error_message_check_internet_connection','Please check your internet connection!','Bitte überprüfe deine Internetverbindung!','ANDROID+IOS'),('error_message_external_storage_NA','Your external storage is either not mounted or not writable.','Der externe Datenträger ist nicht verfügbar oder nicht beschreibbar.','ANDROID+IOS'),('error_message_no_browser','You don\'t have a web browser installed!','Du hast keinen Webbrowser installiert!','ANDROID+IOS'),('error_message_no_mail_client','You don\'t have an email client installed!','Du hast keinen E-Mail Client installiert!','ANDROID+IOS'),('error_message_sign_in_again','Please sign in again!','Bitte logge dich erneut ein!','ANDROID+IOS+WEB'),('error_message_timeout','Your connection timed out. Please try again later, as our webservice seems to be offline at the moment!','Zeitüberschreitung während des Verbindungsvorgangs. Versuche es später bitte erneut, da unser Webservice momentan offline zu sein scheint!','ANDROID+IOS'),('error_message_try_later','Please try again later!','Bitte versuche es später erneut!','ANDROID+IOS+WEB'),('error_message_update_client','Please update your client!','Bitte aktualisiere deine App!','ANDROID+IOS'),('error_type_account','Account Error','Account-Fehler','ANDROID+IOS'),('error_type_client','Client Error','Client-Fehler','ANDROID+IOS'),('error_type_network','Network Error','Netzwerkfehler','ANDROID+IOS'),('error_type_parsing','Parsing Error','Datenverarbeitungsfehler','ANDROID+IOS'),('error_type_server','Server Error','Server-Fehler','ANDROID+IOS+WEB'),('error_type_storage','Storage Error','Speicherfehler','ANDROID+IOS'),('event_add','Create new event','Neue Veranstaltung anlegen','WEB'),('event_component_content','Content','Inhalt','WEB'),('event_component_content_invalid','The selected content is invalid!','Der ausgewählte Inhalt ist ungültig!','WEB'),('event_component_content_placeholder','Enter the content here.','Gib den Inhalt hier ein.','WEB'),('event_component_delete_modal_safeguard_1','Do you really want to delete this event component?','Willst du diese Veranstaltungskomponente wirklich löschen?','WEB'),('event_component_id','Id','Id','WEB'),('event_component_id_invalid','The event component id is invalid!','Die Veranstaltungskomponentennummer ist ungültig!','WEB'),('event_component_title','Title','Titel','WEB'),('event_component_title_invalid','The selected title is invalid!','Der ausgewählte Titel ist ungültig!','WEB'),('event_component_title_placeholder','Enter the title here.','Gib den Titel hier ein.','WEB'),('event_component_title_taken_already','The selected title is already taken!','Der ausgewählte Titel ist bereits vergeben!','WEB'),('event_component_type_invalid','The selected event component type is invalid! Please contact an administrator.','Der ausgewählte Event-Komponenten-Typ ist ungültig! Kontaktiere bitte einen Administrator.','ANDROID+IOS+WEB'),('event_creation_success','The event has been successfully created.','Die Veranstaltung wurde erfolgreich erstellt.','WEB'),('event_delete_modal_safeguard_1_prefix','Do you really want to delete the event with the title \"','Willst du die Veranstaltung mit dem Titel \"','WEB'),('event_delete_modal_safeguard_1_suffix','\"?','\" wirklich löschen?','WEB'),('event_deletion_success','The event has been deleted successfully.','Die Veranstaltung wurde erfolgreich gelöscht.','WEB'),('event_disenroll','Disenroll','Abmelden','ANDROID+IOS+WEB'),('event_enroll','Enroll','Anmelden','ANDROID+IOS+WEB'),('event_enroll_update','Update','Aktualisieren','ANDROID+IOS+WEB'),('event_eventArrival','Arrival','Anreise','ANDROID+IOS+WEB'),('event_eventArrivalId_invalid','The selected event arrival entry does not exist.','Der ausgewählte Veranstaltungsanreiseeintrag existiert nicht.','WEB'),('event_eventArrivalId_updated','The arrival got updated successfully.','Die Anreise wurde erfolgreich aktualisiert.','WEB'),('event_eventArrivals','Arrivals','Anreisemöglichkeiten','WEB'),('event_eventArrivals_manage','Manage arrivals','Anreisemöglichkeiten verwalten','WEB'),('event_eventDetails','Details','Details','WEB'),('event_eventDetails_invalid','The detail\'s length must be between 1 and 65535 characters.','Die Länge der Details muss zwischen 1 und 65535 Zeichen liegen.','WEB'),('event_eventDetails_placeholder','Enter the details here.','Gib die Details hier ein.','WEB'),('event_eventDetails_updated','The details got updated successfully.','Die Details wurden erfolgreich aktualisiert.','WEB'),('event_eventEnd','Event end','Veranstaltungsende','ANDROID+IOS+WEB'),('event_eventEnd_malformed','The event end date\'s format is malformed.','Das Format des Veranstaltungsendes ist nicht korrekt.','WEB'),('event_eventEnd_placeholder','Enter the event end here.','Gib das Veranstaltungsende hier ein.','WEB'),('event_eventEnd_updated','The event end got updated successfully.','Das Veranstaltungsende wurde erfolgreich aktualisiert.','WEB'),('event_eventEnrollment','Enrollment','Anmeldung','ANDROID+IOS+WEB'),('event_eventEnrollmentComment','Event enrollment comment','Kommentar zur Veranstaltungsanmeldung','ANDROID+IOS+WEB'),('event_eventEnrollmentComment_invalid','The event enrollment comment\'s length must be less or equal 65535.','Die Länge des Kommentars zur Veranstaltungsanmeldung muss kürzer oder gleich 65535 Zeichen sein.','ANDROID+IOS+WEB'),('event_eventEnrollmentComment_placeholder','Enter the event enrollment comment here.','Gib den Kommentar zur Veranstaltungsanmeldung hier ein.','ANDROID+IOS+WEB'),('event_eventEnrollmentComment_updated','The event enrollment comment got updated successfully.','Der Kommentar zur Veranstaltungsanmeldung wurde erfolgreich aktualisiert.','ANDROID+IOS+WEB'),('event_eventEnrollmentEnd','Enrollment end','Anmeldeschluss','ANDROID+IOS+WEB'),('event_eventEnrollmentEnd_malformed','The event enrollment end date\'s format is malformed.','Das Format des Anmeldeschlusses ist nicht korrekt.','WEB'),('event_eventEnrollmentEnd_placeholder','Enter the enrollment end here.','Gib den Anmeldeschluss hier ein.','WEB'),('event_eventEnrollmentEnd_updated','The event enrollment end got updated successfully.','Der Anmeldeschluss wurde erfolgreich aktualisiert.','WEB'),('event_eventEnrollmentStart','Enrollment start','Anmeldebeginn','ANDROID+IOS+WEB'),('event_eventEnrollmentStartEnd_invalid','The event enrollment start cannot be after the event enrollment end.','Der Veranstaltungsanmeldebeginn kann nicht nach dem Veranstaltungsanmeldeende liegen.','WEB'),('event_eventEnrollmentStart_malformed','The event enrollment start date\'s format is malformed.','Das Format des Veranstaltungsanmeldebeginns ist nicht korrekt.','WEB'),('event_eventEnrollmentStart_placeholder','Enter the enrollment start here.','Gib den Anmeldebeginn hier ein.','WEB'),('event_eventEnrollmentStart_updated','The event enrollment start got updated successfully.','Der Anmeldebeginn wurde erfolgreich aktualisiert.','WEB'),('event_eventId','Id','Id','WEB'),('event_eventId_invalid','The event id is invalid.','Die Id der Veranstaltung ist ungültig.','WEB'),('event_eventLocation','Event location','Veranstaltungsort','ANDROID+IOS+WEB'),('event_eventLocationId_invalid','The selected event location entry does not exist.','Der ausgewählte Veranstaltungsorteintrag existiert nicht.','WEB'),('event_eventLocationId_updated','The event location got updated successfully.','Der Veranstaltungsort wurde erfolgreich aktualisiert.','WEB'),('event_eventLocationLatitude','Latitude','Breitengrad','WEB'),('event_eventLocationLatitude_invalid','The latitude must be a value between -90 and +90.','Der Breitengrad muss ein Wert zwischen -90 und +90 sein.','WEB'),('event_eventLocationLatitude_placeholder','Enter the latitude here.','Gib den Breitengrad hier ein.','WEB'),('event_eventLocationLongitude','Longitude','Längengrad','WEB'),('event_eventLocationLongitude_invalid','The longitude must be a value between -180 and +180.','Der Längengrad muss ein Wert zwischen -180 und +180 sein.','WEB'),('event_eventLocationLongitude_placeholder','Enter the longitude here.','Gib den Längengrad hier ein.','WEB'),('event_eventLocation_choose','Choose event location','Veranstaltungsort auswählen','WEB'),('event_eventLocations','Event locations','Veranstaltungsorte','WEB'),('event_eventLocations_manage','Manage locations','Veranstaltungsorte verwalten','WEB'),('event_eventOffer','Offer','Angebot','ANDROID+IOS+WEB'),('event_eventOfferId_invalid','The selected event offer entry does not exist.','Der ausgewählte Veranstaltungsangebotseintrag existiert nicht.','WEB'),('event_eventOfferId_updated','The offer got updated successfully.','Das Angebot wurde erfolgreich aktualisiert.','WEB'),('event_eventOffers','Offers','Angebote','WEB'),('event_eventOffers_manage','Manage offers','Angebote verwalten','WEB'),('event_eventPackingList','Packing list','Packliste','ANDROID+IOS+WEB'),('event_eventPackingListId_invalid','The selected event packing list entry does not exist.','Der ausgewählte Veranstaltungspacklisteneintrag existiert nicht.','WEB'),('event_eventPackingListId_updated','The packing list got updated successfully.','Die Packliste wurde erfolgreich aktualisiert.','WEB'),('event_eventPackingLists','Packing lists','Packlisten','WEB'),('event_eventPrice','Participation fee','Teilnahmegebühr','ANDROID+IOS+WEB'),('event_eventPriceId_invalid','The selected event participation fee entry does not exist.','Der ausgewählte Veranstaltungsteilnahmegebühreneintrag existiert nicht.','WEB'),('event_eventPriceId_updated','The pariticipation fee got updated successfully.','Die Teilnahmegebühr wurde erfolgreich aktualisiert.','WEB'),('event_eventPrices','Participation fees','Teilnahmegebühren','WEB'),('event_eventPrices_manage','Manage participation fees','Teilnahmegebühren verwalten','WEB'),('event_eventSchedule','Schedule','Ablaufplan','ANDROID+IOS+WEB'),('event_eventScheduleId_invalid','The selected event schedule entry does not exist.','Der ausgewählte Veranstaltungsablaufplaneintrag existiert nicht.','WEB'),('event_eventScheduleId_updated','The schedule got updated successfully.','Das Ablaufplan wurde erfolgreich aktualisiert.','WEB'),('event_eventSchedules','Schedules','Ablaufpläne','WEB'),('event_eventSchedules_manage','Manage schedules','Ablaufpläne verwalten','WEB'),('event_eventStart','Event start','Veranstaltungsbeginn','ANDROID+IOS+WEB'),('event_eventStartEnd_invalid','The event start cannot be after the event end.','Der Veranstaltungsbeginn kann nicht nach dem Veranstaltungsende liegen.','WEB'),('event_eventStart_malformed','The event start date\'s format is malformed.','Das Format des Veranstaltungsbeginns ist nicht korrekt.','WEB'),('event_eventStart_placeholder','Enter the event start here.','Gib den Veranstaltungsbeginn hier ein.','WEB'),('event_eventStart_updated','The event start got updated successfully.','Der Veranstaltungsbeginn wurde erfolgreich aktualisiert.','WEB'),('event_eventTargetGroup','Target group','Zielgruppe','ANDROID+IOS+WEB'),('event_eventTargetGroupId_invalid','The selected event target group entry does not exist.','Der ausgewählte Veranstaltungszielgruppeneintrag existiert nicht.','WEB'),('event_eventTargetGroupId_updated','The target group got updated successfully.','Die Zielgruppe wurde erfolgreich aktualisiert.','WEB'),('event_eventTargetGroups','Target groups','Zielgruppen','WEB'),('event_eventTargetGroups_manage','Manage target groups','Zielgruppen verwalten','WEB'),('event_eventTitle','Title','Titel','WEB'),('event_eventTitle_invalid','The title\'s length must be between 1 and 100 characters.','Die Länge des Titels muss zwischen 1 und 100 Zeichen liegen.','WEB'),('event_eventTitle_placeholder','Enter the title here.','Gib den Titel hier ein.','WEB'),('event_eventTitle_prefix','Event: ','Veranstaltung: ','WEB'),('event_eventTitle_updated','The title got updated successfully.','Der Titel wurde erfolgreich aktualisiert.','WEB'),('event_eventTopic','Topic','Thema','WEB'),('event_eventTopic_invalid','The topic\'s length must be between 1 and 100 characters.','Die Länge des Themas muss zwischen 1 und 100 Zeichen liegen.','WEB'),('event_eventTopic_placeholder','Enter the topic here.','Gib das Thema hier ein.','WEB'),('event_eventTopic_updated','The topic got updated successfully.','Das Thema wurde erfolgreich aktualisiert.','WEB'),('event_list','Event list','Veranstaltungsliste','WEB'),('event_list_back','Back to event list','Zurück zur Veranstaltungsliste','WEB'),('event_management','Event management','Veranstaltungsverwaltung','WEB'),('event_not_exists','The event could not be found.','Die Veranstaltung konnte nicht gefunden werden.','ANDROID+IOS+WEB'),('event_overview','Event overview','Veranstaltungs-Übersicht','WEB'),('event_packingLists_manage','Manage packing lists','Packlisten verwalten','WEB'),('event_participants_list','List of participants','Teilnehmerliste','ANDROID+IOS+WEB'),('event_requiredAccessLevel','Sharing level','Freigabestufe','WEB'),('event_requiredAccessLevel_not_exist','The selected sharing level does not exist.','Die ausgewählte Freigabestufe existiert nicht.','WEB'),('event_requiredAccessLevel_updated','The sharing level got updated successfully.','Die Freigabestufe wurde erfolgreich aktualisiert.','WEB'),('event_user_disenrolled','You have disenrolled for the event successfully.','Du hast dich erfolgreich von der Veranstaltung abgemeldet.','ANDROID+IOS+WEB'),('event_user_disenrollment_confirmation_message','Do you really want to disenroll from this event?','Möchtest du dich wirklich von dieser Veranstaltung abmelden?','ANDROID+IOS+WEB'),('event_user_disenrollment_confirmation_title','Event Disenrollment Confirmation','Bestätigung der Veranstaltungsabmeldung','ANDROID+IOS+WEB'),('event_user_disenrollment_too_early','Disenrolling from this event is not possible yet.','Das Abmelden von dieser Veranstaltung ist noch nicht möglich.','ANDROID+IOS+WEB'),('event_user_disenrollment_too_late','Disenrolling from this event is not possible anymore.','Das Abmelden von dieser Veranstaltung ist nicht mehr möglich.','ANDROID+IOS+WEB'),('event_user_enrolled','You have enrolled for the event successfully.','Du hast dich erfolgreich zu der Veranstaltung angemeldet.','ANDROID+IOS+WEB'),('event_user_enrolled_already','An enrollment for this event already exists.','Es existiert bereits eine Anmeldung zu der Veranstaltung.','ANDROID+IOS+WEB'),('event_user_enrolled_not','There exists no enrollment for this event.','Es liegt keine Anmeldung zu der Veranstaltung vor.','ANDROID+IOS+WEB'),('event_user_enrollment_confirmation_message','Do you really want to enroll for this event?','Möchtest du dich wirklich für diese Veranstaltung anmelden?','ANDROID+IOS+WEB'),('event_user_enrollment_confirmation_title','Event Enrollment Confirmation','Bestätigung der Veranstaltungsanmeldung','ANDROID+IOS+WEB'),('event_user_enrollment_form','Enrollment form','Anmeldeformular','ANDROID+IOS+WEB'),('event_user_enrollment_missing_account_data','The fields with a green marker have to be filled out in order to enroll for events.','Die Felder mit grüner Markierung müssen ausgefüllt sein, um sich für eine Veranstaltung anmelden zu können.','ANDROID+IOS+WEB'),('event_user_enrollment_state','Enrollment state','Anmeldungsstatus','ANDROID+IOS+WEB'),('event_user_enrollment_state_enrolled','enrolled','angemeldet','ANDROID+IOS+WEB'),('event_user_enrollment_state_enrolled_not','not enrolled','nicht angemeldet','ANDROID+IOS+WEB'),('event_user_enrollment_too_early','Enrolling for this event is not possible yet.','Das Anmelden zu dieser Veranstaltung ist noch nicht möglich.','ANDROID+IOS+WEB'),('event_user_enrollment_too_late','Enrolling for this event is not possible anymore.','Das Anmelden zu dieser Veranstaltung ist nicht mehr möglich.','ANDROID+IOS+WEB'),('general_abbey_name','Münsterschwarzach Abbey','Abtei Münsterschwarzach','ANDROID+IOS+WEB'),('general_app_name','Junges Münsterschwarzach','Junges Münsterschwarzach','ANDROID+IOS+WEB'),('general_web_title','Junges Münsterschwarzach App - Web','Junges Münsterschwarzach App - Web','WEB'),('image_add','Add new images','Neue Bilder hinzufügen','WEB'),('image_available','Available images','Vorhandene Bilder','WEB'),('image_categoryId_empty','No image exists.','Kein Bild vorhanden.','ANDROID+IOS+WEB'),('image_category_article_not_found','The selected category item does not exist!','Der ausgewählte Kategorieeintrag existiert nicht!','ANDROID+IOS+WEB'),('image_choose_file','Choose image file:','Bilddatei auswählen:','WEB'),('image_content_invalid','The selected file is either not an image or corrupted.','Die ausgewählte Datei ist entweder kein Bild oder korrupt.','ANDROID+IOS+WEB'),('image_delete_safeguard','Do you really want to delete this image?','Willst du dieses Bild wirklich löschen?','WEB'),('image_deleted','The image has successfully been deleted.','Das Bild wurde erfolgreich gelöscht.','ANDROID+IOS+WEB'),('image_exists','An image with the calculated image id does already exist!','Ein Bild mit der berechneten Id existiert bereits!','ANDROID+IOS+WEB'),('image_extension_invalid','This file extension is not valid. (Only png, jpg and jpeg files are allowed!)','Dieser Dateityp ist ungültig. (Nur png-, jpg- und jpeg-Dateien sind erlaubt!)','ANDROID+IOS+WEB'),('image_file_opening_failed','Unable to open the uploaded file and save it\'s meta data!','Die hochgeladene Datei konnte nicht geöffnet und die Metadaten nicht gespeichert werden!','ANDROID+IOS+WEB'),('image_folder_creation_failed','The image directory could not be created on the server!','Das Bildverzeichnis konnte auf dem Server nicht angelegt werden!','ANDROID+IOS+WEB'),('image_manage_linked','Manage linked images','Verlinkte Bilder verwalten','WEB'),('image_management','Image management','Bilderverwaltung','WEB'),('image_metadata_not_saved','The image\'s metadata could not be added to the image library!','Die Metadaten des Bildes konnten nicht in der Datenbank gespeichert werden!','ANDROID+IOS+WEB'),('image_navigation_counter_infix',' of ',' von ','ANDROID+IOS+WEB'),('image_not_found','The requested image could not been found.','Das angeforderte Bild konnte nicht gefunden werden.','ANDROID+IOS+WEB'),('image_not_loaded','The requested image could not been loaded.','Das angeforderte Bild konnte nicht geladen werden.','ANDROID+IOS+WEB'),('image_rollback_failed','The image library could not be rolled back!','Der Bildspeicher konnte nicht zurückgesetzt werden!','ANDROID+IOS+WEB'),('image_size_invalid','Your file exceeds the maximum allowed file size of 50MB.','Die Datei übersteigt die maxiale Dateigröße von 50MB.','ANDROID+IOS+WEB'),('image_swipe_right','Swipe >>','Swipe >>','ANDROID+IOS'),('image_uploaded','The image has successfully been uploaded.','Das Bild wurde erfolgreich hochgeladen.','ANDROID+IOS+WEB'),('label_activate','Activate','Aktivieren','WEB'),('label_announce','Announce','Ankündigen','WEB'),('label_back','Back','Zurück','WEB'),('label_cancel','Cancel','Abbrechen','ANDROID+IOS+WEB'),('label_close','Close','Schließen','WEB'),('label_confirm','Confirm','Bestätigen','ANDROID+IOS+WEB'),('label_deactivate','Deactivate','Deaktivieren','WEB'),('label_delete','Delete','Löschen','WEB'),('label_failure','Failure!','Fehler!','WEB'),('label_loading','Loading ...','Laden ...','ANDROID+IOS+WEB'),('label_manage','Manage','Verwalten','WEB'),('label_notice','Notice!','Hinweis!','WEB'),('label_save','Save','Speichern','ANDROID+IOS+WEB'),('label_submit','Submit','Absenden','ANDROID+IOS+WEB'),('label_success','Success!','Erfolg!','WEB'),('label_update_last','Last update: ','Letzte Aktualisierung: ','WEB'),('label_wait','Please wait!','Bitte warten!','ANDROID+IOS+WEB'),('label_warning','Warning!','Warnung!','ANDROID+IOS+WEB'),('label_wip','Work in Progress ~','In Arbeit ~','ANDROID+IOS+WEB'),('mail_account_deletion_message_paragraph_1','open the following link to permanently delete your account:<br><br>','öffne den folgenden Link, um deinen Account endgültig zu löschen:<br><br>','WEB'),('mail_account_deletion_message_paragraph_2','<br><br>If you were not able to open the link, you should copy it into your browser\'s address bar and open it there.<br>This link is valid for 7 days. After expiration, the account deletion process is aborted.<br>If you still want to delete your account, you have to request the account deletion again.<br><br>','<br><br>Solltest du den Link nicht öffnen können, dann kopiere ihn in die Adresszeile deines Browsers und rufe ihn dort auf.<br>Dieser Link ist 7 Tage lang gültig. Danach wird der Account-Löschungs-Prozess abgebrochen.<br>Wenn du deinen Account immer noch löschen willst, musst du die Account-Löschung erneut anfordern.<br><br>','WEB'),('mail_account_deletion_title','Junges Münsterschwarzach App - Account deletion','Junges Münsterschwarzach App - Account-Löschung','WEB'),('mail_account_transfer_not_sent','The e-mail to confirm the account transfer could not be sent.','Die E-Mail zum Bestätigen des Account-Transfers konnte nicht versandt werden.','ANDROID+IOS'),('mail_confirm_activation_message_paragraph_1','open the following link to activate your recently created account:<br><br>','um deinen kürzlich angelegten Account zu aktivieren, rufe bitte folgenden Link auf:<br><br>','WEB'),('mail_confirm_activation_message_paragraph_2','<br><br>If you were not able to open the link, you should copy it into your browser\'s address bar and open it there.<br>This link is valid for 7 days. After expiration, your account will get deleted and you have to sign up again.<br>If you did not create an account with us, you could ignore this e-mail without any concerns.<br><br>','<br><br>Solltest du den Link nicht öffnen können, dann kopiere ihn in die Addresszeile deines Browsers und rufe ihn dort auf.<br>Dieser Link ist 7 Tage lang gültig. Danach wird dein Account gelöscht und du musst dich erneut registrieren.<br>Wenn du keinen Account bei uns erstellt haben solltest, kannst du diese E-Mail unbesorgt ignorieren.<br><br>','WEB'),('mail_confirm_activation_not_sent','The e-mail with the account activation link could not be sent.','Die E-Mail mit dem Account-Aktivierungslink konnte nicht versendet werden.','ANDROID+IOS'),('mail_confirm_activation_send','An e-mail with the account activation link has been sent to the specified e-mail address.','Eine E-Mail mit Account-Aktivierungslink wurde an die angegebene E-Mail-Adresse versendet.','ANDROID+IOS+WEB'),('mail_confirm_activation_title','Junges Münsterschwarzach App - Account activation','Junges Münsterschwarzach App - Account-Aktivierung','WEB'),('mail_eMailAddress_update_new_message_paragraph_1','open the following link to confirm that you want to transfer the account to this e-mail address:<br><br>','rufe folgenden Link auf, um zu bestätigen, dass du den Account auf diese E-Mail-Adresse übertragen willst:<br><br>','WEB'),('mail_eMailAddress_update_new_message_paragraph_2','<br><br>If you were not able to open the link, you should copy it into your browser\'s address bar and open it there.<br>This link is valid for 7 days. After expiration, you have to initiate the account transfer again by changing your e-mail address once more.<br><br>','<br><br>Solltest du den Link nicht öffnen können, dann kopiere ihn in die Adresszeile deines Browsers und rufe ihn dort auf.<br>Dieser Link ist 7 Tage lang gültig. Danach musst du den Transfer erneut initiieren, indem du deine E-Mail-Adresse in der Accountdaten-Übersicht erneut änderst.<br><br>','WEB'),('mail_eMailAddress_update_old_message_paragraph_1','open the following link to confirm that you want to transfer your account to ','rufe folgenden Link auf, um zu bestätigen, dass du deinen Account zu ','WEB'),('mail_eMailAddress_update_old_message_paragraph_2',' :<br><br>',' transferieren willst:<br><br>','WEB'),('mail_eMailAddress_update_old_message_paragraph_3','<br><br>If you were not able to open the link, you should copy it into your browser\'s address bar and open it there.<br>This link is valid for 7 days. After expiration, you have to initiate the account transfer again by changing your e-mail address once more.<br><br>','<br><br>Solltest du den Link nicht öffnen können, dann kopiere ihn in die Adresszeile deines Browsers und rufe ihn dort auf.<br>Dieser Link ist 7 Tage lang gültig. Danach musst du den Transfer erneut initiieren, indem du deine E-Mail-Adresse in der Accountdaten-Übersicht erneut änderst.<br><br>','WEB'),('mail_eMailAddress_update_title','Junges Münsterschwarzach App - Account transfer','Junges Münsterschwarzach App - Account-Transfer','WEB'),('mail_message_salutation_prefix','Hello ','Hallo ','WEB'),('mail_message_salutation_suffix',',<br><br>',',<br><br>','WEB'),('mail_password_reset_message_paragraph_1','open the following link to reset your password:<br><br>','um dein Passwort zurückzusetzen, rufe bitte folgenden Link auf:<br><br>','WEB'),('mail_password_reset_message_paragraph_2','<br><br>If you were not able to open the link, you should copy it into your browser\'s address bar and open it there.<br>This link is valid for 7 days. After expiration, you have to request a new password reset link, if you still want to reset your password.<br><br>','<br><br>Solltest du den Link nicht öffnen können, dann kopiere ihn in die Adresszeile deines Browsers und rufe ihn dort auf.<br>Dieser Link ist 7 Tage lang gültig. Danach musst du einen neuen Reset-Link anfordern, wenn du immer noch dein Password ändern willst.<br><br>','WEB'),('mail_password_reset_not_sent','The e-mail with the password reset instructions could not be sent.','Die E-Mail zum Zurücksetzen des Passworts konnte nicht versandt werden.','ANDROID+IOS'),('mail_password_reset_sent','An e-mail has been sent to the e-mail address with further instructions on how to reset your password.','An die angegebene E-Mail-Adresse wurde eine E-Mail gesendet, die eine Anleitung zum Zurücksetzen des Passworts enthält.','ANDROID+IOS+WEB'),('mail_password_reset_title','Junges Münsterschwarzach App - Password reset','Junges Münsterschwarzach App - Password-Reset','WEB'),('mail_regards','Best regards,<br>Junges Münsterschwarzach Team','Viele Grüße,<br>Junges Münsterschwarzach Team','WEB'),('mail_send_fail','The mail could not be sent!','Die E-Mail konnte nicht versandt werden!','ANDROID+IOS+WEB'),('mail_send_success','The mail has been sent successfully!','Die E-Mail wurde erfolgreich versandt.','ANDROID+IOS+WEB'),('navigation_app_contact','Contact Us','Kontaktiere Uns','ANDROID+IOS+WEB'),('navigation_app_help','Help','Hilfe','ANDROID+IOS+WEB'),('navigation_app_image_gallery','Image gallery','Bildergalerie','ANDROID+IOS+WEB'),('navigation_app_news','News','Neuigkeiten','ANDROID+IOS'),('navigation_app_refresh','Refresh','Aktualisieren','ANDROID+IOS'),('navigation_app_sign_in','Sign In','Anmeldung','ANDROID+IOS'),('navigation_app_sign_up','Sign Up','Registrierung','ANDROID+IOS'),('navigation_events','Events','Veranstaltungen','ANDROID+IOS+WEB'),('navigation_events_invalid','Invalid events','Ungültige Veranstaltungen','ANDROID+IOS+WEB'),('navigation_events_ongoing','Ongoing events','Laufende Veranstaltungen','ANDROID+IOS+WEB'),('navigation_events_past','Past events','Vergangene Veranstaltungen','ANDROID+IOS+WEB'),('navigation_events_upcoming','Upcoming events','Bevorstehende Veranstaltungen','ANDROID+IOS+WEB'),('navigation_redeem_token','Token Redemption','Token einlösen','ANDROID+IOS+WEB'),('navigation_request_account_transfer_mail','Request account transfer mail','Account-Transfer-Mail anfordern','ANDROID+IOS+WEB'),('navigation_request_activation_link','Request activation link','Aktivierungslink anfordern','ANDROID+IOS+WEB'),('navigation_request_password_reset','Request password reset','Passwort-Reset anfordern','ANDROID+IOS+WEB'),('navigation_web_acp','Admin Control Panel','Administrationsbereich','WEB'),('navigation_web_events','Events','Veranstaltungen','WEB'),('navigation_web_news','News','News','WEB'),('navigation_web_pn','Push Notifications','Push-Benachrichtigungen','WEB'),('navigation_web_token_list','Token list','Token-Liste','WEB'),('navigation_web_ucp','User Control Panel','Nutzerkontrollbereich','WEB'),('navigation_web_users','Users','Benutzer','WEB'),('news_add','Create news article','Neuen Artikel anlegen','WEB'),('news_author','Author','Verfasser','WEB'),('news_authorId_updated','The author got updated successfully.','Der Verfasser wurde erfolgreich aktualisiert.','WEB'),('news_content','Content','Gesamtinhalt','WEB'),('news_content_invalid','The content\'s length must be between 1 and 65535 characters.','Die Länge des Gesamtinhalts muss zwischen 1 und 65535 Zeichen liegen.','WEB'),('news_content_placeholder','Enter the content here.','Gib den Gesamtinhalt hier ein.','WEB'),('news_content_updated','The content got updated successfully.','Der Gesamtinhalt wurde erfolgreich aktualisiert.','WEB'),('news_creation_success','The article has been successfully created.','Der Artikel wurde erfolgreich erstellt.','WEB'),('news_delete_modal_safeguard_1_prefix','Do you really want to delete the article with the title \"','Willst du den Artikel mit dem Titel \"','WEB'),('news_delete_modal_safeguard_1_suffix','\"?','\" wirklich löschen?','WEB'),('news_deletion_success','The article has been deleted successfully.','Der Artikel wurde erfolgreich gelöscht.','WEB'),('news_id','News id','News-Id','WEB'),('news_id_invalid','The provided news id is invalid!','Die angegebene Neuigkeits-Id ist ungültig!','ANDROID+IOS+WEB'),('news_list','News list','News-Liste','WEB'),('news_list_back','Back to news list','Zurück zur Artikelliste','WEB'),('news_management','News management','Neuigkeitenverwaltung','WEB'),('news_overview','News overview','News-Übersicht','WEB'),('news_postingDate','Posting date','Verfassungsdatum','WEB'),('news_postingDate_invalid','You cannot set a future date as the creation date.','Du kannst kein Datum in der Zukunft als Verfassungsdatum wählen.','WEB'),('news_postingDate_malformed','The creation date\'s format is malformed.','Das Format des Verfassungsdatums ist nicht korrekt.','WEB'),('news_postingDate_placeholder','Enter the posting date here.','Gib das Verfassungsdatum hier ein.','WEB'),('news_postingDate_updated','The creation date got updated successfully.','Das Verfassungsdatum wurde erfolgreich aktualisiert.','WEB'),('news_published_by','Published by ','Veröffentlicht von ','ANDROID+IOS+WEB'),('news_requiredAccessLevel','Sharing level','Freigabestufe','WEB'),('news_requiredAccessLevel_not_exist','The selected sharing level does not exist.','Die ausgewählte Freigabestufe existiert nicht.','WEB'),('news_requiredAccessLevel_updated','The sharing level got updated successfully.','Die Freigabestufe wurde erfolgreich aktualisiert.','WEB'),('news_summary','Summary','Kurzinhalt','WEB'),('news_summary_invalid','The summary\'s length must be between 1 and 500 characters.','Die Länge des Kurzinhalts muss zwischen 1 und 500 Zeichen liegen.','WEB'),('news_summary_placeholder','Enter the summary here.','Gib den Kurzinhalt hier ein.','WEB'),('news_summary_updated','The summary got updated successfully.','Der Kurzinhalt wurde erfolgreich aktualisiert.','WEB'),('news_title','Title','Titel','WEB'),('news_title_invalid','The title\'s length must be between 1 and 100 characters.','Die Länge des Titels muss zwischen 1 und 100 Zeichen liegen.','WEB'),('news_title_placeholder','Enter the title here.','Gib den Titel hier ein.','WEB'),('news_title_prefix','News article: ','News-Artikel: ','WEB'),('news_title_updated','The title got updated successfully.','Der Titel wurde erfolgreich aktualisiert.','WEB'),('not_revertable','This cannot be undone!','Dies kann nicht rückgängig gemacht werden!','ANDROID+IOS+WEB'),('pn_event_send_modal_safeguard_1_prefix','Do you really want to announce the event with the title \"','Willst du die Veranstaltung mit dem Titel \"','WEB'),('pn_event_send_modal_safeguard_1_suffix','\"?','\" ankündigen?','WEB'),('pn_message','Message','Nachricht','WEB'),('pn_message_placeholder','Enter the message here.','Gib hier die Nachricht ein.','WEB'),('pn_news_send_modal_safeguard_1_prefix','Do you really want to announce the article with the title \"','Willst du den Artikel mit dem Titel \"','WEB'),('pn_news_send_modal_safeguard_1_suffix','\"?','\" ankündigen?','WEB'),('pn_receive_event','New event information!','Neue Veranstaltungsinformationen!','ANDROID+IOS'),('pn_receive_news','There are news available!','Es gibt Neuigkeiten!','ANDROID+IOS'),('pn_send_data_eventId_missing','The push notification\'s event link is missing.','Die Veranstaltungsverlinkung der Push-Benachrichtigung fehlt.','WEB'),('pn_send_data_newsId_missing','The push notification\'s news link missing.','Die News-Verlinkung der Push-Benachrichtigung fehlt.','WEB'),('pn_send_modal_safeguard_2_prefix','All users with the access level of \"','Es werden alle Nutzer mit der Berechtigungsstufe \"','WEB'),('pn_send_modal_safeguard_2_suffix','\" or higher will receive a push notification!','\" oder höher eine Push-Benachrichtigung erhalten!','WEB'),('pn_send_notification_body_invalid','The push notification\'s body is invalid.','Der Text der Push-Benachrichtigung ist ungültig.','WEB'),('pn_send_notification_title_invalid','The push notification\'s title is invalid.','Der Titel der Push-Benachrichtigung ist ungültig.','WEB'),('pn_send_recipient','Recipient','Empfänger','WEB'),('pn_send_registrationIds_invalid','The push notification\'s target group is invalid.','Die Zielgruppe der Push-Benachrichtigung ist ungültig.','WEB'),('pn_send_success','The push notification has been broadcasted.','Die Push-Benachrichtigung wurde erfolgreich versandt.','WEB'),('pn_title','Title','Titel','WEB'),('pn_title_placeholder','Enter the title here.','Gib hier den Titel ein.','WEB'),('separator_hyphen',' - ',' - ','ANDROID+IOS+WEB'),('token_cleanup_failed','Cleaning up existing tokens failed. Please contact an administrator.','Die vorhandenen Token konnten nicht bereinigt werden. Bitte kontaktiere einen Administrator.','ANDROID+IOS+WEB'),('token_code','Token code','Token-Code','ANDROID+IOS+WEB'),('token_code_invalid','The supplied code is not valid (anymore).','Der angegebene Code ist nicht (mehr) gültig.','ANDROID+IOS+WEB'),('token_code_placeholder','Enter your token code here.','Gib deinen Token-Code hier ein.','ANDROID+IOS+WEB'),('token_creation_failed','The token could not be created.','Der Token konnte nicht generiert werden.','ANDROID+IOS+WEB'),('token_deletion_failed','An error occurred while deleting an old token. Please contact an administrator.','Bei der Entfernung eines veralteten Tokens trat ein Fehler auf. Kontaktiere bitte einen Administrator.','ANDROID+IOS+WEB'),('token_type','Token type','Token-Typ','WEB'),('token_type_invalid','Invalid token type. Please contact an administrator.','Ungültiger Token-Typ. Kontaktiere bitte einen Administrator.','ANDROID+IOS+WEB'),('token_valid_until','Token valid until','Token gültig bis','WEB'),('user_activate_modal_safeguard_1_prefix','Do you really want to change the activation state of the user with the display name \"','Willst du den Aktivierungsstatus des Accounts mit dem Anzeigenamen \"','WEB'),('user_activate_modal_safeguard_1_suffix','\"?','\" wirklich ändern?','WEB'),('user_delete_modal_safeguard_1_prefix','Do you really want to delete the user with the display name \"','Willst du den Account mit dem Anzeigenamen \"','WEB'),('user_delete_modal_safeguard_1_suffix','\"?','\" wirklich löschen?','WEB');
/*!40000 ALTER TABLE `strings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-01  2:49:08
