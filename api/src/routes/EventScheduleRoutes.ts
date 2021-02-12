import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventSchedule } from 'models/EventSchedule';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventScheduleController } from 'src/controllers/EventScheduleController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';


export function initializeEventScheduleRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_SCHEDULES, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventSchedule: EventSchedule = plainToClass(EventSchedule, req.body.eventSchedule, cleanOptions);

                EventScheduleController
                    .create(eventSchedule)
                    .then((createdEventSchedule: EventSchedule) => {
                        res.send(createdEventSchedule);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_SCHEDULES, (req: express.Request, res: express.Response) => {
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
                    EventScheduleController
                        .getById(req.body.id)
                        .then((eventSchedule: EventSchedule) => {
                            res.send(eventSchedule);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventScheduleController
                        .getAll()
                        .then((eventSchedules: EventSchedule[]) => {
                            res.send(eventSchedules);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_SCHEDULES, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventSchedule: EventSchedule = plainToClass(EventSchedule, req.body.eventSchedule, cleanOptions);

                EventScheduleController
                    .update(eventSchedule)
                    .then((updatedEventSchedule: EventSchedule) => {
                        res.send(updatedEventSchedule);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_SCHEDULES, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventScheduleController
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