<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	class NewsModule {

		public static function createNews($ownAccessLevel, $title, $summary, $content, $requiredAccessLevel) {
			self::validateTitle($title);
			self::validateSummary($summary);
			self::validateContent($content);
			self::validateRequiredAccessLevel($ownAccessLevel, $requiredAccessLevel);

			$stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO news(title, summary, content, authorId, requiredAccessLevel) VALUES(?, ?, ?, ?, ?)"
			);
			$stmt->bind_param("sssii", $title, $summary, $content, $_COOKIE[CookieModule::getFullName("userId")], $requiredAccessLevel);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function loadNewsList($limit, $accessLevel) {
			if ($accessLevel === null) {
				throw new Exception("error_message_NEP");
			}

			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT newsId 
				 FROM news 
				 WHERE requiredAccessLevel<=? 
				 ORDER BY postingDate DESC"
				 . (filter_var($limit, FILTER_VALIDATE_INT) !== false && $limit > 0 ? " LIMIT $limit" : "")
			);
			$stmt->bind_param("i", $accessLevel);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}

			$res = $stmt->get_result();
			$newsList = array();
			while ($row = $res->fetch_assoc()) {
				array_push($newsList, self::loadNewsArticle($row["newsId"], $accessLevel));
			}
			$stmt->close();

			return $newsList;
		}

		public static function loadNewsArticle($newsId, $accessLevel) {
			$news = self::loadNewsRow($newsId, $accessLevel);
			$news = self::appendAuthor($news);
			$news = self::appendImageIds($news);
			return $news;
		}
		
		private static function loadNewsRow($newsId, $accessLevel) {
			if ($accessLevel === null) {
				throw new Exception("error_message_NEP");
			}

			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT n.newsId, n.title, n.summary, n.content, n.authorId, n.postingDate, n.requiredAccessLevel, n.modificationDate, al.accessIdentifier  
				 FROM news n, access_levels al 
				 WHERE n.newsId=? AND n.requiredAccessLevel<=? AND n.requiredAccessLevel=al.accessLevel"
			);
			$stmt->bind_param("is", $newsId, $accessLevel);
			
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}

			$news = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			if ($news === null) {
				throw new Exception("error_message_NEP");
			}
			
			return $news;
		}
		
		private static function appendAuthor($news) {
			$authorId = $news["authorId"];
			unset($news["authorId"]);
			
			if ($authorId === null) {
				return $news;
			}
			
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT userId, firstName, lastName, displayName, accessLevel 
				 FROM account_data WHERE userId=?"
			);
			$stmt->bind_param("i", $authorId);
			
			if ($stmt->execute() === false) {
				$stmt->close();
				return $news;
			}

			$news["author"] = $stmt->get_result()->fetch_assoc();
			
			$stmt->close();
			return $news;
		}
		
		private static function appendImageIds($news) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT n.imageId, i.path FROM news_images n, image_library i 
				WHERE n.newsId=? AND n.imageId=i.imageId ORDER BY imageId ASC"
			);
			$stmt->bind_param("i", $news["newsId"]);
			
			$news["imageIds"] = array();
			
			if ($stmt->execute() === false) {
				$stmt->close();
				return $news;
			}
			
			$res = $stmt->get_result();
			while ($image = $res->fetch_assoc()) {
				array_push($news["imageIds"], $image);
			}
			
			$stmt->close();
			return $news;
		}

		public static function updateTitle($newsId, $title, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);
			self::validateTitle($title);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE news SET title=? WHERE newsId=?"
			);
			$stmt->bind_param("si", $title, $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function updateSummary($newsId, $summary, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);
			self::validateSummary($summary);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE news SET summary=? WHERE newsId=?"
			);
			$stmt->bind_param("si", $summary, $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function updateContent($newsId, $content, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);
			self::validateContent($content);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE news SET content=? WHERE newsId=?"
			);
			$stmt->bind_param("si", $content, $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function updateAuthorId($newsId, $authorId, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);
			self::validateAuthorId($authorId, $ownAccessLevel);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE news SET authorId=? WHERE newsId=?"
			);
			$stmt->bind_param("ii", $authorId, $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function updatePostingDate($newsId, $postingDate, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);
			$postingDate = DateTime::createFromFormat(DATE_FORMAT_DB_FULL, $postingDate, new DateTimeZone(SERVER_TIMEZONE));

			self::validatePostingDate($postingDate);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE news SET postingDate=? WHERE newsId=?"
			);
			$stmt->bind_param("si", $postingDate->format(DATE_FORMAT_DB_FULL), $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function updateRequiredAccessLevel($newsId, $requiredAccessLevel, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);
			self::validateRequiredAccessLevel($ownAccessLevel, $requiredAccessLevel);

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE news SET requiredAccessLevel=? WHERE newsId=?"
			);
			$stmt->bind_param("ii", $requiredAccessLevel, $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		public static function deleteNews($newsId, $ownAccessLevel) {
			self::validateAccess($newsId, $ownAccessLevel);

			$stmt = DatabaseModule::getInstance()->prepare(
				"DELETE FROM news WHERE newsId=?"
			);
			$stmt->bind_param("i", $newsId);
			
			if ($stmt->execute() === false) {
				throw new Exception("error_message_try_later");
			}
			$stmt->close();
		}

		/* Validation */

		private static function validateAccess($newsId, $ownAccessLevel) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT requiredAccessLevel FROM news WHERE newsId=?"
			);
			$stmt->bind_param("i", $newsId);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}

			$requiredAccessLevel = $stmt->get_result()->fetch_assoc()["requiredAccessLevel"];
			$stmt->close();

			if ($requiredAccessLevel > $ownAccessLevel) {
				throw new Exception("error_message_NEP");
			}
		}

		private static function validateTitle($title) {
			if (empty($title) === true || strlen($title) > NEWS_TITLE_LENGTH_MAX) {
				throw new Exception("news_title_invalid");
			}
		}

		private static function validateSummary($summary) {
			if (empty($summary) === true || strlen($summary) > NEWS_SUMMARY_LENGTH_MAX) {
				throw new Exception("news_summary_invalid");
			}
		}

		private static function validateContent($content) {
			if (empty($content) === true || strlen($content) > NEWS_CONTENT_LENGTH_MAX) {
				throw new Exception("news_content_invalid");
			}
		}

		private static function validateAuthorId($authorId, $ownAccessLevel) {
			UserModule::loadUser($authorId, $ownAccessLevel);
		}

		private static function validatePostingDate($postingDate) {
			if ($postingDate === false) {
				throw new Exception("news_postingDate_malformed");
			}
			if ($postingDate > new DateTime()) {
				throw new Exception("news_postingDate_invalid");
			}
		}

		private static function validateRequiredAccessLevel($ownAccessLevel, $requiredAccessLevel) {
			$accessLevels = UserModule::loadAccessLevels($ownAccessLevel);

			$exists = false;
			foreach ($accessLevels as $accessLevel) {
				if ($accessLevel["accessLevel"] == $requiredAccessLevel) {
					$exists = true;
				}
			}
			if ($exists === false) {
				throw new Exception("news_requiredAccessLevel_not_exist");
			}
		}
		
	}
?>