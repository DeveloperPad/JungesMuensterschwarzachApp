<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/CookieModule.php");
	require_once(ROOT_LOCAL."/modules/MailModule.php");
	require_once(ROOT_LOCAL."/modules/NewsletterModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_NEWSLETTER) {
		header("Location: ../index.php");
		exit;
	}

	if ($_SERVER["REQUEST_METHOD"] === "POST") {
		try {
			$isPublication = isset($_POST["publish"]);

			if ($isPublication) {
				$registrations = NewsletterModule::loadRegistrations();
			} else {
				$user = UserModule::loadUser(CookieModule::get("userId"), ACCESS_LEVEL_DEVELOPER);
				$user["code"] = null;
				$registrations = [$user];
			}

			foreach ($registrations as $registration) {
				MailModule::sendNewsletterMail(
					$registration["eMailAddress"],
					$GLOBALS["dict"]["newsletter_title_prefix"] . $_POST["title"],
					$_POST["content"],
					$registration["code"]
				);
			}

			if ($isPublication) {
				CookieModule::set("alert", new Alert("success", 
					$GLOBALS["dict"]["newsletter_creation_publish_success_prefix"]
					. count($registrations)
					. $GLOBALS["dict"]["newsletter_creation_publish_success_suffix"]
				));
				header("Location: ./newsletter_registrations.php");
				exit;
			} else {
				CookieModule::set("alert", new Alert("warning", 
					$GLOBALS["dict"]["newsletter_creation_preview_success"]
				));
			}
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
				}
			?>
			<div class="jumbotron jma-background-color">
				<h1><?php echo($GLOBALS["dict"]["navigation_newsletters"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["newsletter_add"]);?></h3>
				<a href="newsletter_registrations.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["newsletter_registrations_back"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<form name="newsletterCreateForm" method="POST" class="form-horizontal">
				<div class="form-group">
					<div class="form-group">
						<label class="control-label col-12" for="title"><?php echo($GLOBALS["dict"]["newsletter_title"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><?php echo($GLOBALS["dict"]["newsletter_title_prefix"]); ?></span>
							<input name="title" type="text" class="form-control font-weight-bold" placeholder="<?php echo($GLOBALS["dict"]["newsletter_title_placeholder"]);?>"
								value="<?php if (isset($_POST["title"]) === true) echo(htmlspecialchars($_POST["title"]));?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="content"><?php echo($GLOBALS["dict"]["newsletter_content"]);?></label>
						<div class="col-12">
							<textarea name="content" class="form-control wysiwyg-editor" placeholder="<?php echo($GLOBALS["dict"]["newsletter_content_placeholder"]);?>" 
								required><?php if (isset($_POST["content"]) === true) echo(htmlspecialchars($_POST["content"]));?></textarea>
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