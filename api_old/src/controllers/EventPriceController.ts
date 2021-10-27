import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventPrice } from 'models/EventPrice';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventPriceController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static CONTENT_LENGTH_MAX: number = 65535;


    // C

    public static async create(eventPrice: EventPrice): Promise<EventPrice> {
        return this.validate(eventPrice, false).then(
            _ => this.createDB(eventPrice)
        );
    }

    private static async createDB(eventPrice: EventPrice): Promise<EventPrice> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_prices ( \
                eventPriceTitle, eventPriceContent \
            ) VALUES ( \
                ?, ? \
            )",
            [
                eventPrice.eventPriceTitle,
                eventPrice.eventPriceContent
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventPriceId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventPrice[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_prices \
             ORDER BY eventPriceTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventPrice, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventPrice> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventPrice> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_prices \
             WHERE eventPriceId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventPriceId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventPrice, rows[0], cleanOptions));
    }


    // U

    public static async update(eventPrice: EventPrice): Promise<EventPrice> {
        return this.validate(eventPrice).then(
            _ => this.updateDB(eventPrice)
        );
    }

    private static async updateDB(eventPrice: EventPrice): Promise<EventPrice> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_prices \
             SET eventPriceTitle = ?, \
                 eventPriceContent = ? \
             WHERE eventPriceId = ?",
            [
                eventPrice.eventPriceTitle,
                eventPrice.eventPriceContent,
                eventPrice.eventPriceId
            ]
        );

        return this.getById(eventPrice.eventPriceId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_prices \
             WHERE eventPriceId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPrice_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventPrice: EventPrice, withId: boolean = true): Promise<void> {
        return this.validateId(eventPrice.eventPriceId, withId)
            .then(() => this.validateTitle(eventPrice)
            .then(() => this.validateContent(eventPrice.eventPriceContent)
        ));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPriceId_invalid
            ));
    }

    private static async validateTitle(eventPrice: EventPrice): Promise<void> {
        if (!eventPrice.eventPriceTitle
            || eventPrice.eventPriceTitle.length <= 0
            || eventPrice.eventPriceTitle.length > EventPriceController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventPriceTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_prices \
             WHERE eventPriceTitle = ?",
             [eventPrice.eventPriceTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventPrice.eventPriceId !== (rows[0] as EventPrice).eventPriceId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPriceTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateContent(content: string): Promise<void> {
        if (!content
            || content.length <= 0
            || content.length > EventPriceController.CONTENT_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPriceContent_invalid
            ));
        }

        return Promise.resolve();
    }

}