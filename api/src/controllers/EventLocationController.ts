import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventLocation } from 'models/EventLocation';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventLocationController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static LATITUDE_MAX: number = 90;
    private static LATITUDE_MIN: number = -90;
    private static LONGITUDE_MAX: number = 180;
    private static LONGITUDE_MIN: number = -180;


    // C

    public static async create(eventLocation: EventLocation): Promise<EventLocation> {
        return this.validate(eventLocation, false).then(
            _ => this.createDB(eventLocation)
        );
    }

    private static async createDB(eventLocation: EventLocation): Promise<EventLocation> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_locations ( \
                eventLocationTitle, eventLocationLatitude, eventLocationLongitude \
            ) VALUES ( \
                ?, ?, ? \
            )",
            [
                eventLocation.eventLocationTitle,
                eventLocation.eventLocationLatitude,
                eventLocation.eventLocationLongitude
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventLocationId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventLocation[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_locations \
             ORDER BY eventLocationTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventLocation, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventLocation> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventLocation> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_locations \
             WHERE eventLocationId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventLocationId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventLocation, rows[0], cleanOptions));
    }


    // U

    public static async update(eventLocation: EventLocation): Promise<EventLocation> {
        return this.validate(eventLocation).then(
            _ => this.updateDB(eventLocation)
        );
    }

    private static async updateDB(eventLocation: EventLocation): Promise<EventLocation> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_locations \
             SET eventLocationTitle = ?, \
                 eventLocationLatitude = ?, \
                 eventLocationLongitude = ? \
             WHERE eventLocationId = ?",
            [
                eventLocation.eventLocationTitle,
                eventLocation.eventLocationLatitude,
                eventLocation.eventLocationLongitude,
                eventLocation.eventLocationId
            ]
        );

        return this.getById(eventLocation.eventLocationId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_locations \
             WHERE eventLocationId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventLocation_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventLocation: EventLocation, withId: boolean = true): Promise<void> {
        return this.validateId(eventLocation.eventLocationId, withId)
            .then(() => this.validateTitle(eventLocation)
            .then(() => this.validateLatitude(eventLocation.eventLocationLatitude)
            .then(() => this.validateLongitude(eventLocation.eventLocationLongitude)
        )));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventLocationId_invalid
            ));
    }

    private static async validateTitle(eventLocation: EventLocation): Promise<void> {
        if (!eventLocation.eventLocationTitle
            || eventLocation.eventLocationTitle.length <= 0
            || eventLocation.eventLocationTitle.length > EventLocationController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventLocationTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_locations \
             WHERE eventLocationTitle = ?",
             [eventLocation.eventLocationTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventLocation.eventLocationId !== (rows[0] as EventLocation).eventLocationId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventLocationTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateLatitude(latitude: number): Promise<void> {
        return EventLocationController.LATITUDE_MIN <= latitude
                && latitude <= EventLocationController.LATITUDE_MAX ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventLocationLatitude_invalid
            ));
    }
    
    private static async validateLongitude(longitude: number): Promise<void> {
        return EventLocationController.LONGITUDE_MIN <= longitude
                && longitude <= EventLocationController.LONGITUDE_MAX ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventLocationLongitude_invalid
            ));
    }

}