import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventOffer } from 'models/EventOffer';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventOfferController } from 'src/controllers/EventOfferController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventOfferRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_OFFERS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventOffer: EventOffer = plainToClass(EventOffer, req.body.eventOffer, cleanOptions);

                EventOfferController
                    .create(eventOffer)
                    .then((createdEventOffer: EventOffer) => {
                        res.send(createdEventOffer);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_OFFERS, (req: express.Request, res: express.Response) => {
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
                    EventOfferController
                        .getById(req.body.id)
                        .then((eventOffer: EventOffer) => {
                            res.send(eventOffer);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventOfferController
                        .getAll()
                        .then((eventOffers: EventOffer[]) => {
                            res.send(eventOffers);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_OFFERS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventOffer: EventOffer = plainToClass(EventOffer, req.body.eventOffer, cleanOptions);

                EventOfferController
                    .update(eventOffer)
                    .then((updatedEventOffer: EventOffer) => {
                        res.send(updatedEventOffer);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_OFFERS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventOfferController
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