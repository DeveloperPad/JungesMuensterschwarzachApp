import { classToPlain, plainToClass } from 'class-transformer';
import { AccountData } from 'models/AccountData';
import { AccountTransfer } from 'models/AccountTransfer';
import { ActionTypes } from 'models/ActionTypes';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';
import { AccountDataPublic } from 'models/AccountDataPublic';

export class AccountTransferController {


    // C

    public static async create(accountTransfer: AccountTransfer): Promise<AccountTransfer> {
        return this.validate(accountTransfer, ActionTypes.CREATE).then(
            _ => this.createDB(accountTransfer)
        );
    }

    private static async createDB(accountTransfer: AccountTransfer): Promise<AccountTransfer> {
        const plainAccountTransfer: any = classToPlain(accountTransfer, cleanOptions);
        await DatabaseController.getPool().execute(
            "INSERT INTO account_transfers ( \
                userId, newEMailAddress, oldEMailAddressConfirmed \
            ) VALUES ( \
                ?, ?, ? \
            )",
            [
                plainAccountTransfer.user.userId,
                plainAccountTransfer.newEMailAddress,
                plainAccountTransfer.oldEMailAddressConfirmed
            ]
        );

        return this.getByUserId(accountTransfer.user.userId);
    }


    // R

    public static async getByUserId(userId: number): Promise<AccountTransfer> {
        return this.validateUserId(userId, ActionTypes.READ).then(
            _ => this.getByUserIdDB(userId)
        );
    }

    private static async getByUserIdDB(userId: number): Promise<AccountTransfer> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM account_transfers at, account_data ad \
             WHERE  at.userId = ? AND \
                    at.userId = ad.userId",
             [userId]
        );

        const accountTransfer = plainToClass(AccountTransfer, rows[0], cleanOptions);
        accountTransfer.user = plainToClass(AccountData, rows[0], cleanOptions);

        return Promise.resolve(accountTransfer);
    }


    // U
    
    public static async update(accountTransfer: AccountTransfer): Promise<AccountTransfer> {
        return this.validate(accountTransfer, ActionTypes.UPDATE).then(
            _ => this.updateDB(accountTransfer)
        );
    }

    private static async updateDB(accountTransfer: AccountTransfer): Promise<AccountTransfer> {
        const plainAccountTransfer: any = classToPlain(accountTransfer, cleanOptions);
        await DatabaseController.getPool().execute(
            "UPDATE account_transfers SET \
                oldEMailAddressConfirmed = ? \
             WHERE userId = ?",
            [
                plainAccountTransfer.oldEMailAddressConfirmed,
                plainAccountTransfer.user.userId
            ]
        );

        return this.getByUserId(accountTransfer.user.userId);
    }
    


    // D

    public static async delete(userId: number): Promise<void> {
        return this.validateUserId(userId, ActionTypes.DELETE).then(
            _ => this.deleteDB(userId)
        );
    }

    public static async deleteDB(userId: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM account_transfers \
             WHERE userId = ?",
             [userId]
        ).then((_: any) =>
            Promise.resolve()
        );
    }


    // Helpers

    private static async validate(accountTransfer: AccountTransfer, action: ActionTypes): Promise<void> {
        return this.validateUserId(accountTransfer.user ? accountTransfer.user.userId : undefined, action)
            .then(_ => this.validateNewEMailAddress(accountTransfer))
        ;
    }

    private static async validateUserId(userId: number, action: ActionTypes): Promise<void> {
        if (userId === undefined) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_client,
                DictionaryKeys.account_id_not_exists
            ));
        }

        return AccountDataController.getById(userId)
            .then(async _ => {
                const [rows, fields] = await DatabaseController.getPool().execute(
                    "SELECT * \
                     FROM account_transfers \
                     WHERE userId = ?",
                     [userId]
                );
                
                if (action === ActionTypes.CREATE && Array.isArray(rows) && rows.length > 0) {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_storage,
                        DictionaryKeys.account_transfer_exists_already
                    ));
                } else if (action !== ActionTypes.CREATE && Array.isArray(rows) && rows.length === 0) {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_storage,
                        DictionaryKeys.account_transfer_not_exists
                    ));
                }
        
                return Promise.resolve();
            });
    }

    private static async validateNewEMailAddress(accountTransfer: AccountTransfer): Promise<void> {
        return AccountDataController.validateEMailAddress(plainToClass(AccountData, {
            eMailAddress: accountTransfer.newEMailAddress,
            userId: accountTransfer.user.userId
        }, cleanOptions))
        .then(async _ => {
            const [rows, fields] = await DatabaseController.getPool().execute(
                "SELECT * \
                 FROM account_transfers \
                 WHERE newEMailAddress = ?",
                 [accountTransfer.newEMailAddress]
            );
            
            if (Array.isArray(rows) && rows.length > 0 && accountTransfer.user.userId !== (rows[0] as AccountDataPublic).userId) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.account_eMailAddress_taken
                ));
            }

            return Promise.resolve();
        });
    }

}