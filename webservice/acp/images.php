<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/ImageModule.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();

	if ($ownAccessLevel < PERMISSION_IMAGES) {
		header("Location: ../index.php");
		exit;
	}

	if (isset($_GET["newsId"]) === true) {
		$category = "NEWS";
		$categoryId = $_GET["newsId"];
	} else if (isset($_GET["eventId"]) === true) {
		$category = "EVENT";
		$categoryId = $_GET["eventId"];
	} else {
		$category = null;
		$categoryId = null;
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"]["image_category_article_not_found"]));
	}

	if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["imageFile"]) === true 
			&& isset($category) === true && isset($categoryId) === true) {
		uploadImage($category, $categoryId, $_FILES["imageFile"]);
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

				if (isset($category) === true && isset($categoryId) === true) {
					initializeImageManagement($category, $categoryId, $ownAccessLevel);
				}
			?>
		</div>
		<div class="modal fade" id="deleteImageModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_warning"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["image_delete_safeguard"]);?></p>
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
<?php

	function uploadImage($category, $categoryId, $imageFile) {
		try {
			ImageModule::uploadImage($imageFile, $category, $categoryId);
			unset($_POST);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["image_uploaded"]));
			header("Location: images.php?".$_SERVER["QUERY_STRING"]);
			exit;
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function initializeImageManagement($category, $categoryId, $ownAccessLevel) {
		try {
			$title = getTitle($category, $categoryId, $ownAccessLevel);
			$backRef = getBackRef($category);
		} catch (Exception $exc) {
			Alert::show(new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
			return;
		}
?>
		<div class="jumbotron jma-background-color">
			<h1><?php echo($GLOBALS["dict"]["image_management"]);?></h1>
			<hr>
			<h3 class="float-left"><?php echo($title);?></h3>
			<a href="<?php echo($backRef);?>" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["label_back"]);?></a>
			<div class="clearfix"></div>
			<hr>
			<h4 class="font-underline my-4"><?php echo($GLOBALS["dict"]["image_available"]);?></h4>
<?php
			showImageCarousel($category, $categoryId);
?>
			<h4 class="font-underline my-4"><?php echo($GLOBALS["dict"]["image_add"]);?></h4>
<?php
			showUploadForm();
?>
		</div>
<?php
	}

	//UPDATE: needs adjustment when new categories are implemented
	function getTitle($category, $categoryId, $ownAccessLevel) {
		if ($category === "NEWS") {
			$newsTitle = NewsModule::loadNewsArticle($categoryId, $ownAccessLevel)["title"];
			return $GLOBALS["dict"]["news_title_prefix"] . $newsTitle;
		} else if ($category === "EVENT") {
			$eventTitle = EventModule::loadEvent($categoryId, $ownAccessLevel)["eventTitle"];
			return $GLOBALS["dict"]["event_eventTitle_prefix"] . $eventTitle;
		} else {
			throw new Exception("image_category_article_not_found");
		}
	}

	function getBackRef($category) {
		$backRef = strtolower($category);
		if (substr($backRef, -1) != "s") {
			$backRef .= "s";
		}
		$backRef .= ".php";
		return $backRef;
	}

	function showImageCarousel($category, $categoryId) {
			try {
				$images = ImageModule::loadCategoryIdImages($category, $categoryId);
			} catch (Exception $exc) {
				Alert::show(new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
			}

			if (isset($exc) === true) {
				return;
			}

			if (count($images) > 0) {
?>
			<div id="imageCarousel" class="carousel slide" data-interval="false">
				<ol class="carousel-indicators">
					<?php for ($i = 0; $i < count($images); $i++) { ?>
						<li data-target="#imageCarousel" data-slide-to="<?php echo($i);?>" <?php if ($i === 0) echo("class=\"active\"");?>></li>
					<?php } ?>
				</ol>
				<div class="carousel-inner" role="listbox">
					<?php for ($i = 0; $i < count($images); $i++) { ?>
						<div class="carousel-item<?php if ($i === 0) echo(" active");?>">
							<img class="d-block img-fluid mx-auto" src="<?php echo($images[$i]["path"]);?>">
							<div class="carousel-caption">
								<button type="button" data-toggle="modal" data-target="#deleteImageModal" 
									data-imageid="<?php echo($images[$i]["imageId"]);?>" class="btn btn-danger">
									<?php echo($GLOBALS["dict"]["label_delete"]);?>
								</button>
							</div>
						</div>
					<?php } ?>
				</div>
				<a class="carousel-control-prev" href="#imageCarousel" role="button" data-slide="prev">
					<i class="fas fa-chevron-left"></i>
				</a>
				<a class="carousel-control-next" href="#imageCarousel" role="button" data-slide="next">
					<i class="fas fa-chevron-right"></i>
				</a>
			</div>
<?php
			} else {
				Alert::show(new Alert("danger", $GLOBALS["dict"]["image_categoryId_empty"]));
			}
	}


	function showUploadForm() {
?>
		<form name="imageUploadForm" method="POST" class="form-horizontal" enctype="multipart/form-data">
			<div class="form-group">
				<label class="control-label col-12" for="imageFile"><?php echo($GLOBALS["dict"]["image_choose_file"]);?></label>
				<div class="col-12 input-group">
					<span class="input-group-addon"><i class="far fa-file-image fa-fw"></i></span>
					<input name="imageFile" type="file" class="form-control" required>
				</div>
			</div>
			<div class="form-group mt-4">
				<div class="col-12 input-group">
					<span class="input-group-addon"><i class="fas fa-save fa-fw"></i></span>
					<button type="submit" class="btn btn-success"><?php echo($GLOBALS["dict"]["label_submit"]);?></button>
				</div>
			</div>
		</form>
<?php
	}
?>