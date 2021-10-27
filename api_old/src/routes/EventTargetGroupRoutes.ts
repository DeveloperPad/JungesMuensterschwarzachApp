import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventTargetGroup } from 'models/EventTargetGroup';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventTargetGroupController } from 'src/controllers/EventTargetGroupController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';


export function initializeEventTargetGroupRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_TARGET_GROUPS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventTargetGroup: EventTargetGroup = plainToClass(EventTargetGroup, req.body.eventTargetGroup, cleanOptions);

                EventTargetGroupController
                    .create(eventTargetGroup)
                    .then((createdEventTargetGroup: EventTargetGroup) => {
                        res.send(createdEventTargetGroup);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_TARGET_GROUPS, (req: express.Request, res: express.Response) => {
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
                    EventTargetGroupController
                        .getById(req.body.id)
                        .then((eventTargetGroup: EventTargetGroup) => {
                            res.send(eventTargetGroup);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                } else {
                    EventTargetGroupController
                        .getAll()
                        .then((eventTargetGroups: EventTargetGroup[]) => {
                            res.send(eventTargetGroups);
                        })
                        .catch((error: Error) => {
                            res.send(error);
                        });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_TARGET_GROUPS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventTargetGroup: EventTargetGroup = plainToClass(EventTargetGroup, req.body.eventTargetGroup, cleanOptions);

                EventTargetGroupController
                    .update(eventTargetGroup)
                    .then((updatedEventTargetGroup: EventTargetGroup) => {
                        res.send(updatedEventTargetGroup);
                    })
                    .catch((error: Error) => {
                        res.send(error);
                    });
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_TARGET_GROUPS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < Permissions.EVENTS) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                EventTargetGroupController
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