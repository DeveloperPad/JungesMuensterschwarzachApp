<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}

	class DatabaseModule extends MySQLi {

		private static $instance = null;

		
		private function __construct($host, $user, $password, $database) {
			parent::__construct($host, $user, $password, $database);
			$this->set_charset(DB_CHARSET);
		}

		public static function getInstance(): DatabaseModule {
			if (self::$instance === null) {
				self::$instance = new self(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
			}

			if (self::$instance->connect_error) {
				throw new Exception("error_message_timeout");
			}

			return self::$instance;
		}
		
	}
?>