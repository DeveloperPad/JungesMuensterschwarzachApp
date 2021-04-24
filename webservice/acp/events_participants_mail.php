<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/CookieModule.php");
	require_once(ROOT_LOCAL."/modules/MailModule.php");
	require_once(ROOT_LOCAL."/modules/NewsletterModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_USER || isset($_GET["eventId"]) === false) {
		header("Location: ../index.php");
		exit;
	}

	try {
		$event = EventModule::loadEvent($_GET["eventId"], $ownAccessLevel);
		$currentUser = UserModule::loadUser(CookieModule::get("userId"), ACCESS_LEVEL_DEVELOPER);

		if ($_SERVER["REQUEST_METHOD"] === "POST") {
			$isPublication = isset($_POST["publish"]);

			if ($isPublication) {
				$participants = $event["eventParticipants"];
				array_push($participants, array("eMailAddress" => MAIL_COURSE_INSTRUCTORS));
			} else {
				$participants = [$currentUser];
			}

			$attachments = [];
			$attachmentCount = count($_FILES["attachments"]["name"]);
			for ($i = 0; $i < $attachmentCount; $i++) {
				$attachment = [];
				$attachment["name"] = $_FILES["attachments"]["name"][$i];
				$attachment["tmp_name"] = $_FILES["attachments"]["tmp_name"][$i];
				$attachment["size"] = $_FILES["attachments"]["size"][$i];

				if (empty($attachment["name"])) {
					continue;
				}
				array_push($attachments, $attachment);
			}

			foreach ($participants as $participant) {
				MailModule::sendMail(
					$participant["eMailAddress"],
					$GLOBALS["dict"]["mail_title_prefix"] 
						. "[" . $event["eventTitle"]. "] "
						. $_POST["title"],
					$_POST["content"],
					$attachments,
					$currentUser
				);
			}

			if ($isPublication) {
				CookieModule::set("alert", new Alert("success", 
					$GLOBALS["dict"]["mail_event_participants_publish_success_prefix"]
					. count($participants)
					. $GLOBALS["dict"]["mail_event_participants_publish_success_suffix"]
				));
				header("Location: ./events_participants_mail.php?eventId=".$_GET["eventId"]);
				exit;
			} else {
				CookieModule::set("alert", new Alert("warning", 
					$GLOBALS["dict"]["mail_event_participants_preview_success"]
				));
			}
		}
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
				<h1><?php echo($GLOBALS["dict"]["event_eventTitle_prefix"] . $event["eventTitle"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["mail_event_participants_add"]);?></h3>
				<a href="events_participants.php?eventId=<?php echo($_GET["eventId"]); ?>" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["event_participants_list_back"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<form name="eventsParticipantsMailForm" method="POST" enctype="multipart/form-data" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="title"><?php echo($GLOBALS["dict"]["mail_title"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><?php echo($GLOBALS["dict"]["mail_title_prefix"]."[".$event["eventTitle"]."]"); ?></span>
							<input name="title" type="text" class="form-control font-weight-bold" placeholder="<?php echo($GLOBALS["dict"]["mail_title_placeholder"]);?>"
								value="<?php if (isset($_POST["title"]) === true) echo(htmlspecialchars($_POST["title"]));?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="content"><?php echo($GLOBALS["dict"]["mail_content"]);?></label>
						<div class="col-12">
							<textarea name="content" class="form-control wysiwyg-editor" placeholder="<?php echo($GLOBALS["dict"]["mail_content_placeholder"]);?>" 
								required><?php if (isset($_POST["content"]) === true) echo(htmlspecialchars($_POST["content"]));?></textarea>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="attachments"><?php echo($GLOBALS["dict"]["mail_attachments"]);?></label>
						<div class="col-12">
							<input id="attachments" name="attachments[]" class="form-control" type="file" multiple="multiple"
							 value="<?php if (isset($_FILES["attachments"])) echo($_FILES["attachments"]); ?>"/>
						</div>
						<div class="col-12">
							<p><small><strong><?php echo($GLOBALS["dict"]["mail_attachments_notice"]);?></strong></small></p>
						</div>
					</div>
					<hr>
					<div class="form-group mt-4">
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-save fa-fw"></i></span>
							<button name="preview" type="submit" class="btn btn-success"><?php echo($GLOBALS["dict"]["label_preview"]);?></button>
							<button name="publish" type="submit" class="btn btn-danger"><?php echo($GLOBALS["dict"]["label_submit"]);?></button>
						</div>
					</div>
				</form>	
			</div>
		</div>
	</body>
</html>