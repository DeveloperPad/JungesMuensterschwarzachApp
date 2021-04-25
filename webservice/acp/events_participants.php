<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_USER || isset($_GET["eventId"]) === false) {
		header("Location: ../index.php");
		exit;
	}

	if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["eventId"]) === true) {
		try {
			$event = EventModule::loadEvent($_GET["eventId"], $ownAccessLevel);
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
	</head>
	<body>
		<?php require(ROOT_LOCAL."/assets/navigation.php");?>
		
		<div class="container">
			<?php
				if ($cookieAlert !== null) {
					Alert::show($cookieAlert);
					
					if (isset($exc) === true && $exc->getMessage() === "error_message_NEP") {
						return;
					}
				}
			?>
			<div class="jumbotron jma-background-color">
				<h1><?php echo($GLOBALS["dict"]["event_participants_list"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["event_eventTitle_prefix"] . $event["eventTitle"]);?></h3>
				<a href="events.php" class="btn btn-primary float-right ml-2"><?php echo($GLOBALS["dict"]["label_back"]);?></a>
				<a href="events_participants_mail.php?eventId=<?php echo($event["eventId"]);?>" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["mail_event_participants_add"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<div class="table-responsive">
				<table class="table jma-table">
					<thead>
						<tr class="d-flex">
							<th class="col-2">
								<span><strong><?php echo($GLOBALS["dict"]["event_eventEnrollmentDate"]);?></strong></span>
							</th>
							<th class="col-3">
								<span><strong><?php echo($GLOBALS["dict"]["account_data_contact"]);?></strong></span>
							</th>
							<th class="col-2">
							</th>
							<th class="col-2">
								<span><strong><?php echo($GLOBALS["dict"]["account_birthdate"]);?></strong></span>
							</th>
							<th class="col-1">
								<span><strong><?php echo($GLOBALS["dict"]["account_eatingHabits"]);?></strong></span>
							</th>
							<th class="col-2">
								<span><strong><?php echo($GLOBALS["dict"]["event_eventEnrollmentComment"]);?></strong></span>
							</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ($event["eventParticipants"] as $participant) { ?>
							<tr class="d-flex">
								<td class="col-2">
									<span><?php echo(GlobalFunctions::formatDate($participant["enrollmentDate"]));?></span>
								</td>
								<td class="col-3">
									<div><?php echo($participant["firstName"] . " " . $participant["lastName"]);?></div>
									<div><?php echo($participant["streetName"] . " " . $participant["houseNumber"]);?></div>
									<?php if (isset($participant["supplementaryAddress"])) { ?>
										<div><?php echo($participant["supplementaryAddress"]); ?></div>
									<?php } ?>
									<div><?php echo($participant["zipCode"] . " " . $participant["city"]);?></div>
									<div><?php echo($participant["country"]);?></div>
								</td>
								<td class="col-2">
									<div class="badge badge-pill badge-<?php echo($participant["allowPost"] ? "success" : "danger");?>"><?php echo($GLOBALS["dict"]["account_allowPost_label"]);?></div>
									<div class="badge badge-pill badge-<?php echo($participant["allowNewsletter"] ? "success" : "danger");?>"><?php echo($GLOBALS["dict"]["account_allowNewsletter_label"]);?></div>
									<?php if (isset($participant["phoneNumber"])) { ?>
										<div><?php echo($participant["phoneNumber"]);?></div>
									<?php } ?>
									<div><a href="mailto:<?php echo(urlencode($participant["eMailAddress"])); ?>"><?php echo($participant["eMailAddress"]);?></a></div>
								</td>
								<td class="col-2">
									<span><?php echo(GlobalFunctions::formatDate($participant["birthdate"]));?></span>
								</td>
								<td class="col-1">
									<span><?php if (isset($participant["eatingHabits"])) { echo($participant["eatingHabits"]); }?></span>
								</td>
								<td class="col-2">
									<span><?php echo($participant["eventEnrollmentComment"]);?></span>
								</td>
							</tr>
						<?php } ?>
					</tbody>
				</table>
				</div>
			</div>
		</div>
	</body>
</html>