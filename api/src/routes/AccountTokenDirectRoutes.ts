import * as express from 'express';
import { AccessLevels } from 'models/AccessLevels';
import { AccountData } from 'models/AccountData';
import { AccountToken } from 'models/AccountToken';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { AccountTokenController } from 'src/controllers/AccountTokenController';
import { TokenService } from 'src/services/TokenService';

export function initializeAccountTokenDirectRoutes(app: express.Application): void {


    // C
    // no manual token creation


    // R
    // used for creating/reading tokens from api server
    app.get(ApiRoutes.ACCOUNT_TOKENS_DIRECT, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then(accessLevel => {
            if (accessLevel < AccessLevels.DEVELOPER) {
                res.send(new Error(
                    DictionaryKeys.error_type_account,
                    DictionaryKeys.error_message_NEP
                ));
            } else {
                AccountDataController.getByEMailAddress(req.body.eMailAddress)
                    .then((accountData: AccountData) =>
                        TokenService.getOrCreateToken(accountData.userId, req.body.tokenType)
                            .then((accountToken: AccountToken) => {
                                res.send(accountToken);
                            })
                    )
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });


    // U
    // used for redeeming tokens at the api server
    app.put(ApiRoutes.ACCOUNT_TOKENS_DIRECT, (req: express.Request, res: express.Response) => {
        AccountTokenController.getByCode(req.body.code)
            .then(accountToken => 
                TokenService.redeemToken(accountToken, req.body.newPassword)
                    .then(success => {
                        res.send(success);
                    })
            )
            .catch(err => {
                res.send(err)
            });
    });


    // D
    // no manual token deletion

}