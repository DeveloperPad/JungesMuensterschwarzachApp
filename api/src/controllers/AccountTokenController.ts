import { classToPlain, plainToClass } from 'class-transformer';
import { AccountDataPublic } from 'models/AccountDataPublic';
import { AccountToken } from 'models/AccountToken';
import { AccountTokenTypes } from 'models/AccountTokenTypes';
import { ActionTypes } from 'models/ActionTypes';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import * as moment from 'moment';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { CryptoService } from 'src/services/CryptoService';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class AccountTokenController {


    // C

    public static async create(accountToken: AccountToken): Promise<AccountToken> {
        return this.validate(accountToken, ActionTypes.CREATE).then(
            _ => this.createDB(accountToken)
        );
    }

    private static async createDB(accountToken: AccountToken): Promise<AccountToken> {
        const plainAccountToken: any = classToPlain(accountToken, cleanOptions);
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO account_tokens ( \
                code, tokenType, userId, validUntil \
            ) VALUES ( \
                ?, ?, ?, ? \
            )",
            [
                plainAccountToken.code,
                plainAccountToken.tokenType,
                plainAccountToken.user.userId,
                plainAccountToken.validUntil
            ]
        );

        return this.getByCode(accountToken.code);
    }


    // R

    public static async getByCode(code: string): Promise<AccountToken> {
        return this.validateCode(code, ActionTypes.READ).then(
            _ => this.getByCodeDB(code)
        );
    }

    private static async getByCodeDB(code: string): Promise<AccountToken> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_tokens at, account_data ad \
             WHERE  at.code = ? AND \
                    at.userId = ad.userId",
             [code]
        );

        const accountToken = plainToClass(AccountToken, rows[0], cleanOptions);
        accountToken.user = plainToClass(AccountDataPublic, rows[0], cleanOptions);

        return Promise.resolve(accountToken);
    }

    public static async getByUserId(userId: number): Promise<AccountToken> {
        return this.validateUserId(userId, ActionTypes.READ).then(
            _ => this.getByUserIdDB(userId)
        );
    }

    private static async getByUserIdDB(userId: number): Promise<AccountToken> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_tokens at, account_data ad \
             WHERE  at.userId = ? AND \
                    at.userId = ad.userId",
             [userId]
        );

        const accountToken = plainToClass(AccountToken, rows[0], cleanOptions);
        accountToken.user = plainToClass(AccountDataPublic, rows[0], cleanOptions);

        return Promise.resolve(accountToken);
    }

    public static async getExpiredTokens(): Promise<AccountToken[]> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_tokens at, account_data ad \
             WHERE  DATEDIFF(at.validUntil, NOW()) < 0 AND \
                    at.userId = ad.userId"
        );

        return Promise.resolve((rows as AccountToken[]).map((row: any) => {
            const accountToken = plainToClass(AccountToken, row, cleanOptions);
            accountToken.user = plainToClass(AccountDataPublic, row, cleanOptions);
            return accountToken;
        }));
    }


    // U
    
    // no update needed as one-time tokens


    // D

    public static async delete(code: string): Promise<void> {
        return this.validateCode(code, ActionTypes.DELETE).then(
            _ => this.deleteDB(code)
        );
    }

    public static async deleteDB(code: string): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM account_tokens \
             WHERE code = ?",
             [code]
        ).then((_: any) =>
            Promise.resolve()
        );
    }


    // Helpers

    private static async validate(accountToken: AccountToken, action: ActionTypes): Promise<void> {
        return this.validateCode(accountToken.code, action)
            .then(_ => this.validateTokenType(accountToken.tokenType))
            .then(_ => this.validateUserId(accountToken.user ? accountToken.user.userId : undefined, action))
            .then(_ => this.validateValidUntil(accountToken.validUntil, action))
        ;
    }

    private static async validateCode(code: string, action: ActionTypes): Promise<void> {
        if (!CryptoService.validateUUID(code)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.token_code_malformed
            ));
        }

        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_tokens \
             WHERE code = ?",
             [code]
        );
        
        if (action === ActionTypes.CREATE && Array.isArray(rows) && rows.length > 0) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.token_code_exists_already
            ));
        } else if (action !== ActionTypes.CREATE && Array.isArray(rows) && rows.length === 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.token_code_invalid
            ));
        }

        return Promise.resolve();
    }

    private static async validateTokenType(tokenType: AccountTokenTypes): Promise<void> {
        return tokenType && Object.values(AccountTokenTypes)
                .filter(v => typeof v === "string")
                .includes(tokenType) ?
            Promise.resolve() : 
            Promise.reject(
                new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.token_type_invalid
                )
            );
    }

    private static async validateUserId(userId: number, action: ActionTypes): Promise<void> {
        if (userId === undefined) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.account_transfer_not_exists
            ));
        }

        return AccountDataController.getById(userId)
            .then(async _ => {
                const [rows, fields] = await DatabaseController.getPool().execute(
                    "SELECT * \
                     FROM account_tokens \
                     WHERE userId = ?",
                     [userId]
                );
                
                if (action === ActionTypes.CREATE && Array.isArray(rows) && rows.length > 0) {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_storage,
                        DictionaryKeys.token_user_exists
                    ));
                } else if (action !== ActionTypes.CREATE && Array.isArray(rows) && rows.length === 0) {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_storage,
                        DictionaryKeys.token_user_exists_not
                    ));
                }
        
                return Promise.resolve();
            });
    }

    private static async validateValidUntil(validUntil: moment.Moment, action: ActionTypes): Promise<void> {
        return validUntil && validUntil.isValid() && (action !== ActionTypes.CREATE || validUntil.isSameOrAfter(moment())) ?
            Promise.resolve() :
            Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.token_valid_until_invalid
            ));
    }

}