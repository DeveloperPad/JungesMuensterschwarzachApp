export default class Formats {
    public static LENGTH = {
        MAX: {
            CITY: 100,
            COUNTRY: 100,
            DISPLAY_NAME: 30,
            EATING_HABITS: 65535,
            EVENT_ENROLLMENT_COMMENT: 65535,
            FIRST_NAME: 50,
            HOUSE_NUMBER: 10,
            LAST_NAME: 50,
            PHONE_NUMBER: 50,
            STREET_NAME: 50,
            ZIP_CODE: 10
        }
    }

    public static REGEXPS = {
        E_MAIL_ADDRESS: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }

    public static DATE = {
        DATETIME_DATABASE: "YYYY-MM-DD HH:mm:ss",
        DATETIME_LOCAL: {
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            month: "long",
            second: "numeric",
            weekday: "long",
            year: "numeric"
        },
        DATE_DATABASE: "YYYY-MM-DD",
        DATE_LOCAL: {
            day: "numeric",
            month: "long",
            weekday: "long",
            year: "numeric"
        },
        DATE_NATIVE: "YYYY-MM-DD",
        DATE_PICKER: "DD.MM.YYYY",
        LOCALE: "de",
        TIME_LOCAL: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }
    }

    public static ROWS = {
        STANDARD: {
            EATING_HABITS: 3,
            EVENT_ENROLLMENT_COMMENT: 3,
            PAGINATION: 5
        }
    }

}