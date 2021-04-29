<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if (!PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_NEWS]) {
		header("Location: ../index.php");
		exit;
	}

	if ($_SERVER["REQUEST_METHOD"] === "POST") {
		try {
			NewsModule::createNews($ownAccessLevel, $_POST["title"], $_POST["summary"], $_POST["content"], $_POST["requiredAccessLevel"]);
			unset($_POST);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_creation_success"]));
			header("Location: ./news.php");
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
				<h1><?php echo($GLOBALS["dict"]["news_management"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["news_add"]);?></h3>
				<a href="news.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["news_list_back"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<form name="newsCreateForm" method="POST" class="form-horizontal">
				<div class="form-group">
					<div class="form-group">
						<label class="control-label col-12" for="title"><?php echo($GLOBALS["dict"]["news_title"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-heading fa-fw"></i></span>
							<input name="title" type="text" class="form-control font-weight-bold" placeholder="<?php echo($GLOBALS["dict"]["news_title_placeholder"]);?>"
								value="<?php if (isset($_POST["title"]) === true) echo(htmlspecialchars($_POST["title"]));?>" maxlength="<?php echo(NEWS_TITLE_LENGTH_MAX);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="summary"><?php echo($GLOBALS["dict"]["news_summary"]);?></label>
						<div class="col-12">
							<textarea name="summary" class="form-control font-weight-light disable-resizing" placeholder="<?php echo($GLOBALS["dict"]["news_summary_placeholder"]);?>"
								maxlength="<?php echo(NEWS_SUMMARY_LENGTH_MAX);?>" rows="3" required><?php if (isset($_POST["summary"]) === true) echo(htmlspecialchars($_POST["summary"]));?></textarea>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="content"><?php echo($GLOBALS["dict"]["news_content"]);?></label>
						<div class="col-12">
							<textarea name="content" class="form-control wysiwyg-editor" placeholder="<?php echo($GLOBALS["dict"]["news_content_placeholder"]);?>"
								maxlength="<?php echo(NEWS_CONTENT_LENGTH_MAX);?>" required><?php if (isset($_POST["content"]) === true) echo(htmlspecialchars($_POST["content"]));?></textarea>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="requiredAccessLevel"><?php echo($GLOBALS["dict"]["news_requiredAccessLevel"]);?></label>
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
	</body>
</html>