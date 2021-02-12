<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
	
	if (isset($_GET["mode"]) === false || in_array(strtoupper($_GET["mode"]), STRING_MODES) === false) {
		$result = "Unsupported string mode!";
	} else if (isset($_GET["language"]) === false || in_array(strtolower($_GET["language"]), STRING_LANGUAGES) === false) {
		$result = "Unsupported language!";
	} else {
		$mode = strtoupper($_GET["mode"]);
		$language = strtolower($_GET["language"]);
		
		switch ($mode) {
			case "PHP":
				$result = getPHPDictionary($language);
				break;
			case "JS":
				$result = getJSDictionary($language);
				break;
			case "APP_SRC":
				$result = getAppSrcDictionary($language);
				break;
			case "APP_PUBLIC":
				$result = getAppPublicDictionary($language);
				break;
			case "COMMONS_DICTIONARY":
				$result = getCommonsDictionary($language);
				break;
			case "COMMONS_DICTIONARY_KEYS":
				$result = getCommonsDictionaryKeys();
		}
	}
	echo ($result);


	/* PHP */

	function getPHPDictionary($language) {
		$dictionary = "<?php \$dict = array(";
		$dictionaryEntries = array();
		$res = DatabaseModule::getInstance()->query(
			"SELECT identifier, $language FROM strings ORDER BY identifier ASC"
		);

		while ($row = $res->fetch_assoc()) {
			$row = str_replace("\r\n", "<br/>", $row);
			array_push($dictionaryEntries, "\r\n\"" . addslashes($row["identifier"]) . "\" => \"" . addslashes($row[$language]) . "\"");
		}

		$dictionary .= implode(", ", $dictionaryEntries);
		$dictionary .= "); ?>";
		return htmlspecialchars($dictionary);
	}


	/* JS */

	function getJSDictionary($language) {
		$dictionary = "var dict = {";
		$dictionaryEntries = array();
		$res = DatabaseModule::getInstance()->query(
			"SELECT identifier, $language FROM strings ORDER BY identifier ASC"
		);

		while ($row = $res->fetch_assoc()) {
			array_push($dictionaryEntries, "\r\n\"" . addslashes($row["identifier"]) . "\": \"" . str_replace("\r\n", "\\\r\n", addslashes($row[$language])) . "\"");
		}

		$dictionary .= implode(", ", $dictionaryEntries);
		$dictionary .= "};";
		return htmlspecialchars($dictionary);
	}

	/* App */

	function getAppSrcDictionary($language) {
		$dictionary = "/* eslint-disable */\r\nexport default class Dict {";
		$dictionaryEntries = array();
		$res = DatabaseModule::getInstance()->query(
			"SELECT identifier, $language FROM strings ORDER BY identifier ASC"
		);

		while ($row = $res->fetch_assoc()) {
			array_push($dictionaryEntries, "\r\npublic static \"" . addslashes($row["identifier"]) . "\" = \"" . str_replace("\r\n", "\\r\\n", addslashes($row[$language])) . "\"");
		}

		$dictionary .= implode("; ", $dictionaryEntries);
		$dictionary .= "}";
		return htmlspecialchars($dictionary);
	}

	function getAppPublicDictionary($language) {
		$dictionary = "self.Dict = {";
		$dictionaryEntries = array();
		$res = DatabaseModule::getInstance()->query(
			"SELECT identifier, $language FROM strings ORDER BY identifier ASC"
		);

		while ($row = $res->fetch_assoc()) {
			array_push($dictionaryEntries, "\r\n\"" . addslashes($row["identifier"]) . "\": \"" . str_replace("\r\n", "\\\r\n", addslashes($row[$language])) . "\"");
		}

		$dictionary .= implode(", ", $dictionaryEntries);
		$dictionary .= "}";
		return htmlspecialchars($dictionary);
	}

	function getCommonsDictionary($language) {
		$dictionary = "export class Dictionary {";
		$dictionaryEntries = array();
		$res = DatabaseModule::getInstance()->query(
			"SELECT identifier, $language FROM strings ORDER BY identifier ASC"
		);

		while ($row = $res->fetch_assoc()) {
			array_push($dictionaryEntries, "\r\npublic static \"" . addslashes($row["identifier"]) . "\" = \"" . str_replace("\r\n", "\\r\\n", addslashes($row[$language])) . "\"");
		}

		$dictionary .= implode("; ", $dictionaryEntries);
		$dictionary .= "}";
		return htmlspecialchars($dictionary);
	}

	function getCommonsDictionaryKeys() {
		$dictionary = "export class DictionaryKeys {";
		$dictionaryEntries = array();
		$res = DatabaseModule::getInstance()->query(
			"SELECT identifier FROM strings ORDER BY identifier ASC"
		);

		while ($row = $res->fetch_assoc()) {
			array_push($dictionaryEntries, "\r\npublic static \"" . addslashes($row["identifier"]) . "\" = \"" . addslashes($row["identifier"]) . "\"");
		}

		$dictionary .= implode("; ", $dictionaryEntries);
		$dictionary .= "}";
		return htmlspecialchars($dictionary);
	}

?>