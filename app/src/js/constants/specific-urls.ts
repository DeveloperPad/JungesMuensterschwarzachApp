export enum AppUrls {
    // will be prepended with the current address
    CHANGELOG = "/changelog",
    CONTACT = "/contact",
    EVENTS_LIST = "/events",
    EVENTS_ITEM = "/events/:id",
    HELP = "/help",
    HELP_NEWSLETTER_SUBSCRIBE = "/help/newsletter/subscribe",
    HELP_NEWSLETTER_REDEEM = "/help/newsletter/redeem",
    HELP_REDEEM_TOKEN = "/help/redeem_token",
    HELP_REDEEM_TOKEN_RESET_PASSWORD = "/help/redeem_token/reset_password",
    HELP_REQUEST_ACCOUNT_TRANSFER_MAIL = "/help/request_account_transfer_mail",
    HELP_REQUEST_ACTIVATION_MAIL = "/help/request_activation_mail",
    HELP_RESET_PASSWORD = "/help/reset_password",
    HOME = "/",
    INSTALLATION = "/installation",
    INSTALLATION_DETAILS = "/installation/*",
    LEGAL_INFORMATION = "/legal_information",
    LOGIN = "/login",
    LOGOUT = "/logout",
    NEWS_LIST = "/news",
    NEWS_ITEM = "/news/:id",
    PROFILE = "/profile",
    PROFILE_CHANGE_PASSWORD = "/profile/change_password",
    REGISTER = "/register"
}

export enum WebserviceUrls {
    // will be prepended with ${BaseUrls.base_url_webservice}
    ACCOUNT_DATA = "/account_data.php",
    ACCOUNT_PUSH_SUBSCRIPTIONS = "/account_push_subscriptions.php",
    ACCOUNT_SESSIONS = "/account_sessions.php",
    EVENTS = "/events.php",
    IMAGES = "/images.php",
    NEWS = "/news.php",
    NEWSLETTER = "/newsletter.php"
}