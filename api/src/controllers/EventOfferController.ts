import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventOffer } from 'models/EventOffer';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventOfferController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static CONTENT_LENGTH_MAX: number = 65535;


    // C

    public static async create(eventOffer: EventOffer): Promise<EventOffer> {
        return this.validate(eventOffer, false).then(
            _ => this.createDB(eventOffer)
        );
    }

    private static async createDB(eventOffer: EventOffer): Promise<EventOffer> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_offers ( \
                eventOfferTitle, eventOfferContent \
            ) VALUES ( \
                ?, ? \
            )",
            [
                eventOffer.eventOfferTitle,
                eventOffer.eventOfferContent
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventOfferId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventOffer[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_offers \
             ORDER BY eventOfferTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventOffer, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventOffer> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventOffer> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_offers \
             WHERE eventOfferId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventOfferId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventOffer, rows[0], cleanOptions));
    }


    // U

    public static async update(eventOffer: EventOffer): Promise<EventOffer> {
        return this.validate(eventOffer).then(
            _ => this.updateDB(eventOffer)
        );
    }

    private static async updateDB(eventOffer: EventOffer): Promise<EventOffer> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_offers \
             SET eventOfferTitle = ?, \
                 eventOfferContent = ? \
             WHERE eventOfferId = ?",
            [
                eventOffer.eventOfferTitle,
                eventOffer.eventOfferContent,
                eventOffer.eventOfferId
            ]
        );

        return this.getById(eventOffer.eventOfferId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_offers \
             WHERE eventOfferId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventOffer_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventOffer: EventOffer, withId: boolean = true): Promise<void> {
        return this.validateId(eventOffer.eventOfferId, withId)
            .then(() => this.validateTitle(eventOffer)
            .then(() => this.validateContent(eventOffer.eventOfferContent)
        ));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventOfferId_invalid
            ));
    }

    private static async validateTitle(eventOffer: EventOffer): Promise<void> {
        if (!eventOffer.eventOfferTitle
            || eventOffer.eventOfferTitle.length <= 0
            || eventOffer.eventOfferTitle.length > EventOfferController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventOfferTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_offers \
             WHERE eventOfferTitle = ?",
             [eventOffer.eventOfferTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventOffer.eventOfferId !== (rows[0] as EventOffer).eventOfferId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventOfferTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateContent(content: string): Promise<void> {
        if (!content
            || content.length <= 0
            || content.length > EventOfferController.CONTENT_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventOfferContent_invalid
            ));
        }

        return Promise.resolve();
    }

}