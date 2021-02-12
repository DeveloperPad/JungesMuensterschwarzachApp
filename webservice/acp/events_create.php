<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	

	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_EVENTS) {
		header("Location: ../index.php");
		exit;
	}

	if ($_SERVER["REQUEST_METHOD"] === "POST") {
		try {
			EventModule::createEvent(
				$_POST["eventTitle"], $_POST["eventTopic"], $_POST["eventDetails"],
				$_POST["eventStart"], $_POST["eventEnd"], 
				$_POST["eventEnrollmentStart"], $_POST["eventEnrollmentEnd"],
				$_POST["eventOfferId"], $_POST["eventScheduleId"], $_POST["eventTargetGroupId"],
				$_POST["eventPriceId"], $_POST["eventPackingListId"], 
				$_POST["eventLocationId"], $_POST["eventArrivalId"],
				$_POST["requiredAccessLevel"], $ownAccessLevel
			);
			unset($_POST);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["event_creation_success"]));
			header("Location: ./events.php");
			exit;
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	try {
		$accessLevels = UserModule::loadAccessLevels($ownAccessLevel);
	} catch (Exception $exc) {
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
	}

	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
		<script src="<?php echo(ROOT_PUBLIC);?>/js/event_component_modal.js"></script>
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
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["event_add"]);?></h3>
				<a href="events.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["event_list_back"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<form name="eventCreateForm" method="POST" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="eventTitle"><?php echo($GLOBALS["dict"]["event_eventTitle"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-heading fa-fw"></i></span>
							<input name="eventTitle" type="text" class="form-control font-weight-bold" placeholder="<?php echo($GLOBALS["dict"]["event_eventTitle_placeholder"]);?>"
								value="<?php if (isset($_POST["eventTitle"]) === true) echo(htmlspecialchars($_POST["eventTitle"]));?>" maxlength="<?php echo(EVENT_TITLE_LENGTH_MAX);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventTopic"><?php echo($GLOBALS["dict"]["event_eventTopic"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-heading fa-fw"></i></span>
							<input name="eventTopic" type="text" class="form-control font-weight-bold" placeholder="<?php echo($GLOBALS["dict"]["event_eventTopic_placeholder"]);?>"
								value="<?php if (isset($_POST["eventTopic"]) === true) echo(htmlspecialchars($_POST["eventTopic"]));?>" maxlength="<?php echo(EVENT_TOPIC_LENGTH_MAX);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventDetails"><?php echo($GLOBALS["dict"]["event_eventDetails"]);?></label>
						<div class="col-12">
							<textarea name="eventDetails" class="form-control wysiwyg-editor" placeholder="<?php echo($GLOBALS["dict"]["event_eventDetails_placeholder"]);?>"
								maxlength="<?php echo(EVENT_DETAILS_LENGTH_MAX);?>" required><?php if (isset($_POST["eventDetails"]) === true) echo(htmlspecialchars($_POST["eventDetails"]));?></textarea>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventStart"><?php echo($GLOBALS["dict"]["event_eventStart"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon input-group-datetimepicker"><i class="fas fa-calendar-alt fa-fw"></i></span>
							<input name="eventStart" type="text" pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}" class="form-control" 
								placeholder="<?php echo($GLOBALS["dict"]["event_eventStart_placeholder"]);?>"
								value="<?php if (isset($_POST["eventStart"]) === true) echo($_POST["eventStart"]);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventEnd"><?php echo($GLOBALS["dict"]["event_eventEnd"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon input-group-datetimepicker"><i class="fas fa-calendar-alt fa-fw"></i></span>
							<input name="eventEnd" type="text" pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}" class="form-control" 
								placeholder="<?php echo($GLOBALS["dict"]["event_eventEnd_placeholder"]);?>"
								value="<?php if (isset($_POST["eventEnd"]) === true) echo($_POST["eventEnd"]);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventEnrollmentStart"><?php echo($GLOBALS["dict"]["event_eventEnrollmentStart"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon input-group-datetimepicker"><i class="fas fa-calendar-alt fa-fw"></i></span>
							<input name="eventEnrollmentStart" type="text" pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}" class="form-control" 
								placeholder="<?php echo($GLOBALS["dict"]["event_eventEnrollmentStart_placeholder"]);?>"
								value="<?php if (isset($_POST["eventEnrollmentStart"]) === true) echo($_POST["eventEnrollmentStart"]);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventEnrollmentEnd"><?php echo($GLOBALS["dict"]["event_eventEnrollmentEnd"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon input-group-datetimepicker"><i class="fas fa-calendar-alt fa-fw"></i></span>
							<input name="eventEnrollmentEnd" type="text" pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}" class="form-control" 
								placeholder="<?php echo($GLOBALS["dict"]["event_eventEnrollmentEnd_placeholder"]);?>"
								value="<?php if (isset($_POST["eventEnrollmentEnd"]) === true) echo($_POST["eventEnrollmentEnd"]);?>" required>
						</div>
					</div>
					<hr>
					<div class="form-group">
						<label class="control-label col-12" for="eventOfferId"><?php echo($GLOBALS["dict"]["event_eventOffer"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-list fa-fw"></i></span>
							<select name="eventOfferId" class="form-control" <?php if (isset($_POST["eventOfferId"]) === true) echo("data-selected=".$_POST["eventOfferId"]);?>>
							</select>
							<button id="eventOffersManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::OFFERS));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventOffers"]));?>">
								<?php echo($GLOBALS["dict"]["event_eventOffers_manage"]);?></button>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventScheduleId"><?php echo($GLOBALS["dict"]["event_eventSchedule"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-list fa-fw"></i></span>
							<select name="eventScheduleId" class="form-control" <?php if (isset($_POST["eventScheduleId"]) === true) echo("data-selected=".$_POST["eventScheduleId"]);?>>
							</select>
							<button id="eventSchedulesManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::SCHEDULES));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventSchedules"]));?>">
								<?php echo($GLOBALS["dict"]["event_eventSchedules_manage"]);?></button>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventTargetGroupId"><?php echo($GLOBALS["dict"]["event_eventTargetGroup"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-users fa-fw"></i></span>
							<select name="eventTargetGroupId" class="form-control" <?php if (isset($_POST["eventTargetGroupId"]) === true) echo("data-selected=".$_POST["eventTargetGroupId"]);?>>
							</select>
							<button id="eventTargetGroupsManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::TARGET_GROUPS));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventTargetGroups"]));?>">
								<?php echo($GLOBALS["dict"]["event_eventTargetGroups_manage"]);?></button>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventPriceId"><?php echo($GLOBALS["dict"]["event_eventPrice"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-money-bill-alt fa-fw"></i></span>
							<select name="eventPriceId" class="form-control" <?php if (isset($_POST["eventPriceId"]) === true) echo("data-selected=".$_POST["eventPriceId"]);?>>
							</select>
							<button id="eventPricesManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::PRICES));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventPrices"]));?>">
								<?php echo($GLOBALS["dict"]["event_eventPrices_manage"]);?></button>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventPackingListId"><?php echo($GLOBALS["dict"]["event_eventPackingList"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-suitcase fa-fw"></i></span>
							<select name="eventPackingListId" class="form-control" <?php if (isset($_POST["eventPackingListId"]) === true) echo("data-selected=".$_POST["eventPackingListId"]);?>>
							</select>
							<button id="eventPackingListsManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::PACKING_LISTS));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventPackingLists"]));?>">
								<?php echo($GLOBALS["dict"]["event_packingLists_manage"]);?></button>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventArrivalId"><?php echo($GLOBALS["dict"]["event_eventArrival"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-taxi fa-fw"></i></span>
							<select name="eventArrivalId" class="form-control" <?php if (isset($_POST["eventArrivalId"]) === true) echo("data-selected=".$_POST["eventArrivalId"]);?>>
							</select>
							<button id="eventArrivalsManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::ARRIVALS));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventArrivals"]));?>">
								<?php echo($GLOBALS["dict"]["event_eventArrivals_manage"]);?></button>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eventLocationId"><?php echo($GLOBALS["dict"]["event_eventLocation"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-map fa-fw"></i></span>
							<select name="eventLocationId" class="form-control" <?php if (isset($_POST["eventLocationId"]) === true) echo("data-selected=".$_POST["eventLocationId"]);?>>
							</select>
							<button id="eventLocationsManage" type="button" class="btn btn-default ml-3" data-toggle="modal" data-target="#manageEventComponentModal"
								data-component-type="<?php echo(htmlspecialchars(EventComponent::LOCATIONS));?>" data-component-name="<?php echo(htmlspecialchars($GLOBALS["dict"]["event_eventLocations"]));?>">
								<?php echo($GLOBALS["dict"]["event_eventLocations_manage"]);?></button>
						</div>
					</div>
					<hr>
					<div class="form-group">
						<label class="control-label col-12" for="requiredAccessLevel"><?php echo($GLOBALS["dict"]["event_requiredAccessLevel"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-bolt fa-fw"></i></span>
							<select name="requiredAccessLevel" class="form-control">
							<?php
								foreach($accessLevels as $accessLevel) {
									echo("<option value=\"{$accessLevel["accessLevel"]}\"");
									if (isset($_POST["requiredAccessLevel"]) === true) {
										if ($_POST["requiredAccessLevel"] === $accessLevel["accessLevel"]) {
											echo(" selected");
										}
									} else {
										if ($accessLevel["accessLevel"] === ACCESS_LEVEL_EDITOR) {
											echo(" selected");
										}
									}
									echo(">{$GLOBALS["dict"][$accessLevel["accessIdentifier"]]}+</option>");
								}
							?>
							</select>
						</div>
					</div>
					<hr>
					<div class="form-group mt-4">
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-save fa-fw"></i></span>
							<button id="submit" type="submit" class="btn btn-success"><?php echo($GLOBALS["dict"]["label_submit"]);?></button>
						</div>
					</div>
				</form>	
			</div>
		</div>
		<div class="modal fade" id="manageEventComponentModal" tabindex="-1">
			<div class="modal-dialog modal-dialog-maximize">
				<div class="modal-content modal-content-maximize">
					<div class="modal-header">
						<h5 class="modal-title"><strong></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<div class="list-group">
							<div class="row list-group-item">
								<div class="d-flex w-100 text-center">
									<div class="col-1 my-auto">
										<span><strong><?php echo($GLOBALS["dict"]["event_component_id"]);?></strong></span>
									</div>
									<div class="col-4 my-auto">
										<span><strong><?php echo($GLOBALS["dict"]["event_component_title"]);?></strong></span>
									</div>
									<div class="col-6 my-auto">
										<span><strong><?php echo($GLOBALS["dict"]["event_component_content"]);?></strong></span>
									</div>
									<div class="col-1 my-auto">
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_close"]);?></button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="deleteEventComponentModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_warning"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["event_component_delete_modal_safeguard_1"]);?></p>
						<p><?php echo($GLOBALS["dict"]["not_revertable"]);?></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_confirm"]);?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_cancel"]);?></button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="chooseEventLocationModal" tabindex="-1" data-key="<?php echo(htmlspecialchars(MAPS_KEY));?>">
			<div class="modal-dialog modal-dialog-maximize">
				<div class="modal-content modal-content-maximize">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["event_eventLocation_choose"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<div id="jma-maps-container-modal">
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_save"]);?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_close"]);?></button>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>