<?php

	class Alert {
		
		public $type;
		public $message;
		
		function __construct($type, $message) {
			$this->type = $type;
			$this->message = $message;
		}
		
		public static function show($alert) {
			?>
			<div class="alert alert-<?php echo($alert->type);?>">
				<span><strong><?php echo(Alert::getLevel($alert));?></strong> <?php echo($alert->message); ?></span>
			</div>
			<?php
		}
		
		private static function getLevel($alert) {
			switch(strtolower($alert->type)) {
				case "success":
					return $GLOBALS["dict"]["label_success"];
				case "warning":
					return $GLOBALS["dict"]["label_warning"];
				case "danger":
					return $GLOBALS["dict"]["label_failure"];
			}
		}
		
	}

?>