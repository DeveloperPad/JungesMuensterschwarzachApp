import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventPackingList } from 'models/EventPackingList';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventPackingListController } from 'src/controllers/EventPackingListController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventPackingListRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_PACKING_LISTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventPackingList: EventPackingList = plainToClass(EventPackingList, req.body.eventPackingList, cleanOptions);

                EventPackingListController
                    .create(eventPackingList)
                    .then((createdEventPackingList: EventPackingList) => {
                        res.send(createdEventPackingList);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_PACKING_LISTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                if (req.body.id) {
                    EventPackingListController
                        .getById(req.body.id)
                        .then((eventPackingList: EventPackingList) => {
                            res.send(eventPackingList);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventPackingListController
                        .getAll()
                        .then((eventPackingLists: EventPackingList[]) => {
                            res.send(eventPackingLists);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_PACKING_LISTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventPackingList: EventPackingList = plainToClass(EventPackingList, req.body.eventPackingList, cleanOptions);

                EventPackingListController
                    .update(eventPackingList)
                    .then((updatedEventPackingList: EventPackingList) => {
                        res.send(updatedEventPackingList);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_PACKING_LISTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventPackingListController
                    .delete(req.body.id)
                    .then((_: void) => {
                        res.send();
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });
    
}