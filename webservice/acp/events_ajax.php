<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/PushNotificationModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();

	if ($ownAccessLevel < PERMISSION_EVENTS) {
		return;
	}
	
	$_POST["action"]($ownAccessLevel);

	
	/* Event components */

	function fetchEventComponentList($ownAccessLevel) {
		try {
			$eventComponentList = EventModule::loadEventComponentList($_POST["eventComponentType"]);
			echo(json_encode($eventComponentList));
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function fetchEventLocationList($ownAccessLevel) {
		try {
			$eventLocationList = EventModule::loadEventLocationList();
			echo(json_encode($eventLocationList));
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function createEventComponent($ownAccessLevel) {
		try {
			EventModule::createEventComponent($_POST["eventComponentType"], $_POST["eventComponentTitle"], $_POST["eventComponentContent"]);
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function createEventLocation($ownAccessLevel) {
		try {
			EventModule::createEventLocation($_POST["eventLocationTitle"], $_POST["eventLocationLatitude"], $_POST["eventLocationLongitude"]);
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function updateEventComponent($ownAccessLevel) {
		try {
			EventModule::updateEventComponentTitle($_POST["eventComponentType"], $_POST["eventComponentId"], $_POST["eventComponentTitle"]);
			EventModule::updateEventComponentContent($_POST["eventComponentType"], $_POST["eventComponentId"], $_POST["eventComponentContent"]);
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function updateEventLocation($ownAccessLevel) {
		try {
			EventModule::updateEventLocationTitle($_POST["eventLocationId"], $_POST["eventLocationTitle"]);
			EventModule::updateEventLocationLatitudeLongitude($_POST["eventLocationId"], $_POST["eventLocationLatitude"], $_POST["eventLocationLongitude"]);
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function deleteEventComponent($ownAccessLevel) {
		try {
			EventModule::deleteEventComponent($_POST["eventComponentType"], $_POST["eventComponentId"]);
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}

	function deleteEventLocation($ownAccessLevel) {
		try {
			EventModule::deleteEventLocation($_POST["eventLocationId"]);
		} catch (Exception $exc) {
			echo($GLOBALS["dict"][$exc->getMessage()]);
		}
	}


	/* Events */

	function announceEvent($ownAccessLevel) {
		try {
			$report = PushNotificationModule::sendEventNotification($_POST["eventId"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $report));
		} catch (Exception $exc) {
			if (isset($GLOBALS["dict"][$exc->getMessage()]) === true) {
				CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
			} else {
				CookieModule::set("alert", new Alert("danger", $exc->getMessage()));
			}
		}
	}

	function updateEventTitle($ownAccessLevel) {
		updateEventAttribute("eventTitle", $ownAccessLevel);
	}

	function updateEventTopic($ownAccessLevel) {
		updateEventAttribute("eventTopic", $ownAccessLevel);
	}

	function updateEventDetails($ownAccessLevel) {
		updateEventAttribute("eventDetails", $ownAccessLevel);
	}

	function updateEventStart($ownAccessLevel) {
		updateEventAttribute("eventStart", $ownAccessLevel);
	}

	function updateEventEnd($ownAccessLevel) {
		updateEventAttribute("eventEnd", $ownAccessLevel);
	}

	function updateEventEnrollmentStart($ownAccessLevel) {
		updateEventAttribute("eventEnrollmentStart", $ownAccessLevel);
	}

	function updateEventEnrollmentEnd($ownAccessLevel) {
		updateEventAttribute("eventEnrollmentEnd", $ownAccessLevel);
	}

	function updateEventOfferId($ownAccessLevel) {
		updateEventComponentId("eventOfferId", $ownAccessLevel);
	}

	function updateEventScheduleId($ownAccessLevel) {
		updateEventComponentId("eventScheduleId", $ownAccessLevel);
	}

	function updateEventTargetGroupId($ownAccessLevel) {
		updateEventComponentId("eventTargetGroupId", $ownAccessLevel);
	}

	function updateEventPriceId($ownAccessLevel) {
		updateEventComponentId("eventPriceId", $ownAccessLevel);
	}

	function updateEventPackingListId($ownAccessLevel) {
		updateEventComponentId("eventPackingListId", $ownAccessLevel);
	}

	function updateEventArrivalId($ownAccessLevel) {
		updateEventComponentId("eventArrivalId", $ownAccessLevel);
	}

	function updateEventLocationId($ownAccessLevel) {
		updateEventComponentId("eventLocationId", $ownAccessLevel);
	}

	function updateRequiredAccessLevel($ownAccessLevel) {
		updateEventAttribute("requiredAccessLevel", $ownAccessLevel);
	}

	function updateEventAttribute($attribute, $ownAccessLevel) {
		try {
			$moduleUpdateFunction = "update" . ucfirst($attribute);
			EventModule::$moduleUpdateFunction($_POST["eventId"], $_POST[$attribute], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["event_${attribute}_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateEventComponentId($component, $ownAccessLevel) {
		try {
			$componentType = substr($component, 5, -2);  // "eventLocationId" becomes "Location"
			EventModule::updateEventComponentId($_POST["eventId"], $componentType, $_POST[$component], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["event_${component}_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}


	function deleteEvent($ownAccessLevel) {
		try {
			EventModule::deleteEvent($_POST["eventId"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["event_deletion_success"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
?>