<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_NEWS || isset($_GET["newsId"]) === false) {
		header("Location: ../index.php");
		exit;
	}
	
	if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["newsId"]) === true) {
		try {
			$_POST = NewsModule::loadNewsArticle($_GET["newsId"], $ownAccessLevel);
			$accessLevels = UserModule::loadAccessLevels($ownAccessLevel);
			$userList = UserModule::loadUserList($ownAccessLevel);
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
		<script src="../js/news_edit.js"></script>
		<script src="../js/modal.js"></script>
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
				<h1><?php echo($GLOBALS["dict"]["news_management"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["news_overview"]);?></h3>
				<a href="news.php" class="btn btn-primary float-right ml-2"><?php echo($GLOBALS["dict"]["news_list_back"]);?></a>
				<div class="clearfix"></div>
				<hr>

				<form name="newsEditForm" method="POST" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="newsId"><?php echo($GLOBALS["dict"]["news_id"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-list-ol fa-fw"></i></span>
							<input name="newsId" type="text" class="form-control"
								value="<?php if (isset($_GET["newsId"]) === true) echo($_GET["newsId"]);?>" disabled>
						</div>
					</div>
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
						<label class="control-label col-12" for="authorId"><?php echo($GLOBALS["dict"]["news_author"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-user fa-fw"></i></span>
							<select name="authorId" class="form-control">
							<?php
								if (isset($_POST["author"]["userId"]) === false) {
									echo("<option value=\"-1\" selected></option>");
								}
								$selected = false;
								foreach($userList as $user) {
									echo("<option value=\"{$user["userId"]}\"");
									if (isset($_POST["author"]["userId"]) === true && $_POST["author"]["userId"] === $user["userId"]) {
										echo(" selected");
										$selected = true;
									}
									echo(">{$user["displayName"]}</option>");
								}

								if ($selected === false) { // author has higher access level than yourself
									$user = UserModule::loadUser($_POST["author"]["userId"], ACCESS_LEVEL_DEVELOPER);
									echo("<option value=\"{$user["userId"]}\" selected>{$user["displayName"]}</option>");
								}
							?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="postingDate"><?php echo($GLOBALS["dict"]["news_postingDate"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon input-group-datetimepicker"><i class="fas fa-calendar-alt fa-fw"></i></span>
							<input name="postingDate" type="text" pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}" class="form-control" 
								placeholder="<?php echo($GLOBALS["dict"]["news_postingDate_placeholder"]);?>"
								value="<?php if (isset($_POST["postingDate"]) === true) echo($_POST["postingDate"]);?>" required>
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
									if ($_POST["requiredAccessLevel"] === $accessLevel["accessLevel"]) {
										echo(" selected");
										$_POST["requiredAccessIdentifier"] = $GLOBALS["dict"][$accessLevel["accessIdentifier"]];
									}
									echo(">{$GLOBALS["dict"][$accessLevel["accessIdentifier"]]}+</option>");
								}
							?>
							</select>
						</div>
					</div>
					<hr>
					<a href="#" class="btn btn-warning mx-2" data-toggle="modal" data-target="#announceNewsModal"
						data-newsid="<?php echo($_POST["newsId"]);?>" data-title="<?php echo(htmlspecialchars($_POST["title"]));?>" 
						data-requiredaccessidentifier="<?php echo($_POST["requiredAccessIdentifier"]);?>"><?php echo($GLOBALS["dict"]["label_announce"]);?></a>
					<a href="images.php?newsId=<?php echo($_GET["newsId"]);?>" class="btn btn-info"><?php echo($GLOBALS["dict"]["image_manage_linked"]);?></a>
					<hr>
					<p>
						<?php echo($GLOBALS["dict"]["label_update_last"]); 
						if(isset($_POST["modificationDate"]) === true) { 
							echo($_POST["modificationDate"]); 
						} else { 
							echo("-");
						}?>
					</p>
				</form>
			</div>
		</div>
		<div class="modal fade" id="announceNewsModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_notice"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["pn_news_send_modal_safeguard_1_prefix"]);?><strong><?php echo(htmlspecialchars($_POST["title"]));?></strong><?php echo($GLOBALS["dict"]["pn_news_send_modal_safeguard_1_suffix"]);?></p>
						<p><?php echo($GLOBALS["dict"]["pn_send_modal_safeguard_2_prefix"]);?><strong><?php echo(htmlspecialchars($_POST["requiredAccessIdentifier"]));?></strong><?php echo($GLOBALS["dict"]["pn_send_modal_safeguard_2_suffix"]);?></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-warning"><?php echo($GLOBALS["dict"]["label_confirm"]);?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_cancel"]);?></button>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>