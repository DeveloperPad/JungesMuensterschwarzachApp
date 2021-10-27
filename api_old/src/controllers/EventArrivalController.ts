import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventArrival } from 'models/EventArrival';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventArrivalController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static CONTENT_LENGTH_MAX: number = 65535;


    // C

    public static async create(eventArrival: EventArrival): Promise<EventArrival> {
        return this.validate(eventArrival, false).then(
            _ => this.createDB(eventArrival)
        );
    }

    private static async createDB(eventArrival: EventArrival): Promise<EventArrival> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_arrivals ( \
                eventArrivalTitle, eventArrivalContent \
            ) VALUES ( \
                ?, ? \
            )",
            [
                eventArrival.eventArrivalTitle,
                eventArrival.eventArrivalContent
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventArrivalId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventArrival[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_arrivals \
             ORDER BY eventArrivalTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventArrival, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventArrival> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventArrival> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_arrivals \
             WHERE eventArrivalId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventArrivalId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventArrival, rows[0], cleanOptions));
    }


    // U

    public static async update(eventArrival: EventArrival): Promise<EventArrival> {
        return this.validate(eventArrival).then(
            _ => this.updateDB(eventArrival)
        );
    }

    private static async updateDB(eventArrival: EventArrival): Promise<EventArrival> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_arrivals \
             SET eventArrivalTitle = ?, \
                 eventArrivalContent = ? \
             WHERE eventArrivalId = ?",
            [
                eventArrival.eventArrivalTitle,
                eventArrival.eventArrivalContent,
                eventArrival.eventArrivalId
            ]
        );

        return this.getById(eventArrival.eventArrivalId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_arrivals \
             WHERE eventArrivalId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventArrival_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventArrival: EventArrival, withId: boolean = true): Promise<void> {
        return this.validateId(eventArrival.eventArrivalId, withId)
            .then(() => this.validateTitle(eventArrival)
            .then(() => this.validateContent(eventArrival.eventArrivalContent)
        ));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventArrivalId_invalid
            ));
    }

    private static async validateTitle(eventArrival: EventArrival): Promise<void> {
        if (!eventArrival.eventArrivalTitle
            || eventArrival.eventArrivalTitle.length <= 0
            || eventArrival.eventArrivalTitle.length > EventArrivalController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventArrivalTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_arrivals \
             WHERE eventArrivalTitle = ?",
             [eventArrival.eventArrivalTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventArrival.eventArrivalId !== (rows[0] as EventArrival).eventArrivalId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventArrivalTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateContent(content: string): Promise<void> {
        if (!content
            || content.length <= 0
            || content.length > EventArrivalController.CONTENT_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventArrivalContent_invalid
            ));
        }

        return Promise.resolve();
    }

}