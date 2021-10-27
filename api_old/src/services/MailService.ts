import { config } from 'config';
import * as escape from 'escape-html';
import { AccountToken } from 'models/AccountToken';
import { AccountTokenTypes } from 'models/AccountTokenTypes';
import { AccountTransfer } from 'models/AccountTransfer';
import { Dictionary } from 'models/Dictionary';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { AppRoutes } from 'models/Routes';
import { Success } from 'models/Success';
import * as nodemailer from 'nodemailer';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { AccountTransferController } from 'src/controllers/AccountTransferController';
import { TokenService } from 'src/services/TokenService';

export class MailService {

    public static async sendAccountActivationMail(eMailAddress: string): Promise<Success> {
        return AccountDataController.getByEMailAddress(eMailAddress)
            .then(accountData =>
                TokenService.getOrCreateToken(accountData.userId, AccountTokenTypes.ACTIVATION)
                    .then(accountToken => {
                        const redeemUrl = MailService.getRedeemTokenUrl(accountToken.code);
                        const title = Dictionary.mail_confirm_activation_title;
                        const message = Dictionary.mail_message_salutation_prefix
                            + escape(accountToken.user.displayName)
                            + Dictionary.mail_message_salutation_suffix
                            + Dictionary.mail_confirm_activation_message_paragraph_1
                            + "<a href=\"" + redeemUrl + "\">" + redeemUrl + "</a>"
                            + Dictionary.mail_confirm_activation_message_paragraph_2
                            + Dictionary.mail_regards;

                        return MailService.sendMail(
                            accountToken.user.eMailAddress,
                            title,
                            message
                        );
                    })
                    .then(_ =>
                        Promise.resolve(new Success(
                            DictionaryKeys.mail_confirm_activation_send
                        ))
                    )
            );
    }

    public static async sendAccountTransferMail(userId: number): Promise<Success> {
        return TokenService.getOrCreateToken(userId, AccountTokenTypes.E_MAIL_UPDATE)
                    .then(accountToken => 
                        AccountTransferController.getByUserId(userId)
                            .then(accountTransfer => {
                                if (accountTransfer.oldEMailAddressConfirmed) {
                                    return MailService.sendAccountTransferNewMail(accountToken, accountTransfer)
                                        .then(_ => Promise.resolve(new Success(
                                            DictionaryKeys.account_transfer_progressed
                                        )));
                                } else {
                                    return MailService.sendAccountTransferOldMail(accountToken, accountTransfer)
                                        .then(_ => Promise.resolve(new Success(
                                            DictionaryKeys.account_transfer_initialized
                                        )));
                                }
                            })
                    );
    }

    private static async sendAccountTransferOldMail(accountToken: AccountToken, accountTransfer: AccountTransfer): Promise<void> {
        const redeemUrl = MailService.getRedeemTokenUrl(accountToken.code);
        const title = Dictionary.mail_eMailAddress_update_title;
        const message = Dictionary.mail_message_salutation_prefix
            + escape(accountToken.user.displayName)
            + Dictionary.mail_message_salutation_suffix
            + Dictionary.mail_eMailAddress_update_old_message_paragraph_1
            + "<strong>" + accountTransfer.newEMailAddress + "</strong>"
            + Dictionary.mail_eMailAddress_update_old_message_paragraph_2
            + "<a href=\"" + redeemUrl + "\">" + redeemUrl + "</a>"
            + Dictionary.mail_eMailAddress_update_old_message_paragraph_3
            + Dictionary.mail_regards;

        return MailService.sendMail(accountToken.user.eMailAddress, title, message);
    }

    private static async sendAccountTransferNewMail(accountToken: AccountToken, accountTransfer: AccountTransfer): Promise<void> {
        const redeemUrl = MailService.getRedeemTokenUrl(accountToken.code);
        const title = Dictionary.mail_eMailAddress_update_title;
        const message = Dictionary.mail_message_salutation_prefix
            + escape(accountToken.user.displayName)
            + Dictionary.mail_message_salutation_suffix
            + Dictionary.mail_eMailAddress_update_new_message_paragraph_1
            + "<a href=\"" + redeemUrl + "\">" + redeemUrl + "</a>"
            + Dictionary.mail_eMailAddress_update_new_message_paragraph_2
            + Dictionary.mail_regards;

        return MailService.sendMail(accountTransfer.newEMailAddress, title, message);
    }

    public static async sendPasswordResetMail(eMailAddress: string): Promise<Success> {
        return AccountDataController.getByEMailAddress(eMailAddress)
            .then(accountData =>
                TokenService.getOrCreateToken(accountData.userId, AccountTokenTypes.PASSWORD_RESET)
                    .then(accountToken => {
                        const redeemUrl = MailService.getRedeemTokenUrl(accountToken.code);
                        const title = Dictionary.mail_password_reset_title;
                        const message = Dictionary.mail_message_salutation_prefix
                            + escape(accountToken.user.displayName)
                            + Dictionary.mail_message_salutation_suffix
                            + Dictionary.mail_password_reset_message_paragraph_1
                            + "<a href=\"" + redeemUrl + "\">" + redeemUrl + "</a>"
                            + Dictionary.mail_password_reset_message_paragraph_2
                            + Dictionary.mail_regards;

                        return MailService.sendMail(
                            accountToken.user.eMailAddress,
                            title,
                            message
                        );
                    })
                    .then(_ =>
                        Promise.resolve(new Success(
                            DictionaryKeys.mail_password_reset_sent
                        ))
                    )
            );
    }

    public static async sendAccountDeletionMail(userId: number): Promise<Success> {
        return TokenService.getOrCreateToken(userId, AccountTokenTypes.DELETION)
            .then(accountToken => {
                const redeemUrl = MailService.getRedeemTokenUrl(accountToken.code);
                const title = Dictionary.mail_account_deletion_title;
                const message = Dictionary.mail_message_salutation_prefix
                    + escape(accountToken.user.displayName)
                    + Dictionary.mail_message_salutation_suffix
                    + Dictionary.mail_account_deletion_message_paragraph_1
                    + "<a href=\"" + redeemUrl + "\">" + redeemUrl + "</a>"
                    + Dictionary.mail_account_deletion_message_paragraph_2
                    + Dictionary.mail_regards;
                
                return MailService.sendMail(
                    accountToken.user.eMailAddress,
                    title,
                    message
                )
            })
            .then(_ =>
                Promise.resolve(new Success(
                    DictionaryKeys.account_deletion_initiiated
                ))
            );
    }

    private static getRedeemTokenUrl(code: string): string {
        return config.app.baseUrl + AppRoutes.HELP_REDEEM_TOKEN + "/" + escape(code);
    }

    private static async sendMail(recipientAddress: string, title: string, message: string): Promise<void> {
        return config.mail.active ?
            nodemailer
                .createTransport(config.mail)
                .sendMail({
                    from: config.mail.author,
                    html: message,
                    subject: title,
                    text: message.replace(/<[^>]*>?/gm, ''),
                    to: recipientAddress,
                })
                .catch(exc => 
                    Promise.reject(new Error(
                        DictionaryKeys.error_type_email,
                        exc
                    ))
                ) :
            Promise.resolve();
    }

    

    public static async verifyConnection(): Promise<true> {
        return nodemailer
                .createTransport(config.mail)
                .verify();
    }



}