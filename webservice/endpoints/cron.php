<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/WebsiteEnrollmentModule.php");

	WebsiteEnrollmentModule::cron();
?>