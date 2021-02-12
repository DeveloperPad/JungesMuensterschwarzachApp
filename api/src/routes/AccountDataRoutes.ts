import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { AccessLevels } from 'models/AccessLevels';
import { AccountData } from 'models/AccountData';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { AccountService } from 'src/services/AccountService';
import { cleanOptions, toPrivate, toPublic } from 'src/utilities/ClassTransformerFills';

export function initializeAccountDataRoutes(app: express.Application): void {


    // C
    app.post(ApiRoutes.ACCOUNT_DATA, (req: express.Request, res: express.Response) => {
        const accountData: AccountData = plainToClass(AccountData, req.body.accountData, cleanOptions);

        AccountService
            .create(accountData)
            .then((createdAccountData: AccountData) => {
                res.send(toPrivate(createdAccountData));
            })
            .catch((error: Error) => {
                res.send(error);
            });
    });


    // R
    app.get(ApiRoutes.ACCOUNT_DATA, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < AccessLevels.GUEST) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                if (req.body.id) {
                    AccountDataController
                        .getById(req.body.id)
                        .then(accountData => {
                            AccountDataController.getBySessionHash(req.body.sessionHash)
                            .then(ownAccountData =>
                                res.send(
                                    Permissions.USERS <= accessLevel || accountData.userId === ownAccountData.userId ?
                                        toPrivate(accountData) :
                                        toPublic(accountData)
                                )
                            )
                            .catch(_ => 
                                res.send(
                                    toPublic(accountData)
                                )
                            );
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    AccountDataController
                        .getAll()
                        .then(accountData => {
                            AccountDataController.getBySessionHash(req.body.sessionHash)
                            .then(ownAccountData => {
                                res.send(
                                    accountData.map(singleAccountData =>
                                        Permissions.USERS <= accessLevel || singleAccountData.userId === ownAccountData.userId ?
                                            toPrivate(singleAccountData) :
                                            toPublic(singleAccountData)
                                    )
                                )
                            })
                            .catch(_ => 
                                res.send(
                                    accountData.map(singleAccountData => 
                                        toPublic(singleAccountData)
                                    )
                                )
                            );
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });


    // U
    app.put(ApiRoutes.ACCOUNT_DATA, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then(accessLevel => {
            AccountDataController.getBySessionHash(req.body.sessionHash)
            .then(ownAccountData => {
                if (accessLevel < AccessLevels.USER || 
                    accessLevel < Permissions.USERS && Number(req.body.accountData.userId) !== ownAccountData.userId) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.error_message_NEP
                        )
                    );
                } else {
                    const accountData: AccountData = plainToClass(AccountData, req.body.accountData, cleanOptions);

                    if (ownAccountData.accessLevel < Permissions.USERS) {
                        accountData.accessLevel = undefined;
                    }
    
                    AccountService
                        .update(accountData)
                        .then((updatedAccountData: AccountData) => {
                            res.send(toPrivate(updatedAccountData));
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            })
            .catch(_ =>
                res.send(new Error(
                    DictionaryKeys.error_type_account,
                    DictionaryKeys.error_message_NEP
                ))
            );
        });
    });


    // D
    app.delete(ApiRoutes.ACCOUNT_DATA, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            AccountDataController.getBySessionHash(req.body.sessionHash)
            .then(ownAccountData => {
                if (accessLevel < AccessLevels.USER ||
                    accessLevel < Permissions.USERS && Number(req.body.id) !== ownAccountData.userId) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.error_message_NEP
                        )
                    );
                } else {
                    AccountService
                        .delete(req.body.id)
                        .then(success => {
                            res.send(success);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            })
            .catch(_ =>
                res.send(new Error(
                    DictionaryKeys.error_type_account,
                    DictionaryKeys.error_message_NEP
                ))
            )
        });
    });

}