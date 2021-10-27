import { classToPlain, plainToClass } from 'class-transformer';
import { AccountData } from 'models/AccountData';
import { ActionTypes } from 'models/ActionTypes';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { Event } from 'models/Event';
import { EventEnrollment } from 'models/EventEnrollment';
import * as moment from 'moment';
import { AccountDataController } from 'src/controllers/AccountDataController';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { EventController } from 'src/controllers/EventController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventEnrollmentController {

    private static COMMENT_LENGTH_MAX = 65535;


    // C

    public static async create(eventEnrollment: EventEnrollment): Promise<EventEnrollment> {
        return this.validate(eventEnrollment, ActionTypes.CREATE).then(
            _ => this.createDB(eventEnrollment)
        );
    }

    private static async createDB(eventEnrollment: EventEnrollment): Promise<EventEnrollment> {
        const plainEventEnrollment: any = classToPlain(eventEnrollment, cleanOptions);
        await DatabaseController.getPool().execute(
            "INSERT INTO event_enrollments ( \
                enrollmentId, eventId, userId, \
                eventEnrollmentComment, enrollmentDate \
             ) VALUES( \
                 ?, ?, ?, \
                 ?, ? \
             )",
            [
                plainEventEnrollment.enrollmentId,
                plainEventEnrollment.event.eventId,
                plainEventEnrollment.user.userId,
                plainEventEnrollment.eventEnrollmentComment,
                plainEventEnrollment.enrollmentDate
            ]
        );

        return this.getByEventAndUserId(eventEnrollment.event.eventId, eventEnrollment.user.userId);
    }


    // R

    public static async getAll(): Promise<EventEnrollment[]> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_enrollments ee, events e, account_data ad \
             WHERE ee.eventId = e.eventId AND \
                   ee.userId = ad.userId"
        );

        return Promise.resolve((rows as EventEnrollment[]).map((row: EventEnrollment) => {
            const eventEnrollment: EventEnrollment = plainToClass(EventEnrollment, row, cleanOptions);
            eventEnrollment.event = plainToClass(Event, row, cleanOptions);
            eventEnrollment.user = plainToClass(AccountData, row, cleanOptions);
            return eventEnrollment;
        }));
    }

    public static async getByEventAndUserId(eventId: number, userId: number): Promise<EventEnrollment> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_enrollments ee, events e, account_data ad \
             WHERE ee.eventId = ? AND \
                   ee.eventId = e.eventId AND \
                   ee.userId = ? AND \
                   ee.userId = ad.userId",
             [eventId, userId]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_user_enrolled_not
            ));
        }

        const eventEnrollment = plainToClass(EventEnrollment, rows, cleanOptions);
        eventEnrollment.event = plainToClass(Event, rows, cleanOptions);
        eventEnrollment.user = plainToClass(AccountData, rows, cleanOptions);
        return Promise.resolve(eventEnrollment);
    }


    // U

    public static async update(eventEnrollment: EventEnrollment): Promise<EventEnrollment> {
        return this.validate(eventEnrollment, ActionTypes.UPDATE).then(
            _ => this.updateDB(eventEnrollment)
        );
    }

    private static async updateDB(eventEnrollment: EventEnrollment): Promise<EventEnrollment> {
        await DatabaseController.getPool().execute(
            "UPDATE event_enrollments SET \
                eventEnrollmentComment = ? \
             WHERE eventEnrollmentId = ?",
            [
                eventEnrollment.eventEnrollmentComment,
                eventEnrollment.enrollmentId
            ]
        );

        return this.getByEventAndUserId(eventEnrollment.event.eventId, eventEnrollment.user.userId);
    }


    // D

    public static async delete(eventId: number, userId: number): Promise<void> {
        return this.getByEventAndUserId(eventId, userId).then(eventEnrollment => 
            this.validate(eventEnrollment, ActionTypes.DELETE).then(_ => 
                this.deleteDB(eventEnrollment.enrollmentId)
            )
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_enrollments \
             WHERE enrollmentId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(error)
        );
    }


    // Helpers

    public static async validate(eventEnrollment: EventEnrollment, action: ActionTypes): Promise<void> {
        return this.validateId(eventEnrollment.enrollmentId, action)
            .then(_ => this.validateEvent(eventEnrollment.event))
            .then(_ => this.validateUser(eventEnrollment.user))
            .then(_ => this.validateEventUser(eventEnrollment, action))
            .then(_ => this.validateComment(eventEnrollment.eventEnrollmentComment))
            .then(_ => this.validateEnrollmentDate(eventEnrollment, action))
    }

    private static async validateId(id: number, action: ActionTypes): Promise<void> {
        return action === ActionTypes.CREATE && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnrollmentId_invalid
            ));
    }

    private static async validateEvent(event: Event): Promise<void> {
        return EventController.getById(
            event !== undefined && event.eventId !== undefined ? event.eventId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validateUser(user: AccountData): Promise<void> {
        return AccountDataController.getById(
            user !== undefined && user.userId !== undefined ? user.userId : -1
        ).then((accountData: AccountData) => {
            return accountData !== null
                && accountData.firstName !== null
                && accountData.lastName !== null
                && accountData.streetName !== null
                && accountData.houseNumber !== null
                && accountData.zipCode !== null
                && accountData.city !== null
                && accountData.country !== null
                && accountData.phoneNumber !== null 
                && accountData.birthdate  !== null
                && accountData.eatingHabits  !== null
                ?
                Promise.resolve() :
                Promise.reject(new Error(
                    DictionaryKeys.error_type_account,
                    DictionaryKeys.event_user_enrollment_missing_account_data
                ));
        });
    }

    private static async validateEventUser(eventEnrollment: EventEnrollment, action: ActionTypes): Promise<void> {
        if (action === ActionTypes.CREATE) {
            return this.getByEventAndUserId(eventEnrollment.event.eventId, eventEnrollment.user.userId)
                .then(_ => Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_user_enrolled_already
                )))
                .catch(_ => Promise.resolve());
        } else {
            return Promise.resolve();
        }
    }

    private static async validateComment(comment: string): Promise<void> {
        return !comment
            || comment.length <= 0
            || comment.length > EventEnrollmentController.COMMENT_LENGTH_MAX ?
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnrollmentComment_invalid
            )) :
            Promise.resolve();
    }

    private static async validateEnrollmentDate(eventEnrollment: EventEnrollment, action: ActionTypes): Promise<void> {
        if (action === ActionTypes.CREATE || action === ActionTypes.DELETE) {
            eventEnrollment.enrollmentDate = moment();
        }

        if (!eventEnrollment.enrollmentDate || !eventEnrollment.enrollmentDate.isValid()) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnrollmentDate_malformed
            ));
        } else if (action !== ActionTypes.UPDATE && eventEnrollment.enrollmentDate.isBefore(eventEnrollment.event.eventEnrollmentStart)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                action === ActionTypes.CREATE ? 
                    DictionaryKeys.event_user_enrollment_too_early :
                    DictionaryKeys.event_user_disenrollment_too_early
            ));
        } else if (action !== ActionTypes.UPDATE && eventEnrollment.enrollmentDate.isAfter(eventEnrollment.event.eventEnrollmentEnd)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                action === ActionTypes.CREATE ?
                    DictionaryKeys.event_user_enrollment_too_late :
                    DictionaryKeys.event_user_disenrollment_too_late
            ));
        } else {
            return Promise.resolve();
        }
    }

}