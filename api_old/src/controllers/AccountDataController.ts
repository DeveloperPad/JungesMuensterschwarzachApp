import { classToPlain, plainToClass } from 'class-transformer';
import { AccessLevels } from 'models/AccessLevels';
import { AccountData } from 'models/AccountData';
import { ActionTypes } from 'models/ActionTypes';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import * as moment from 'moment';
import { AccessLevelController } from 'src/controllers/AccessLevelController';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { EventEnrollmentController } from 'src/controllers/EventEnrollmentController';
import { CryptoService } from 'src/services/CryptoService';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';
import { AccountDataPrivate } from 'models/AccountDataPrivate';

export class AccountDataController {

    private static DISPLAY_NAME_LENGTH_MAX = 30;
    private static FIRST_NAME_LENGTH_MAX = 50;
    private static LAST_NAME_LENGTH_MAX = 50;
    private static E_MAIL_ADDRESS_LENGTH_MAX = 100;
    private static STREET_NAME_LENGTH_MAX = 50;
    private static HOUSE_NUMBER_LENGTH_MAX = 10;
    private static ZIP_CODE_LENGTH_MAX = 10;
    private static CITY_LENGTH_MAX = 100;
    private static COUNTRY_LENGTH_MAX = 100;
    private static PHONE_NUMBER_LENGTH_MAX = 50;
    private static EATING_HABITS_LENGTH_MAX = 65535;


    // C

    public static async create(accountData: AccountData): Promise<AccountData> {
        return this.validate(accountData, ActionTypes.CREATE).then(
            _ => this.createDB(accountData)
        );
    }

    private static async createDB(accountData: AccountData): Promise<AccountData> {
        const plainAccountData: any = classToPlain(accountData, cleanOptions);

        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO account_data ( \
                displayName, firstName, \
                lastName, eMailAddress, \
                streetName, houseNumber, \
                zipCode, city, country, \
                phoneNumber, birthdate, \
                eatingHabits, allowPost, \
                passwordHash, registrationDate \
            ) VALUES ( \
                ?, ?, \
                ?, ?, \
                ?, ?, \
                ?, ?, ?, \
                ?, ?, \
                ?, ?, \
                ?, NOW() \
            )",
            [
                plainAccountData.displayName, plainAccountData.firstName,
                plainAccountData.lastName, plainAccountData.eMailAddress,
                plainAccountData.streetName, plainAccountData.houseNumber,
                plainAccountData.zipCode, plainAccountData.city, plainAccountData.country,
                plainAccountData.phoneNumber, plainAccountData.birthdate,
                plainAccountData.eatingHabits, plainAccountData.allowPost,
                plainAccountData.passwordHash
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.account_creation_failed
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<AccountData[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM account_data \
             ORDER BY accessLevel DESC, displayName"
        );

        return Promise.resolve(
            (rows as AccountDataPrivate[]).map((row: any) => {
                return plainToClass(AccountData, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<AccountData> {
        return this.validateId(id, ActionTypes.READ).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<AccountData> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_data \
             WHERE userId = ?",
            [id]
        );

        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_id_not_exists
            ));
        }

        return Promise.resolve(plainToClass(AccountData, rows[0], cleanOptions));
    }

    public static async getBySessionHash(sessionHash: string): Promise<AccountData> {
        return this.validateSessionHash(sessionHash).then(
            _ => this.getBySessionHashDB(sessionHash)
        );
    }

    private static async getBySessionHashDB(sessionHash: string): Promise<AccountData> {
        if (!sessionHash) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_session_expired
            ));
        }

        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_data \
             WHERE sessionHash = ?",
            [sessionHash]
        );

        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_session_expired
            ));
        }

        return Promise.resolve(plainToClass(AccountData, rows[0], cleanOptions));
    }

    public static async getByEMailAddress(eMailAddress: string): Promise<AccountData> {
        return this.getByEMailAddressDB(eMailAddress);
    }

    private static async getByEMailAddressDB(eMailAddress: string): Promise<AccountData> {
        if (!eMailAddress) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_eMailAddress_not_taken
            ));
        }

        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_data \
             WHERE eMailAddress = ?",
            [eMailAddress]
        );

        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_eMailAddress_not_taken
            ));
        }

        return Promise.resolve(plainToClass(AccountData, rows[0], cleanOptions));
    }

    public static async getAccessLevel(sessionHash: string): Promise<number> {
        return this.getBySessionHash(sessionHash ? sessionHash : null)
            .then((accountData: AccountData) => accountData.accessLevel)
            .catch(_ => AccessLevels.ACCESS_DENIED);
    }

    // U

    public static async update(accountData: AccountData): Promise<AccountData> {
        return this.validate(accountData, ActionTypes.UPDATE).then(
            _ => this.updateDB(accountData)
        );
    }

    private static async updateDB(accountData: AccountData): Promise<AccountData> {
        const plainAccountData: any = classToPlain(accountData, cleanOptions);

        await DatabaseController.getPool().execute(
            "UPDATE account_data \
             SET displayName = ?, \
                 firstName = ?, \
                 lastName = ?, \
                 eMailAddress = ?, \
                 streetName = ?, \
                 houseNumber = ?, \
                 zipCode = ?, \
                 city = ?, \
                 country = ?, \
                 phoneNumber = ?, \
                 birthdate = ?, \
                 eatingHabits = ?, \
                 allowPost = ?, \
                 passwordHash = ?, \
                 sessionHash = ?, \
                 isActivated = ?, \
                 accessLevel = ?, \
                 modificationDate = NOW() \
             WHERE userId = ?",
            [
                plainAccountData.displayName,
                plainAccountData.firstName,
                plainAccountData.lastName,
                plainAccountData.eMailAddress,
                plainAccountData.streetName,
                plainAccountData.houseNumber,
                plainAccountData.zipCode,
                plainAccountData.city,
                plainAccountData.country,
                plainAccountData.phoneNumber,
                plainAccountData.birthdate,
                plainAccountData.eatingHabits,
                plainAccountData.allowPost,
                plainAccountData.passwordHash,
                plainAccountData.sessionHash,
                plainAccountData.isActivated,
                plainAccountData.accessLevel,
                plainAccountData.userId
            ]
        );

        return this.getById(accountData.userId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id, ActionTypes.DELETE).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM account_data \
             WHERE userId = ?",
            [id]
        ).then((_: any) =>
            Promise.resolve()
        );
    }


    // Helpers

    private static async validate(accountData: AccountData, action: ActionTypes): Promise<void> {
        const eventEnrollmentsLength = (await EventEnrollmentController.getAll()).filter(
            eventEnrollment => eventEnrollment.user.userId === accountData.userId
        ).length;

        return this.validateId(accountData.userId, action)
            .then(_ => this.validateDisplayName(accountData))
            .then(_ => this.validateFirstName(accountData.firstName, eventEnrollmentsLength))
            .then(_ => this.validateLastName(accountData.lastName, eventEnrollmentsLength))
            .then(_ => this.validateEMailAddress(accountData))
            .then(_ => this.validateStreetName(accountData.streetName, eventEnrollmentsLength))
            .then(_ => this.validateHouseNumber(accountData.houseNumber, eventEnrollmentsLength))
            .then(_ => this.validateZipCode(accountData.zipCode, eventEnrollmentsLength))
            .then(_ => this.validateCity(accountData.city, eventEnrollmentsLength))
            .then(_ => this.validateCountry(accountData.country, eventEnrollmentsLength))
            .then(_ => this.validatePhoneNumber(accountData.phoneNumber, eventEnrollmentsLength))
            .then(_ => this.validateBirthdate(accountData.birthdate, eventEnrollmentsLength))
            .then(_ => this.validateEatingHabits(accountData.eatingHabits, eventEnrollmentsLength))
            .then(_ => this.validateAllowPost(accountData))
            .then(_ => this.validatePasswordHash(accountData.passwordHash))
            .then(_ => this.validateSessionHash(accountData.sessionHash))
            .then(_ => this.validateAccessLevel(accountData.accessLevel))
            ;
    }

    private static async validateId(id: number, action: ActionTypes): Promise<void> {
        return action === ActionTypes.CREATE || id >= 0 ?
            Promise.resolve() :
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_id_not_exists
            ));
    }

    private static async validateDisplayName(accountData: AccountData): Promise<void> {
        if (!accountData.displayName
            || accountData.displayName.length > AccountDataController.DISPLAY_NAME_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_displayName_invalid
            ));
        }

        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_data \
             WHERE displayName = ?",
            [accountData.displayName]
        );

        if (!Array.isArray(rows)
            || (rows.length > 0 && Number(accountData.userId) !== (rows[0] as AccountDataPrivate).userId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_displayName_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateFirstName(firstName: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !firstName) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_firstName_required
            ));
        } else if (firstName && firstName.length > AccountDataController.FIRST_NAME_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_firstName_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateLastName(lastName: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !lastName) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_lastName_required
            ));
        } else if (lastName && lastName.length > AccountDataController.LAST_NAME_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_lastName_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    public static async validateEMailAddress(accountData: AccountData): Promise<void> {
        if (!accountData.eMailAddress
            || accountData.eMailAddress.length > AccountDataController.E_MAIL_ADDRESS_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_eMailAddress_invalid
            ));
        }

        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_data \
             WHERE eMailAddress = ?",
            [accountData.eMailAddress]
        );

        if (!Array.isArray(rows)
            || (rows.length > 0 && Number(accountData.userId) !== (rows[0] as AccountDataPrivate).userId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_eMailAddress_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateStreetName(streetName: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !streetName) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_streetName_required
            ));
        } else if (streetName && streetName.length > AccountDataController.STREET_NAME_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_streetName_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateHouseNumber(houseNumber: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !houseNumber) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_houseNumber_required
            ));
        } else if (houseNumber && houseNumber.length > AccountDataController.HOUSE_NUMBER_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_houseNumber_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateZipCode(zipCode: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !zipCode) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_zipCode_required
            ));
        } else if (zipCode && zipCode.length > AccountDataController.ZIP_CODE_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_zipCode_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateCity(city: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !city) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_city_required
            ));
        } else if (city && city.length > AccountDataController.CITY_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_city_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateCountry(country: string, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !country) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_country_required
            ));
        } else if (country && country.length > AccountDataController.COUNTRY_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_country_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validatePhoneNumber(phoneNumber: string, eventEnrollmentsLength: number): Promise<void> {
        if (phoneNumber && phoneNumber.length > AccountDataController.PHONE_NUMBER_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_phoneNumber_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateBirthdate(birthdate: moment.Moment, eventEnrollmentsLength: number): Promise<void> {
        if (eventEnrollmentsLength > 0 && !birthdate) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_birthdate_required
            ));
        } else if (birthdate && !birthdate.isValid()) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_birthdate_malformed
            ));
        } else if (birthdate && birthdate.isAfter(moment())) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_birthdate_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateEatingHabits(eatingHabits: string, eventEnrollmentsLength: number): Promise<void> {
        if (eatingHabits && eatingHabits.length > AccountDataController.EATING_HABITS_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_eatingHabits_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateAllowPost(accountData: AccountData): Promise<void> {
        return accountData.allowPost && (
            !accountData.firstName ||
            !accountData.lastName ||
            !accountData.streetName ||
            !accountData.houseNumber ||
            !accountData.zipCode ||
            !accountData.city ||
            !accountData.country
        ) ?
            Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_allowPost_missing_address
            )) :
            Promise.resolve();
    }

    private static async validatePasswordHash(passwordHash: string): Promise<void> {
        return CryptoService.validatePasswordHash(passwordHash) ?
            Promise.resolve() :
            Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_password_invalid
            ));
    }

    private static async validateSessionHash(sessionHash: string): Promise<void> {
        return !sessionHash || CryptoService.validateUUID(sessionHash) ?
            Promise.resolve() :
            Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_session_expired
            ));
    }

    private static async validateAccessLevel(accessLevel: number): Promise<void> {
        return accessLevel ?
            AccessLevelController.validateAccessLevel(accessLevel) :
            Promise.resolve();
    }

}