<?php

	$secrets_directory = getenv("JMA_SECRETS") ? getenv("JMA_SECRETS") : "/var/data/secrets/jma";


	/* App */

	if (defined("APP_LOADED") === false) {
		$app_config = json_decode(file_get_contents($secrets_directory."/app.json"), true);

		define("APP_BASEURLS_APP", $app_config["BaseUrls"]["APP"]);
		define("APP_BASEURLS_CONTACT_LINK", $app_config["BaseUrls"]["CONTACT_LINK"]);
		define("APP_BASEURLS_WEBSERVICE", $app_config["BaseUrls"]["WEBSERVICE"]);
		define("APP_LOADED", true);
	}


	/* Database */

	if (defined("DB_LOADED") === false) {
		$database_config = json_decode(file_get_contents($secrets_directory."/database.json"), true);

		define("DB_SERVER", $database_config["server"]);
		define("DB_USERNAME", $database_config["username"]);
		define("DB_PASSWORD", $database_config["password"]);
		define("DB_DATABASE", $database_config["database"]);
		define("DB_CHARSET", $database_config["encoding"]);
		define("DB_LOADED", true);
	}


	/* Mailing */

	if (defined("MAIL_LOADED") === false) {
		$mail_config = json_decode(file_get_contents($secrets_directory."/mail.json"), true);

		define("MAIL_ACTIVE", $mail_config["active"]);
		define("MAIL_ADDRESS", $mail_config["address"]);
		define("MAIL_AUTHOR", $mail_config["author"]);
		define("MAIL_ACCOUNT_NAME", $mail_config["account_name"]);
		define("MAIL_PASSWORD", $mail_config["password"]);
		define("MAIL_SERVER", $mail_config["server"]);
		define("MAIL_PORT_IMAP", $mail_config["port_imap"]);
		define("MAIL_PORT_SMTP", $mail_config["port_smtp"]);
		define("MAIL_ENCODING", $mail_config["encoding"]);
		define("MAIL_ATTACHMENT_SIZE_MAX", 5000000);
		define("MAIL_FOLDER_PREFIX", "{".MAIL_SERVER.":".MAIL_PORT_IMAP."/imap/ssl}");
		define("MAIL_FOLDER_DEFAULT", "INBOX");
		define("MAIL_FOLDER_ENROLLMENTS_PREPROCESSED", "ENROLLMENTS.PREPROCESSED");
		define("MAIL_FOLDER_ENROLLMENTS_ENROLLED", "ENROLLMENTS.ENROLLED");
		define("MAIL_FOLDER_ENROLLMENTS_UNCONFIRMED", "ENROLLMENTS.UNCONFIRMED");
		define("MAIL_FOLDER_ENROLLMENTS_FAILED", "ENROLLMENTS.FAILED");
		define("MAIL_ACCOUNT_TOKEN_URL", $mail_config["account_token_url"]);
		define("MAIL_NEWSLETTER_TOKEN_URL", $mail_config["newsletter_token_url"]);
		define("MAIL_PROFILE_URL", $mail_config["profile_url"]);
		define("MAIL_EVENT_PARTICIPANTS_URL", $mail_config["event_participants_url"]);
		define("MAIL_LOADED", true);
	}
	
	
	/* Access levels */

	if (defined("ACCESS_LEVELS_LOADED") === false) {
		define("ACCESS_LEVEL_GUEST", 10);
		define("ACCESS_LEVEL_USER", 20);
		define("ACCESS_LEVEL_EDITOR", 30);
		define("ACCESS_LEVEL_MODERATOR", 40);
		define("ACCESS_LEVEL_DEVELOPER", 50);
		define("ACCESS_LEVELS_LOADED", true);
	}
	

	/* Permissions */

	if (defined("PERMISSIONS_LOADED") === false) {
		define("PERMISSION_EVENTS", 30);
		define("PERMISSION_IMAGES", 30);
		define("PERMISSION_NEWS", 30);
		define("PERMISSION_PN", 30);
		define("PERMISSION_NEWSLETTER", 40);
		define("PERMISSION_USER", 40);
		define("PERMISSIONS_LOADED", true);
	}
	

	/* Account data */
	
	if (defined("ACCOUNT_DATA_LIMITS_LOADED") === false) {
		define("FIRSTNAME_LENGTH_MAX", 100);
		define("LASTNAME_LENGTH_MAX", 100);
		define("DISPLAYNAME_LENGTH_MAX", 100);
		define("EMAILADDRESS_LENGTH_MAX", 100);
		define("STREETNAME_LENGTH_MAX", 100);
		define("HOUSENUMBER_LENGTH_MAX", 100);
		define("ZIPCODE_LENGTH_MAX", 100);
		define("CITY_LENGTH_MAX", 100);
		define("COUNTRY_LENGTH_MAX", 100);
		define("PHONENUMBER_LENGTH_MAX", 50);
		define("EATINGHABITS_LENGTH_MAX", 65535);
		define("PASSWORD_LENGTH_MIN", 4);
		define("ACCOUNT_DATA_LIMITS_LOADED", true);
	}


	/* Tokens */

	if (defined("TOKEN_DURATION_IN_DAYS") === false) {
		define("TOKEN_DURATION_IN_DAYS", 7);
	}
	
	
	/* Image Upload */
	
	if (defined("IMAGE_LIMITS_LOADED") === false) {
		define("IMAGE_DIRECTORY_PATH", "../storedImages");
		define("MAX_FILE_SIZE", 50000000);
		define("ALLOWED_IMAGE_EXTENSIONS", array("png", "jpg", "jpeg"));
		define("MAX_DIMENSION_SIZE", 1920);
		define("IMAGE_LIMITS_LOADED", true);
	}


	/* News */

	if (defined("NEWS_LOADED") === false) {
		define("DEFAULT_NEWS_COUNT", 5);
		define("DATE_FORMAT_DB_FULL", "Y-m-d H:i:s");
		define("DATE_FORMAT_USER_DATE", "Y-m-d");
		define("NEWS_TITLE_LENGTH_MAX", 100);
		define("NEWS_SUMMARY_LENGTH_MAX", 500);
		define("NEWS_CONTENT_LENGTH_MAX", 4294967295);
		define("NEWS_LOADED", true);
	}


	/* Events */

	if (defined("EVENTS_LOADED") === false) {
		define("EVENT_TITLE_LENGTH_MAX", 100);
		define("EVENT_TOPIC_LENGTH_MAX", 100);
		define("EVENT_DETAILS_LENGTH_MAX", 4294967295);
		define("EVENT_ENROLLMENT_COMMENT_LENGTH_MAX", 65535);
		define("EVENT_COMPONENT_TITLE_LENGTH_MAX", 100);
		define("EVENT_COMPONENT_CONTENT_LENGTH_MAX", 65535);
		define("EVENTS_LOADED", true);
	}


	/* Session Management */

	if (defined("SESSION_LOADED") === false) {
		define("SESSION_DURATION_HASH", "PT30M");
		define("SESSION_DURATION_OTP", "P1Y");
		define("SESSION_LOADED", true);
	}


	/* Push Notifications */

	if (defined("PN_LOADED") === false) {
		$push_notification_config = json_decode(file_get_contents($secrets_directory."/push_notification.json"), true);

		define("PN_KEYS_PRIVATE", $push_notification_config["key_private"]);
		define("PN_KEYS_PUBLIC", $push_notification_config["key_public"]);
		define("PN_PAYLOAD_ENCODING", $push_notification_config["encoding"]);
		define("PN_TITLE_MAX_LENGTH", 50);
		define("PN_BODY_MAX_LENGTH", 1024);
		define("PN_LOADED", true);
	}
	

	/* Server */

	if (defined("SERVER_LOADED") === false) {
		$server_config = json_decode(file_get_contents($secrets_directory."/server.json"), true);

		define("SERVER_TIMEZONE", $server_config["timezone"]);
		define("SERVER_LOADED", true);

		if (!$server_config["error_reporting"]) {
			error_reporting(~E_ALL);
		}
	}


	/* Mapbox */
	
	if (defined("MAPS_LOADED") === false) {
		$mapbox_config = json_decode(file_get_contents($secrets_directory."/mapbox.json"), true);

		define("MAPS_KEY", $mapbox_config["key"]);
		define("MAPS_LOADED", true);
	}


	/* Strings */

	if (defined("STRINGS_LOADED") === false) {
		define("STRING_MODES", array("PHP", "JS", "APP_SRC", "APP_PUBLIC", "COMMONS_DICTIONARY", "COMMONS_DICTIONARY_KEYS"));
		define("STRING_LANGUAGES", array("de", "en"));
		define("STRINGS_LOADED", true);
	}
	
?>