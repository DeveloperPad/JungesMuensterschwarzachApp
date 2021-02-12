<?php
	
	class Response {
		
		function __construct() {
			$this->successMsg = null;
			$this->errorMsg = null;
			$this->user = null;
			$this->news = null;
			$this->eventList = null;
			$this->eventEnrollment = null;
			$this->image = null;
		}

		public function setSuccessMsg($successMsg) {
			$this->successMsg = $successMsg;
		}
		
		public function setErrorMsg($errorMsg) {
			$this->errorMsg = $errorMsg;
		}
		
		public function setUser($user) {
			$this->user = $user;
		}

		public function setNews($news) {
			$this->news = $news;
		}

		public function setEventList($eventList) {
			$this->eventList = $eventList;
		}

		public function setEventEnrollment($eventEnrollment) {
			$this->eventEnrollment = $eventEnrollment;
		}

		public function setImage($image) {
			$this->image = $image;
		}

	}
	
?>