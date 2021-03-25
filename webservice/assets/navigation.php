<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
	<div class="container">
		
		<ul class="navbar-nav">
			<a class="navbar-brand" href="<?php echo(ROOT_PUBLIC);?>/index.php">
				<img src="<?php echo(ROOT_PUBLIC);?>/assets/icons/jma.png"/><span><?php echo($GLOBALS["dict"]["general_app_name"]);?></span>
			</a>
			
			<li class="nav-item dropdown mx-1">
        		<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
					<?php echo($GLOBALS["dict"]["navigation_web_ucp"]);?><span class="caret"></span>
				</a>
        		<div class="dropdown-menu jma-navigation-dropdown-menu">
					<a href="<?php echo(ROOT_PUBLIC);?>/ucp/users_redeem_token.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse fas fa-unlock fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_redeem_token"]);?></span>
					</a>
					<a href="<?php echo(ROOT_PUBLIC);?>/ucp/users_request_activation_mail.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse far fa-envelope fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_request_activation_link"]);?></span>
					</a>
					<a href="<?php echo(ROOT_PUBLIC);?>/ucp/users_request_password_reset.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse fas fa-key fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_request_password_reset"]);?></span>
					</a>
					<a href="<?php echo(ROOT_PUBLIC);?>/ucp/users_request_account_transfer_mail.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse fas fa-at fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_request_account_transfer_mail"]);?></span>
					</a>
				</div>
			</li>

			<?php 
			if (isset($_COOKIE[CookieModule::getFullName("accessLevel")]) === true && intval($_COOKIE[CookieModule::getFullName("accessLevel")]) > ACCESS_LEVEL_USER) {
			?>
			<li class="nav-item dropdown mx-1">
        		<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
					<?php echo($GLOBALS["dict"]["navigation_web_acp"]);?><span class="caret"></span>
				</a>
				<div class="dropdown-menu jma-navigation-dropdown-menu">
			<?php
				if (intval($_COOKIE[CookieModule::getFullName("accessLevel")]) >= PERMISSION_USER) {
					?>
					<a href="<?php echo(ROOT_PUBLIC);?>/acp/users.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse fas fa-users fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_web_users"]);?></span>
					</a>
			<?php
				}
				if (intval($_COOKIE[CookieModule::getFullName("accessLevel")]) >= PERMISSION_IMAGES) {
			?>
					<a href="<?php echo(ROOT_PUBLIC);?>/acp/news.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse far fa-newspaper fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_web_news"]);?></span>
					</a>
			<?php
				}
				if (intval($_COOKIE[CookieModule::getFullName("accessLevel")]) >= PERMISSION_NEWSLETTER) {
			?>
					<a href="<?php echo(ROOT_PUBLIC);?>/acp/newsletter_registrations.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse far fa-envelope fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_newsletters"]);?></span>
					</a>
			<?php
				}
				if (intval($_COOKIE[CookieModule::getFullName("accessLevel")]) >= PERMISSION_EVENTS) {
			?>
					<a href="<?php echo(ROOT_PUBLIC);?>/acp/events.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse far fa-calendar-alt fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_web_events"]);?></span>
					</a>
			<?php
				}
				if (intval($_COOKIE[CookieModule::getFullName("accessLevel")]) >= PERMISSION_PN) {
			?>
					<a href="<?php echo(ROOT_PUBLIC);?>/acp/pn.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse fas fa-mobile fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_web_pn"]);?></span>
					</a>
			<?php
				}
				if (intval($_COOKIE[CookieModule::getFullName("accessLevel")]) >= PERMISSION_USER) {
			?>
					<a href="<?php echo(ROOT_PUBLIC);?>/acp/tokens.php" class="jma-navigation-dropdown-item">
						<i class="fa-inverse fas fa-lock fa-fw"></i>
						<span><?php echo($GLOBALS["dict"]["navigation_web_token_list"]);?></span>
					</a>
			<?php
				}
			?>
				</div>
			</li>
			<?php 
			}
			?>
		</ul>
		
		<ul class="navbar-nav">
			<?php
				if (isset($_COOKIE[CookieModule::getFullName("userId")]) === true) {
					?>
					<li class="navbar-text mr-3">
						<span class="badge badge-pill <?php echo(GlobalFunctions::getAccessBadge($_COOKIE[CookieModule::getFullName("accessLevel")]));?>"><?php echo($GLOBALS["dict"][$_COOKIE[CookieModule::getFullName("accessIdentifier")]]);?></span> 
						<span><?php echo($_COOKIE[CookieModule::getFullName("displayName")]);?></span>
					</li>
					<li class="nav-item">
						<a id="logout" class="nav-link logout" href="<?php echo(ROOT_PUBLIC);?>/logout.php">
							<i class="fas fa-sign-out-alt fa-fw"></i> <?php echo($GLOBALS["dict"]["account_sign_out"]);?>
						</a>
					</li>
					<?php
				} else {
					?>
					<li class="nav-item">
						<a class="nav-link" href="<?php echo(ROOT_PUBLIC);?>/login.php">
							<i class="fas fa-sign-in-alt fa-fw"></i> <?php echo($GLOBALS["dict"]["account_sign_in_admin"]);?>
						</a>
					</li>
					<?php
				}
			?>
		</ul>
	</div>
</nav>