import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventSchedule } from 'models/EventSchedule';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventScheduleController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static CONTENT_LENGTH_MAX: number = 65535;


    // C

    public static async create(eventSchedule: EventSchedule): Promise<EventSchedule> {
        return this.validate(eventSchedule, false).then(
            _ => this.createDB(eventSchedule)
        );
    }

    private static async createDB(eventSchedule: EventSchedule): Promise<EventSchedule> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_schedules ( \
                eventScheduleTitle, eventScheduleContent \
            ) VALUES ( \
                ?, ? \
            )",
            [
                eventSchedule.eventScheduleTitle,
                eventSchedule.eventScheduleContent
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventScheduleId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventSchedule[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_schedules \
             ORDER BY eventScheduleTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventSchedule, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventSchedule> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventSchedule> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_schedules \
             WHERE eventScheduleId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventScheduleId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventSchedule, rows[0], cleanOptions));
    }


    // U

    public static async update(eventSchedule: EventSchedule): Promise<EventSchedule> {
        return this.validate(eventSchedule).then(
            _ => this.updateDB(eventSchedule)
        );
    }

    private static async updateDB(eventSchedule: EventSchedule): Promise<EventSchedule> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_schedules \
             SET eventScheduleTitle = ?, \
                 eventScheduleContent = ? \
             WHERE eventScheduleId = ?",
            [
                eventSchedule.eventScheduleTitle,
                eventSchedule.eventScheduleContent,
                eventSchedule.eventScheduleId
            ]
        );

        return this.getById(eventSchedule.eventScheduleId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_schedules \
             WHERE eventScheduleId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventSchedule_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventSchedule: EventSchedule, withId: boolean = true): Promise<void> {
        return this.validateId(eventSchedule.eventScheduleId, withId)
            .then(() => this.validateTitle(eventSchedule)
            .then(() => this.validateContent(eventSchedule.eventScheduleContent)
        ));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventScheduleId_invalid
            ));
    }

    private static async validateTitle(eventSchedule: EventSchedule): Promise<void> {
        if (!eventSchedule.eventScheduleTitle
            || eventSchedule.eventScheduleTitle.length <= 0
            || eventSchedule.eventScheduleTitle.length > EventScheduleController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventScheduleTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_schedules \
             WHERE eventScheduleTitle = ?",
             [eventSchedule.eventScheduleTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventSchedule.eventScheduleId !== (rows[0] as EventSchedule).eventScheduleId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventScheduleTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateContent(content: string): Promise<void> {
        if (!content
            || content.length <= 0
            || content.length > EventScheduleController.CONTENT_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventScheduleContent_invalid
            ));
        }

        return Promise.resolve();
    }

}