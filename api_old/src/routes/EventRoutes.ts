import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { Event } from 'models/Event';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventController } from 'src/controllers/EventController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventRoutes(app: express.Application): void {
    // C
    app.post(ApiRoutes.EVENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS
                    || !req.body.event.requiredAccessLevel
                    || accessLevel < req.body.event.requiredAccessLevel) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const event: Event = plainToClass(Event, req.body.event, cleanOptions);

                EventController
                    .create(event)
                    .then((createdEvent: Event) => {
                        res.send(createdEvent);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (req.body.id) {
                EventController
                    .getById(req.body.id)
                    .then((event: Event) => {
                        res.send(
                            event.requiredAccessLevel <= accessLevel ?
                                event :
                                new Error(
                                    DictionaryKeys.error_type_account,
                                    DictionaryKeys.error_message_NEP
                                )
                        )
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            } else {
                EventController
                    .getAll()
                    .then((events: Event[]) => {
                        res.send(
                            events.filter((event: Event) => {
                                return event.requiredAccessLevel <= accessLevel;
                            })
                        )
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS
                    || !req.body.event.requiredAccessLevel
                    || accessLevel < req.body.event.requiredAccessLevel) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const event: Event = plainToClass(Event, req.body.event, cleanOptions);

                EventController
                    .update(event)
                    .then((updatedEvent: Event) => {
                        res.send(updatedEvent);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventController
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