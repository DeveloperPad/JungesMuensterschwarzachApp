import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventPrice } from 'models/EventPrice';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventPriceController } from 'src/controllers/EventPriceController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventPriceRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_PRICES, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventPrice: EventPrice = plainToClass(EventPrice, req.body.eventPrice, cleanOptions);

                EventPriceController
                    .create(eventPrice)
                    .then((createdEventPrice: EventPrice) => {
                        res.send(createdEventPrice);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_PRICES, (req: express.Request, res: express.Response) => {
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
                    EventPriceController
                        .getById(req.body.id)
                        .then((eventPrice: EventPrice) => {
                            res.send(eventPrice);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventPriceController
                        .getAll()
                        .then((eventPrices: EventPrice[]) => {
                            res.send(eventPrices);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_PRICES, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventPrice: EventPrice = plainToClass(EventPrice, req.body.eventPrice, cleanOptions);

                EventPriceController
                    .update(eventPrice)
                    .then((updatedEventPrice: EventPrice) => {
                        res.send(updatedEventPrice);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_PRICES, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventPriceController
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