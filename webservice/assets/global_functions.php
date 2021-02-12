<?php

    require_once(ROOT_LOCAL."/libs/HTMLPurifier/library/HTMLPurifier.auto.php");
    require_once(ROOT_LOCAL."/modules/SessionModule.php");
    require_once(ROOT_LOCAL."/modules/UserModule.php");

    class GlobalFunctions {

        public static function getAccessBadge($accessLevel) {
            if ($accessLevel >= ACCESS_LEVEL_DEVELOPER) {
                return "badge-primary";
            } else if ($accessLevel >= ACCESS_LEVEL_MODERATOR) {
                return "badge-danger";
            } else if ($accessLevel >= ACCESS_LEVEL_EDITOR) {
                return "badge-success";
            } else if ($accessLevel >= ACCESS_LEVEL_USER) {
                return "badge-dark";
            } else { // Guest
                return "badge-secondary";
            }
        }

        // sql datetime string to formatted date string
        public static function formatDate($date) {
            $date = explode(" ", $date)[0];
            $dateParts = explode("-", $date);
            return $dateParts[2] . "." . $dateParts[1] . "." . $dateParts[0];
        }

    }

?>