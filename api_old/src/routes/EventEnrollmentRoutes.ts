import { plainToClass } from 'class-transformer';
import * as express from 'express';
import { AccessLevels } from 'models/AccessLevels';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventArrival } from 'models/EventArrival';
import { EventEnrollment } from 'models/EventEnrollment';
import { Permissions } from 'models/Permissions';
import { ApiRoutes } from 'models/Routes';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { EventArrivalController } from 'src/controllers/EventArrivalController';
import { EventController } from 'src/controllers/EventController';
import { EventEnrollmentController } from 'src/controllers/EventEnrollmentController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export function initializeEventEnrollmentRoutes(app: express.Application): void {

    // C
    app.post(ApiRoutes.EVENT_ENROLLMENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < AccessLevels.USER) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventEnrollment: EventEnrollment = plainToClass(EventEnrollment, req.body.eventEnrollment, cleanOptions);

                if (!eventEnrollment.event || eventEnrollment.event.eventId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.event_eventId_invalid
                        )
                    );
                } else if (!eventEnrollment.user || eventEnrollment.user.userId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.account_id_not_exists
                        )
                    );
                } else {
                    EventController.getById(eventEnrollment.event.eventId)
                    .then(event => event.requiredAccessLevel)
                    .catch(_ => AccessLevels.GUEST)
                    .then((requiredAccessLevel: AccessLevels) => {
                        AccountDataController.getBySessionHash(req.body.sessionHash)
                        .then(user => user.userId)
                        .catch(_ => -1)
                        .then((userId: number) => {

                            if (accessLevel < Permissions.EVENTS && 
                                    (requiredAccessLevel > accessLevel || userId !== eventEnrollment.user.userId)) {
                                res.send(
                                    new Error(
                                        DictionaryKeys.error_type_account,
                                        DictionaryKeys.error_message_NEP
                                    )
                                );
                            } else {
                                EventEnrollmentController
                                .create(eventEnrollment)
                                .then((createdEventEnrollment: EventEnrollment) => {
                                    res.send(createdEventEnrollment);
                                })
                                .catch((error: Error) => {
                                    res.send(error);
                                });
                            }

                        });
                    });
                } 
            }
        });
    });

    // R
    app.get(ApiRoutes.EVENT_ENROLLMENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < AccessLevels.USER) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                if (req.body.eventId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.event_eventId_invalid
                        )
                    );
                } else if (req.body.userId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.account_id_not_exists
                        )
                    );
                } else {
                    EventController.getById(req.body.eventId)
                    .then(event => event.requiredAccessLevel)
                    .catch(_ => AccessLevels.GUEST)
                    .then((requiredAccessLevel: AccessLevels) => {
                        AccountDataController.getBySessionHash(req.body.sessionHash)
                        .then(user => user.userId)
                        .catch(_ => -1)
                        .then((userId: number) => {

                            if (accessLevel < Permissions.EVENTS && 
                                    (requiredAccessLevel > accessLevel || userId !== req.body.userId)) {
                                res.send(
                                    new Error(
                                        DictionaryKeys.error_type_account,
                                        DictionaryKeys.error_message_NEP
                                    )
                                );
                            } else {
                                EventEnrollmentController
                                .getByEventAndUserId(req.body.eventId, req.body.userId)
                                .then((eventEnrollment: EventEnrollment) => {
                                    res.send(eventEnrollment);
                                })
                                .catch((error: Error) => {
                                    res.send(error);
                                });
                            }

                        });
                    });
                }
            }
        });
    });

    // U
    app.put(ApiRoutes.EVENT_ENROLLMENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < AccessLevels.USER) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                const eventEnrollment: EventEnrollment = plainToClass(EventEnrollment, req.body.eventEnrollment, cleanOptions);

                if (!eventEnrollment.event || eventEnrollment.event.eventId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.event_eventId_invalid
                        )
                    );
                } else if (!eventEnrollment.user || eventEnrollment.user.userId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.account_id_not_exists
                        )
                    );
                } else {
                    EventController.getById(eventEnrollment.event.eventId)
                    .then(event => event.requiredAccessLevel)
                    .catch(_ => AccessLevels.GUEST)
                    .then((requiredAccessLevel: AccessLevels) => {
                        AccountDataController.getBySessionHash(req.body.sessionHash)
                        .then(user => user.userId)
                        .catch(_ => -1)
                        .then((userId: number) => {

                            if (accessLevel < Permissions.EVENTS && 
                                    (requiredAccessLevel > accessLevel || userId !== eventEnrollment.user.userId)) {
                                res.send(
                                    new Error(
                                        DictionaryKeys.error_type_account,
                                        DictionaryKeys.error_message_NEP
                                    )
                                );
                            } else {
                                EventEnrollmentController
                                .update(eventEnrollment)
                                .then((updatedEventEnrollment: EventEnrollment) => {
                                    res.send(updatedEventEnrollment);
                                })
                                .catch((error: Error) => {
                                    res.send(error);
                                });
                            }

                        });
                    });
                }
            }
        });
    });

    // D
    app.delete(ApiRoutes.EVENT_ENROLLMENTS, (req: express.Request, res: express.Response) => {
        AccountDataController.getAccessLevel(req.body.sessionHash).then((accessLevel: number) => {
            if (accessLevel < AccessLevels.USER) {
                res.send(
                    new Error(
                        DictionaryKeys.error_type_account,
                        DictionaryKeys.error_message_NEP
                    )
                );
            } else {
                if (req.body.eventId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.event_eventId_invalid
                        )
                    );
                } else if (req.body.userId === undefined) {
                    res.send(
                        new Error(
                            DictionaryKeys.error_type_account,
                            DictionaryKeys.account_id_not_exists
                        )
                    );
                } else {
                    EventController.getById(req.body.eventId)
                    .then(event => event.requiredAccessLevel)
                    .catch(_ => AccessLevels.GUEST)
                    .then((requiredAccessLevel: AccessLevels) => {
                        AccountDataController.getBySessionHash(req.body.sessionHash)
                        .then(user => user.userId)
                        .catch(_ => -1)
                        .then((userId: number) => {

                            if (accessLevel < Permissions.EVENTS && 
                                    (requiredAccessLevel > accessLevel || userId !== req.body.userId)) {
                                res.send(
                                    new Error(
                                        DictionaryKeys.error_type_account,
                                        DictionaryKeys.error_message_NEP
                                    )
                                );
                            } else {
                                EventEnrollmentController
                                .delete(req.body.eventId, req.body.userId)
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
            }
        });
    });
    
}