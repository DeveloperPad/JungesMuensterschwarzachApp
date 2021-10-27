import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventLocation } from 'models/EventLocation';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventLocationController } from 'src/controllers/EventLocationController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventLocationRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_LOCATIONS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventLocation: EventLocation = plainToClass(EventLocation, req.body.eventLocation, cleanOptions);

                EventLocationController
                    .create(eventLocation)
                    .then((createdEventLocation: EventLocation) => {
                        res.send(createdEventLocation);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_LOCATIONS, (req: express.Request, res: express.Response) => {
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
                    EventLocationController
                        .getById(req.body.id)
                        .then((eventLocation: EventLocation) => {
                            res.send(eventLocation);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventLocationController
                        .getAll()
                        .then((eventLocations: EventLocation[]) => {
                            res.send(eventLocations);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_LOCATIONS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventLocation: EventLocation = plainToClass(EventLocation, req.body.eventLocation, cleanOptions);

                EventLocationController
                    .update(eventLocation)
                    .then((updatedEventLocation: EventLocation) => {
                        res.send(updatedEventLocation);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_LOCATIONS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventLocationController
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