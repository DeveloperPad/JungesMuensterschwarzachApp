import * as express from 'express';
import { AccessLevels } from 'models/AccessLevels';
import { AccountData } from 'models/AccountData';
import { AccountToken } from 'models/AccountToken';
import { AccountTokenTypes } from 'models/AccountTokenTypes';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { AccountTokenController } from 'src/controllers/AccountTokenController';
import { MailService } from 'src/services/MailService';
import { TokenService } from 'src/services/TokenService';

export function initializeAccountTokenMailRoutes(app: express.Application): void {


    // C
    // no manual token creation


    // R
    // used for creating/reading tokens from api server
    app.get(ApiRoutes.ACCOUNT_TOKENS_MAIL, (req: express.Request, res: express.Response) => {
        AccountDataController.getByEMailAddress(req.body.eMailAddress)
            .then(accountData => {
                switch (req.body.tokenType) {
                    case AccountTokenTypes.ACTIVATION:
                        return MailService.sendAccountActivationMail(req.body.eMailAddress)
                            .then(success => { res.send(success); });
                    case AccountTokenTypes.DELETION:
                        return MailService.sendAccountDeletionMail(accountData.userId)
                            .then(success => { res.send(success); });
                    case AccountTokenTypes.E_MAIL_UPDATE:
                        return MailService.sendAccountTransferMail(accountData.userId)
                            .then(success => { res.send(success); });
                    case AccountTokenTypes.PASSWORD_RESET:
                        return MailService.sendPasswordResetMail(req.body.eMailAddress)
                            .then(success => { res.send(success); });
                    default:
                        return Promise.reject(new Error(
                            DictionaryKeys.error_type_client,
                            DictionaryKeys.token_type_invalid
                        ));
                }
            })
            .then(success => {
                res.send(success);
            })
            .catch(err => {
                res.send(err);
            });
    });


    // U
    // no manual token update


    // D
    // no manual token deletion

}