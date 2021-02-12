import { AccountData } from 'models/AccountData';
import { AccountToken } from 'models/AccountToken';
import { AccountTokenTypes } from 'models/AccountTokenTypes';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { Success } from 'models/Success';
import * as moment from 'moment';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { AccountTokenController } from 'src/controllers/AccountTokenController';
import { AccountTransferController } from 'src/controllers/AccountTransferController';
import { AccountService } from 'src/services/AccountService';
import { CryptoService } from 'src/services/CryptoService';
import { MailService } from 'src/services/MailService';

export class TokenService {

    private static TOKEN_VALIDATION_DURATION_IN_DAYS = 7;


    public static async getOrCreateToken(userId: number, tokenType: AccountTokenTypes): Promise<AccountToken> {
        // clean-up first
        TokenService.deleteExpiredTokens();

        try {
            const accountToken = await AccountTokenController.getByUserId(userId);

            if (accountToken.tokenType === AccountTokenTypes.ACTIVATION
                && tokenType !== AccountTokenTypes.ACTIVATION) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_account,
                    DictionaryKeys.account_isActivated_not
                ));
            }

            if (tokenType && accountToken.tokenType !== AccountTokenTypes.ACTIVATION &&
                accountToken.tokenType !== tokenType) {
                
                return TokenService.expireToken(accountToken)
                    .then(_ => AccountTokenController.delete(accountToken.code))
                    .then(_ => TokenService.createToken(userId, tokenType));
            }

            return accountToken;
        } catch (error) {
            return TokenService.createToken(userId, tokenType);
        }
    }

    private static async createToken(userId: number, tokenType: AccountTokenTypes): Promise<AccountToken> {
        return AccountDataController.getById(userId)
            .then((accountData: AccountData) => {
                if (tokenType !== AccountTokenTypes.ACTIVATION && !accountData.isActivated) {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.account_isActivated_not
                    ));
                } else if (tokenType === AccountTokenTypes.ACTIVATION && accountData.isActivated) {
                    return Promise.reject(new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.account_isActivated_already
                    ));
                } else if (tokenType === AccountTokenTypes.E_MAIL_UPDATE) {
                    return AccountTransferController.getByUserId(userId)
                        .then(_ => TokenService.createTokenDB(accountData, tokenType));
                } else {
                    return TokenService.createTokenDB(accountData, tokenType);
                }
            });        
    }

    private static async createTokenDB(accountData: AccountData, tokenType: AccountTokenTypes): Promise<AccountToken> {
        return AccountTokenController.create(new AccountToken(
            CryptoService.generateUUID(),
            tokenType,
            accountData,
            moment().add(TokenService.TOKEN_VALIDATION_DURATION_IN_DAYS, "d")
        ));
    }

    public static async redeemToken(accountToken: AccountToken, newPassword?: string): Promise<Success> {
        switch (accountToken.tokenType) {
            case AccountTokenTypes.ACTIVATION:
                return AccountDataController.getById(accountToken.user.userId)
                    .then(accountData => {
                        accountData.isActivated = true;
                        return AccountService.update(accountData);
                    })
                    .then(_ =>
                        AccountTokenController.delete(accountToken.code)    
                    )
                    .then(_ => Promise.resolve(new Success(
                        DictionaryKeys.account_isActivated_activation_success
                    )));
            case AccountTokenTypes.PASSWORD_RESET:
                return newPassword ?
                    AccountDataController.getById(accountToken.user.userId)
                        .then(accountData => {
                            accountData.passwordHash = newPassword
                            return AccountService.update(accountData);
                        })
                        .then(_ =>
                            AccountTokenController.delete(accountToken.code)    
                        )
                        .then(_ => Promise.resolve(new Success(
                            DictionaryKeys.account_password_updated
                        ))) :
                    Promise.reject(new Success(
                        // send fake response to tell the app to show the password reset form
                        DictionaryKeys.account_password_new
                    ));
            case AccountTokenTypes.E_MAIL_UPDATE:
                return AccountTransferController.getByUserId(accountToken.user.userId)
                    .then(accountTransfer => {
                        if (accountTransfer.oldEMailAddressConfirmed) {
                            const accountData = accountTransfer.user;
                            accountData.eMailAddress = accountTransfer.newEMailAddress;
                            return AccountDataController.update(accountData)
                                .then(_ =>
                                    AccountTransferController.delete(accountTransfer.user.userId)    
                                )
                                .then(_ => 
                                    AccountTokenController.delete(accountToken.code)    
                                )
                                .then(_ => Promise.resolve(new Success(
                                    DictionaryKeys.account_eMailAddress_updated
                                )))
                        } else {
                            const updatedAccountTransfer = accountTransfer;
                            updatedAccountTransfer.oldEMailAddressConfirmed = true;
                            return AccountTransferController.update(updatedAccountTransfer)
                                .then(_ =>
                                    AccountTokenController.delete(accountToken.code)
                                )
                                .then(_=>
                                    MailService.sendAccountTransferMail(accountToken.user.userId)
                                )
                                .then(_ =>
                                    Promise.resolve(new Success(
                                        DictionaryKeys.account_transfer_progressed
                                    ))
                                );
                        }
                    });
            case AccountTokenTypes.DELETION:
                return AccountDataController.delete(accountToken.user.userId)
                    .then(_ => AccountTokenController.delete(accountToken.code))
                    .then(_ => Promise.resolve(new Success(
                        DictionaryKeys.account_deletion_success
                    )));
            default:
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.token_type_invalid
                ));
        }
    }

    private static async expireToken(accountToken: AccountToken): Promise<void> {
        if (!accountToken) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.token_cleanup_failed
            ));
        }

        switch (accountToken.tokenType) {
            case AccountTokenTypes.ACTIVATION:
                if (accountToken.user.isActivated === false) {
                    return AccountDataController.delete(accountToken.user.userId);
                }
                break;
            case AccountTokenTypes.E_MAIL_UPDATE:
                return AccountTransferController.delete(accountToken.user.userId);
            default:
                break;
        }

        return Promise.resolve();
    }

    public static async deleteExpiredTokens(): Promise<void> {
        return AccountTokenController.getExpiredTokens()
            .then(tokens => 
                tokens.map(token => 
                    TokenService.expireToken(token)
                        .then(_ => AccountTokenController.delete(token.code))
                )
            )
            .then(promises => Promise.all(promises).then(_ => Promise.resolve()));
    }

}