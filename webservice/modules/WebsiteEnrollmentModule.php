<?php
	use PhpImap\IncomingMail;

	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	class WebsiteEnrollmentModule {

		public static function process($enrollmentContent) {
			$enrollment = self::parse($enrollmentContent);

			// TODO

			return $enrollment;
		}

		private static function parse($enrollmentContent) {
			$content = str_replace("\r\n", "\n", trim($enrollmentContent));
			$lines = explode("\n", $content);

			$enrollment = array();

			foreach ($lines as $line) {
				if (strlen($line) === 0) {
					continue;
				}

				$lineParts = explode(":", $line);
				if (count($lineParts) < 2) {
					continue;
				}
				$key = $lineParts[0];
				$value = trim(implode(":", array_slice($lineParts, 1)));

				switch ($key) {
					case "Kursauswahl":
						$enrollment["eventId"] = EventModule::getEventIdByTitle($value);
						break;
					case "Name":
						$nameParts = explode(" ", $value);
						$enrollment["firstName"] = 
							implode(" ", array_slice($nameParts, 0, count($nameParts) - 1));
						$enrollment["lastName"] = end($nameParts);
						break;
					case "Strasse / Hausnr.":
						$streetParts = explode(" ", $value);
						$enrollment["streetName"] = 
							implode(" ", array_slice($streetParts, 0, count($streetParts) - 1));
						$enrollment["houseNumber"] = end($streetParts);
						break;
					case "PLZ":
						$enrollment["zipCode"] = $value;
						break;
					case "Ort":
						$enrollment["city"] = $value;
						break;
					case "Geburtsdatum":
						$birthdate = new DateTime($value, new DateTimeZone(SERVER_TIMEZONE));
						$enrollment["birthdate"] = $birthdate->format(DATE_FORMAT_USER_DATE);
						break;
					case "Vegetarier":
						$enrollment["eatingHabits"] = 
							$value === "Ja" ? "Vegetarisch" : "Uneingeschränkt";
						break;
					case "Mail":
						$enrollment["eMailAddress"] = $value;
						break;
					case "Telefon":
						$enrollment["phoneNumber"] = $value;
						break;
					case "Möchtest du uns noch etwas sagen?":
						$enrollment["eventEnrollmentComment"] = $value;
						break;
					default:
						break;
				}
			}

			return $enrollment;
		}
		
	}
?>