import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventPackingList } from 'models/EventPackingList';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventPackingListController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static CONTENT_LENGTH_MAX: number = 65535;


    // C

    public static async create(eventPackingList: EventPackingList): Promise<EventPackingList> {
        return this.validate(eventPackingList, false).then(
            _ => this.createDB(eventPackingList)
        );
    }

    private static async createDB(eventPackingList: EventPackingList): Promise<EventPackingList> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_packing_lists ( \
                eventPackingListTitle, eventPackingListContent \
            ) VALUES ( \
                ?, ? \
            )",
            [
                eventPackingList.eventPackingListTitle,
                eventPackingList.eventPackingListContent
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventPackingListId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventPackingList[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_packing_lists \
             ORDER BY eventPackingListTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventPackingList, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventPackingList> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventPackingList> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_packing_lists \
             WHERE eventPackingListId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventPackingListId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventPackingList, rows[0], cleanOptions));
    }


    // U

    public static async update(eventPackingList: EventPackingList): Promise<EventPackingList> {
        return this.validate(eventPackingList).then(
            _ => this.updateDB(eventPackingList)
        );
    }

    private static async updateDB(eventPackingList: EventPackingList): Promise<EventPackingList> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_packing_lists \
             SET eventPackingListTitle = ?, \
                 eventPackingListContent = ? \
             WHERE eventPackingListId = ?",
            [
                eventPackingList.eventPackingListTitle,
                eventPackingList.eventPackingListContent,
                eventPackingList.eventPackingListId
            ]
        );

        return this.getById(eventPackingList.eventPackingListId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_packing_lists \
             WHERE eventPackingListId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPackingList_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventPackingList: EventPackingList, withId: boolean = true): Promise<void> {
        return this.validateId(eventPackingList.eventPackingListId, withId)
            .then(() => this.validateTitle(eventPackingList)
            .then(() => this.validateContent(eventPackingList.eventPackingListContent)
        ));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPackingListId_invalid
            ));
    }

    private static async validateTitle(eventPackingList: EventPackingList): Promise<void> {
        if (!eventPackingList.eventPackingListTitle
            || eventPackingList.eventPackingListTitle.length <= 0
            || eventPackingList.eventPackingListTitle.length > EventPackingListController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventPackingListTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_packing_lists \
             WHERE eventPackingListTitle = ?",
             [eventPackingList.eventPackingListTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventPackingList.eventPackingListId !== (rows[0] as EventPackingList).eventPackingListId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPackingListTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateContent(content: string): Promise<void> {
        if (!content
            || content.length <= 0
            || content.length > EventPackingListController.CONTENT_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventPackingListContent_invalid
            ));
        }

        return Promise.resolve();
    }

}