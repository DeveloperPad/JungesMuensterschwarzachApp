<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	class ImageModule {

		
		/* ~ Creation ~ */

		public static function uploadImage($sourceFile, $category, $categoryId) {
			if ($sourceFile === null) {
				throw new Exception("image_content_invalid");
			}

			$id = self::createDatabaseImagePlaceholder();
			$fileExtension = ImageModule::getExtension($sourceFile["name"]);
			$destinationFile = ImageModule::getImageFilePath($id, $fileExtension);

			try {
				ImageModule::validateImageRequirements($sourceFile);
				ImageModule::validateDestinationFileAvailability($destinationFile);
				
				ImageModule::optimizeImage($sourceFile);
				
				ImageModule::moveImage($sourceFile, $destinationFile);
				self::updatePath($id, $destinationFile);
				self::linkToCategory($id, $category, $categoryId);
			} catch (Exception $exc) {
				try {
					self::deleteImage($id);
				} catch (Exception $ignored) {
				}
				throw $exc;
			}

			return $id;
		}

		private static function createDatabaseImagePlaceholder() {
			$con = DatabaseModule::getInstance();
			$con->query("INSERT INTO image_library (path) VALUES (NULL)");
			return $con->insert_id;
		}

		private static function updatePath($id, $path) {
			if (self::isIdTaken($id) === false) {
				throw new Exception("image_not_found");
			}
			ImageModule::validateId($id);
			ImageModule::validatePath($path);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE image_library SET path=? WHERE imageId=?"
			);
			$stmt->bind_param("si", $path, $id);
			$stmt->execute();
			$stmt->close();
		}

		private static function isIdTaken($id) {
			ImageModule::validateId($id);

			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT 1 FROM image_library WHERE imageId=?"
			);
            $stmt->bind_param("i", $id);
            $stmt->execute();
			$stmt->store_result();
			$isTaken = $stmt->num_rows > 0;
			$stmt->close();

			return $isTaken;
		}

		private static function linkToCategory($imageId, $category, $categoryId) {
			$con = DatabaseModule::getInstance();
			$category = mysqli_real_escape_string($con, strtolower($category));
			$stmt = $con->prepare(
				"INSERT INTO ${category}_images VALUES(?, ?)"
			);
			$stmt->bind_param("ii", $categoryId, $imageId);
			
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("image_category_article_not_found");
			}
			$stmt->close();
		}


		/* ~ Load ~ */

		public static function downloadImage($imageId) {
			$tmpImage = self::getImage($imageId);

			$image = new stdClass();
			$image->imageId = $imageId;
			$image->extension = self::getExtension($tmpImage["path"]);
			$image->content = base64_encode(file_get_contents($tmpImage["path"]));
			return $image;
		}

		private static function getImage($imageId) {
			if ($imageId === null) {
				throw new Exception("image_not_found");
			}

			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT imageId, path 
				 FROM image_library 
				 WHERE imageId=?"
			);
			$stmt->bind_param("i", $imageId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			
			$image = $stmt->get_result()->fetch_assoc();
			$stmt->close();

			if ($image === null) {
				throw new Exception("image_not_found");
			} else if ($image["path"] === null || file_exists($image["path"]) === false) {
				throw new Exception("image_not_loaded");
			}

			return $image;
		}

		public static function loadCategoryIdImages($category, $categoryId) {
			$imageIds = self::getCategoryIdImageIds($category, $categoryId);
			$images = array();

			foreach ($imageIds as $imageId) {
				array_push($images, self::getImage($imageId));
			}

			return $images;
		}

		private static function getCategoryIdImageIds($category, $categoryId) {
			$con = DatabaseModule::getInstance();
			$category = mysqli_real_escape_string($con, strtolower($category));
			$categoryTable = preg_match("/s$/", $category) === 1 ? $category : $category."s";
			$stmt = $con->prepare(
				"SELECT il.imageId 
				 FROM image_library il, {$category}_images ci, {$categoryTable} c 
				 WHERE c.{$category}Id=? AND c.{$category}Id=ci.{$category}Id AND il.imageId=ci.imageId 
				 ORDER BY il.imageId ASC"
			);

			$stmt->bind_param("i", $categoryId);
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}

			$imageIds = array();
			$res = $stmt->get_result();
			while ($image = $res->fetch_assoc()) {
				array_push($imageIds, $image["imageId"]);
			}
			$stmt->close();

			return $imageIds;
		}
		
		
		/* ~ Deletion ~ */

		public static function deleteImage($imageId) {
			unlink(self::getImage($imageId)["path"]);

			$stmt = DatabaseModule::getInstance()->prepare(
				"DELETE FROM image_library WHERE imageId=?"
			);
			$stmt->bind_param("i", $imageId);

			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("error_message_try_later");
			}
		}


		/* ~ Help functions ~ */

		private static function getExtension($fileName) {
			$fileNameParts = explode(".", $fileName);
			return strtolower($fileNameParts[count($fileNameParts)-1]);
		}

		private static function getImageFilePath($id, $fileExtension) {
			return IMAGE_DIRECTORY_PATH . "/" . date("Y_m") 
				. "/" . $id . "." . $fileExtension;
		}
		
		private static function validateImageRequirements($sourceFile) {
			ImageModule::validateImageSize($sourceFile); 
			ImageModule::validateImageExtension($sourceFile);
		}

		private static function validateImageSize($sourceFile) {
			if (array_key_exists("tmp_name", $sourceFile) === true && getimagesize($sourceFile["tmp_name"]) === false) {
				throw new Exception("image_content_invalid");
			}

			if (array_key_exists("size", $sourceFile) === true && 
					($sourceFile["size"] < 0 || $sourceFile["size"] > MAX_FILE_SIZE)) {
				throw new Exception("image_size_invalid");
			}
		}

		private static function validateImageExtension($sourceFile) {
			$fileExtension = ImageModule::getExtension($sourceFile["name"]);

			if (in_array($fileExtension, ALLOWED_IMAGE_EXTENSIONS) === false) {
				throw new Exception("image_extension_invalid");
			}
		}

		private static function validateDestinationFileAvailability($destinationFile) {
			if (file_exists($destinationFile) === true) {
				throw new Exception("image_exists");
			}
		}

		private static function optimizeImage($sourceFile) {
			list($width, $height) = getimagesize($sourceFile["tmp_name"]);
			
			if ($width > MAX_DIMENSION_SIZE || $height > MAX_DIMENSION_SIZE) {
				ImageModule::resizeImage($sourceFile, $width, $height);
			}

			// file size could further be optimized here
		}

		private static function resizeImage($sourceFile, $inputWidth, $inputHeight) {
			$ratio = min(MAX_DIMENSION_SIZE / $inputWidth, MAX_DIMENSION_SIZE / $inputHeight);
			$type = (ImageModule::getExtension($sourceFile["name"]) === "jpg" ? "jpeg" : $type);
			$outputWidth = $inputWidth * $ratio;
			$outputHeight = $inputHeight * $ratio;
			
			$outputImageResource = imagecreatetruecolor($outputWidth, $outputHeight);
			$inputImageResource = @call_user_func("imagecreatefrom{$type}", $sourceFile["tmp_name"]);

			imagecopyresampled($outputImageResource, $inputImageResource,
								0, 0, 0, 0,
								$outputWidth, $outputHeight,
								$inputWidth, $inputHeight);

			@call_user_func("image{$type}", $outputImageResource, $sourceFile["tmp_name"]);
		}

		private static function moveImage($sourceFile, $destinationFile) {
			if (file_exists(dirname($destinationFile)) === false && mkdir(dirname($destinationFile), 0777, true) === false) {
				throw new Exception("image_folder_creation_failed");
			}

			if (move_uploaded_file($sourceFile["tmp_name"], $destinationFile) === false) {
				throw new Exception("image_moving_failed");
			}

			chmod($destinationFile, 0755);
		}

		private static function validateId($id) {
			if ($id === null || filter_var($id, FILTER_VALIDATE_INT) === false || $id < 0) {
                throw new Exception("image_not_found");
            }
		}

		private static function validatePath($path) {
			if ($path === null || file_exists($path) === false) {
				throw new Exception("image_not_loaded");
			}
		}
		
	}
?>