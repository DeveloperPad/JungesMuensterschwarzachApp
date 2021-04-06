<?php
	chdir(__DIR__);
	use PhpImap\Mailbox;

	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/WebsiteEnrollmentModule.php");

	require_once(ROOT_LOCAL."/libs/PhpImap/Exceptions/ConnectionException.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/Exceptions/InvalidParameterException.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/DataPartInfo.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/Imap.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/IncomingMailAttachment.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/IncomingMailHeader.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/IncomingMail.php");
	require_once(ROOT_LOCAL."/libs/PhpImap/Mailbox.php");

	$mailboxPrefix = "{".MAIL_SERVER.":".MAIL_PORT_IMAP."/imap/ssl}";
	$mailbox = new Mailbox(
		$mailboxPrefix . MAIL_FOLDER_DEFAULT,
		MAIL_ACCOUNT_NAME,
		MAIL_PASSWORD
	);
	$mailbox->setAttachmentsIgnore(true);

	try {
		createMailboxes($mailbox);
		
		$mailbox->switchMailbox($mailboxPrefix.MAIL_FOLDER_DEFAULT);
		echo("Opened mailbox " . MAIL_FOLDER_DEFAULT . ".\n\n");

		$enrollmentContents = getNewEventEnrollmentContents($mailbox);

		foreach ($enrollmentContents as $mailId => $enrollmentContent) {
			try {
				$enrollment = WebsiteEnrollmentModule::process($enrollmentContent);
				print_r($enrollment);
				echo("Processed event enrollment of " . $enrollment["firstName"] . ".\n");
				//$mailbox->moveMail($mailId, $mailboxPrefix . MAIL_FOLDER_ENROLLMENTS_PROCESSED);
				echo("Moved mail with ID " . $mailId . " into folder " 
					. MAIL_FOLDER_ENROLLMENTS_PROCESSED . ".\n");
			} catch (Exception $exc) {
				echo("Error: " . $exc->getMessage());
				//$mailbox->moveMail($mailId, $mailboxPrefix . MAIL_FOLDER_ENROLLMENTS_FAILED);
				echo("Moved mail with ID " . $mailId . " into folder "
					. MAIL_FOLDER_ENROLLMENTS_FAILED . ".\n");
			}
			echo("\n");
		}
	} catch (Exception $exc) {
		echo("Error: " . $exc->getMessage());
	}

	function createMailboxes($mailbox) {
		$mailboxes = $mailbox->getMailboxes();
		$mailboxNames = array_map(function($box) { return $box["shortpath"]; }, $mailboxes);

		$processedFolderExists = false;
		$failedFolderExists = false;
		foreach ($mailboxNames as $mailboxName) {
			if (strpos($mailboxName, MAIL_FOLDER_ENROLLMENTS_PROCESSED) !== false) {
				$processedFolderExists = true;
			} else if (strpos($mailboxName, MAIL_FOLDER_ENROLLMENTS_FAILED) !== false) {
				$failedFolderExists = true;
			}
		}

		if (!$processedFolderExists) {
			$mailbox->createMailbox(MAIL_FOLDER_ENROLLMENTS_PROCESSED);
			echo("Created mailbox " . MAIL_FOLDER_ENROLLMENTS_PROCESSED . ".\n");
		} else {
			echo("Mailbox " . MAIL_FOLDER_ENROLLMENTS_PROCESSED . " already exists.\n");
		}

		if (!$failedFolderExists) {
			$mailbox->createMailbox(MAIL_FOLDER_ENROLLMENTS_FAILED);
			echo("Created mailbox " . MAIL_FOLDER_ENROLLMENTS_FAILED . ".\n");
		} else {
			echo("Mailbox " . MAIL_FOLDER_ENROLLMENTS_FAILED . " already exists.\n");
		}
	}

	function getNewEventEnrollmentContents(Mailbox $mailbox) {
		$eventEnrollmentTitle = "Neue Veranstaltungsanmeldung";
		$mailIds = $mailbox->searchMailbox();
		$eventEnrollmentContents = array();

		echo("Processing mails in mailbox " . MAIL_FOLDER_DEFAULT . "...\n");
		foreach ($mailIds as $mailId) {
			$mail = $mailbox->getMail($mailId);

			if (trim($mail->subject) !== $eventEnrollmentTitle) {
				continue;
			}

			$eventEnrollmentContents[$mailId] = 
				$mail->textHtml ?
					strip_tags($mail->textHtml) :
					$mail->textPlain;
		}

		echo("Found " . count($eventEnrollmentContents) . " new event enrollment mail(s) in total!\n\n");
		return $eventEnrollmentContents;
	}

?>