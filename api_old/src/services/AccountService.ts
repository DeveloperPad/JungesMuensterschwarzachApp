import { AccountData } from 'models/AccountData';
import { AccountTransfer } from 'models/AccountTransfer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { Success } from 'models/Success';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { AccountTransferController } from 'src/controllers/AccountTransferController';
import { CryptoService } from 'src/services/CryptoService';
import { MailService } from 'src/services/MailService';

export class AccountService {

    
    // C

    public static async create(accountData: AccountData): Promise<AccountData> {
        if (!CryptoService.validatePassword(accountData.passwordHash)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_account,
                DictionaryKeys.account_password_invalid
            ));
        }

        accountData.passwordHash = CryptoService.passwordHash(accountData.passwordHash);

        return AccountDataController.create(accountData)
            .then(createdAccountData =>
                MailService.sendAccountActivationMail(createdAccountData.eMailAddress)
                    .then(_ => createdAccountData)
            );
    }


    // R

    // no intermediate actions required
    

    // U

    public static async update(newAccountData: AccountData): Promise<AccountData> {
        return AccountDataController.getById(newAccountData.userId)
            .then(async oldAccountData => {
                const eMailAddressUpdate = oldAccountData.eMailAddress !== newAccountData.eMailAddress;
                const newEMailAddress = newAccountData.eMailAddress;

                if (eMailAddressUpdate) {
                    try {
                        await AccountDataController.validateEMailAddress(newAccountData);
                    } catch (e) {
                        return Promise.reject(e);
                    }
                    
                    newAccountData.eMailAddress = oldAccountData.eMailAddress;
                }

                if (!newAccountData.passwordHash) {
                    newAccountData.passwordHash = oldAccountData.passwordHash;
                } else if (CryptoService.validatePassword(newAccountData.passwordHash)) {
                    newAccountData.passwordHash = CryptoService.passwordHash(newAccountData.passwordHash);
                } else {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.account_password_invalid
                    ));
                }

                if (!newAccountData.accessLevel) {
                    newAccountData.accessLevel = oldAccountData.accessLevel;
                }

                if (!newAccountData.sessionHash) {
                    newAccountData.sessionHash = oldAccountData.sessionHash;
                }

                // FIX ME! Further debugging required to prevent resetting of isActivated state
                if (newAccountData.isActivated === null) {
                    newAccountData.isActivated = oldAccountData.isActivated;
                }

                return AccountDataController.update(newAccountData)
                    .then(accountData => {
                        if (eMailAddressUpdate) {
                            return AccountTransferController.create(new AccountTransfer(
                                new AccountData(newAccountData.userId),
                                newEMailAddress,
                                false
                            ))
                            .then(_ => MailService.sendAccountTransferMail(newAccountData.userId))
                            .then(_ => Promise.reject(new Success(
                                DictionaryKeys.account_transfer_initialized
                            )));
                        }

                        return Promise.resolve(accountData);
                    });
            });
    }


    // D

    public static async delete(userId: number): Promise<Success> {
        return MailService.sendAccountDeletionMail(userId);
    }

}