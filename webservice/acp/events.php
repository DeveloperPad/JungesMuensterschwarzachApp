<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if (!PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_IMAGES]
			&& !PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_EVENTS]) {
		header("Location: ../index.php");
		exit;
	}
	
	function printTable($eventList, $ownAccessLevel) {
		?>
		<div class="list-group">
		<?php
			printHeader();
			foreach($eventList as $event) {
				printRow($event, $ownAccessLevel);
			}
		?>
		</div>
		<?php
	}
	
	function printHeader() {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center">
				<div class="col-1 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["event_eventId"]);?></strong></span>
				</div>
				<div class="col-3 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["event_eventTitle"]);?></strong></span>
				</div>
				<div class="col-2 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["event_eventStart"]);?></strong></span>
				</div>
				<div class="col-2 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["event_eventEnd"]);?></strong></span>
				</div>
				<div class="col-2 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["event_requiredAccessLevel"]);?></strong></span>
				</div>
				<div class="col-2 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["label_manage"]);?></strong></span>
				</div>
			</div>
		</div>
		<?php
	}
	
	function printRow($event, $ownAccessLevel) {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center align-items-center">
				<div class="col-1">
					<span><?php echo($event["eventId"]);?></span>
				</div>
				<div class="col-3">
					<span><?php echo($event["eventTitle"]);?></span>
				</div>
				<div class="col-2">
					<span><?php echo($event["eventStart"]);?></span>
				</div>
				<div class="col-2">
					<span><?php echo($event["eventEnd"]);?></span>
				</div>
				<div class="col-2">
					<span class="badge badge-pill <?php echo(GlobalFunctions::getAccessBadge($event["requiredAccessLevel"]));?>"><?php echo($GLOBALS["dict"][$event["accessIdentifier"]]);?>+</span>
				</div>
				<div class="col-2">
					<a href="events_participants.php?eventId=<?php echo($event["eventId"]);?>"><i class="fas fa-users fa-fw text-success mx-1"></i></a>
					<?php
					if (PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_IMAGES]) {
					?>
						<a href="images.php?eventId=<?php echo($event["eventId"]);?>"><i class="far fa-images fa-fw text-info mx-1"></i></a>
					<?php
					}
					if (PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_EVENTS]) {
					?>
					<a href="events_edit.php?eventId=<?php echo($event["eventId"]);?>"><i class="far fa-edit fa-fw text-dark mx-1"></i></a>
					<a href="#"><i class="far fa-trash-alt fa-fw text-danger" data-toggle="modal" data-target="#deleteEventModal" 
						data-eventid="<?php echo($event["eventId"]);?>" data-title="<?php echo(htmlspecialchars($event["eventTitle"]));?>"></i></a>
					<?php
					}
					?>
				</div>
			</div>
		</div>
		<?php
	}

	try {
		$eventList = EventModule::loadEventList($ownAccessLevel);
	} catch(Exception $exc) {
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
	}

	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
		<script src="../js/modal.js"></script>
	</head>
	<body>
		<?php require(ROOT_LOCAL."/assets/navigation.php");?>
		
		<div class="container">
			<?php
				if ($cookieAlert !== null) {
					Alert::show($cookieAlert);
				}
			?>
		
			<div class="jumbotron jma-background-color">
				<h1><?php echo($GLOBALS["dict"]["event_management"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["event_list"]);?></h3>
				<a href="events_create.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["event_add"]);?></a>
				<div class="clearfix"></div>

				<?php 
					$now = new DateTime("now", new DateTimeZone(SERVER_TIMEZONE));

					$invalidEventList = array();
					$ongoingEventList = array();
					$upcomingEventList = array();
					$pastEventList = array();

					foreach ($eventList as $event) {
						$eventStart = DateTime::createFromFormat(DATE_FORMAT_DB_FULL, $event["eventStart"], new DateTimeZone(SERVER_TIMEZONE));
						$eventEnd = DateTime::createFromFormat(DATE_FORMAT_DB_FULL, $event["eventEnd"], new DateTimeZone(SERVER_TIMEZONE));

						if ($eventStart === false || $eventEnd === false) {
							array_push($invalidEventList, $event);
						} else if ($now < $eventStart) {
							array_push($upcomingEventList, $event);
						} else if ($eventEnd < $now) {
							array_push($pastEventList, $event);
						} else {
							array_push($ongoingEventList, $event);
						}
					}

					if (empty($invalidEventList) === false) {
						?>
						<hr>
						<div class="d-flex w-100 text-center align-items-center">
							<div class="col-2">
								<span class="badge badge-pill badge-warning mb-3"><?php echo($GLOBALS["dict"]["navigation_events_invalid"]);?></span>
							</div>
						</div>
						<?php
						printTable($invalidEventList, $ownAccessLevel);
					}

					if (empty($ongoingEventList) === false) {
						?>
						<hr>
						<div class="d-flex w-100 text-center align-items-center">
							<div class="col-2">
								<span class="badge badge-pill badge-danger mb-3"><?php echo($GLOBALS["dict"]["navigation_events_ongoing"]);?></span>
							</div>
						</div>
						<?php
						printTable($ongoingEventList, $ownAccessLevel);
					}

					if (empty($upcomingEventList) === false) {
						?>
						<hr>
						<div class="d-flex w-100 text-center align-items-center">
							<div class="col-2">
								<span class="badge badge-pill badge-dark mb-3"><?php echo($GLOBALS["dict"]["navigation_events_upcoming"]);?></span>
							</div>
						</div>
						<?php
						printTable($upcomingEventList, $ownAccessLevel);
					}

					if (empty($pastEventList) === false) {
						?>
						<hr>
						<div class="d-flex w-100 text-center align-items-center">
							<div class="col-2">
								<span class="badge badge-pill badge-secondary mb-3"><?php echo($GLOBALS["dict"]["navigation_events_past"]);?></span>
							</div>
						</div>
						<?php
						printTable($pastEventList, $ownAccessLevel);
					}
				?>
			</div>
		</div>
		<div class="modal fade" id="deleteEventModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_warning"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["event_delete_modal_safeguard_1_prefix"]);?><strong></strong><?php echo($GLOBALS["dict"]["event_delete_modal_safeguard_1_suffix"]);?></p>
						<p><?php echo($GLOBALS["dict"]["not_revertable"]);?></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger"><?php echo($GLOBALS["dict"]["label_confirm"]);?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_cancel"]);?></button>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>