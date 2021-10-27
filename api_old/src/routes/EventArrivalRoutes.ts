import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventArrival } from 'models/EventArrival';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventArrivalController } from 'src/controllers/EventArrivalController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventArrivalRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_ARRIVALS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventArrival: EventArrival = plainToClass(EventArrival, req.body.eventArrival, cleanOptions);

                EventArrivalController
                    .create(eventArrival)
                    .then((createdEventArrival: EventArrival) => {
                        res.send(createdEventArrival);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_ARRIVALS, (req: express.Request, res: express.Response) => {
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
                    EventArrivalController
                        .getById(req.body.id)
                        .then((eventArrival: EventArrival) => {
                            res.send(eventArrival);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventArrivalController
                        .getAll()
                        .then((eventArrivals: EventArrival[]) => {
                            res.send(eventArrivals);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_ARRIVALS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventArrival: EventArrival = plainToClass(EventArrival, req.body.eventArrival, cleanOptions);

                EventArrivalController
                    .update(eventArrival)
                    .then((updatedEventArrival: EventArrival) => {
                        res.send(updatedEventArrival);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_ARRIVALS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventArrivalController
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