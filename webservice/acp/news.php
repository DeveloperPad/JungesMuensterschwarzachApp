<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();

	if (!PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_IMAGES]
			&& !PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_NEWS]) {
		header("Location: ../index.php");
		exit;
	}

	function printNewsTable($newsList, $ownAccessLevel)  {
		?>
		<div class="list-group">
		<?php
			printHeader();
			foreach ($newsList as $news) {
				printRow($news, $ownAccessLevel);
			}
			?>
		</div>
		<?php
	}

	function printHeader() {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center">
				<div class="col-1">
					<strong><?php echo($GLOBALS["dict"]["news_id"]);?></strong>
				</div>
				<div class="col-3">
					<strong><?php echo($GLOBALS["dict"]["news_title"]);?></strong>
				</div>
				<div class="col-2">
					<strong><?php echo($GLOBALS["dict"]["news_author"]);?></strong>
				</div>
				<div class="col-2">
					<strong><?php echo($GLOBALS["dict"]["news_postingDate"]);?></strong>
				</div>
				<div class="col-2">
					<strong><?php echo($GLOBALS["dict"]["news_requiredAccessLevel"]);?></strong>
				</div>
				<div class="col-2">
					<strong><?php echo($GLOBALS["dict"]["label_manage"]);?></strong>
				</div>
			</div>
		</div>
		<?php
	}

	function printRow($news, $ownAccessLevel) {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center align-items-center">
				<div class="col-1">
					<?php echo($news["newsId"]);?>
				</div>
				<div class="col-3">
					<?php echo($news["title"]);?>
				</div>
				<div class="col-2">
					<?php if (isset($news["author"]["displayName"]) === true) { echo($news["author"]["displayName"]); } ?>
				</div>
				<div class="col-2">
					<?php echo($news["postingDate"]);?>
				</div>
				<div class="col-2">
					<span class="badge badge-pill <?php echo(GlobalFunctions::getAccessBadge($news["requiredAccessLevel"]));?>"><?php echo($GLOBALS["dict"][$news["accessIdentifier"]]);?>+</span>
				</div>
				<div class="col-2">
					<?php 
					if (PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_IMAGES]) {
					?>
						<a href="images.php?newsId=<?php echo($news["newsId"]);?>"><i class="far fa-images fa-fw text-info mx-1"></i></a>
					<?php
					}
					if (PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_NEWS]) {
					?>
					<a href="news_edit.php?newsId=<?php echo($news["newsId"]);?>"><i class="far fa-edit fa-fw text-dark mx-1"></i></a>
					<a href="#"><i class="far fa-trash-alt fa-fw text-danger mx-1" data-toggle="modal" data-target="#deleteNewsModal" 
						data-newsid="<?php echo($news["newsId"]);?>" data-title="<?php echo(htmlspecialchars($news["title"]));?>"></i></a>
					<?php
					}
					?>
				</div>
			</div>
		</div>
		<?php
	}

	try {
		$newsList = NewsModule::loadNewsList(null, $ownAccessLevel);
	} catch(Exception $exc) {
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		$newsList = array();
	}

	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
		<script src="<?php echo(ROOT_PUBLIC);?>/js/modal.js"></script>
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
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["news_list"]);?></h3>
				<a href="news_create.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["news_add"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<?php printNewsTable($newsList, $ownAccessLevel); ?>
			</div>
		</div>
		<div class="modal fade" id="deleteNewsModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_warning"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["news_delete_modal_safeguard_1_prefix"]);?><strong></strong><?php echo($GLOBALS["dict"]["news_delete_modal_safeguard_1_suffix"]);?></p>
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