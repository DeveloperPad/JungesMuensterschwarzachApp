import { plainToClass } from 'class-transformer';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { EventTargetGroup } from 'models/EventTargetGroup';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class EventTargetGroupController {

    private static TITLE_LENGTH_MAX: number = 100;
    private static CONTENT_LENGTH_MAX: number = 65535;


    // C

    public static async create(eventTargetGroup: EventTargetGroup): Promise<EventTargetGroup> {
        return this.validate(eventTargetGroup, false).then(
            _ => this.createDB(eventTargetGroup)
        );
    }

    private static async createDB(eventTargetGroup: EventTargetGroup): Promise<EventTargetGroup> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO event_target_groups ( \
                eventTargetGroupTitle, eventTargetGroupContent \
            ) VALUES ( \
                ?, ? \
            )",
            [
                eventTargetGroup.eventTargetGroupTitle,
                eventTargetGroup.eventTargetGroupContent
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventTargetGroupId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<EventTargetGroup[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM event_target_groups \
             ORDER BY eventTargetGroupTitle"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(EventTargetGroup, row, cleanOptions);
            })
        );
    }

    public static async getById(id: number): Promise<EventTargetGroup> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<EventTargetGroup> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_target_groups \
             WHERE eventTargetGroupId = ?",
             [id]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.event_eventTargetGroupId_invalid
            ));
        }

        return Promise.resolve(plainToClass(EventTargetGroup, rows[0], cleanOptions));
    }


    // U

    public static async update(eventTargetGroup: EventTargetGroup): Promise<EventTargetGroup> {
        return this.validate(eventTargetGroup).then(
            _ => this.updateDB(eventTargetGroup)
        );
    }

    private static async updateDB(eventTargetGroup: EventTargetGroup): Promise<EventTargetGroup> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE event_target_groups \
             SET eventTargetGroupTitle = ?, \
                 eventTargetGroupContent = ? \
             WHERE eventTargetGroupId = ?",
            [
                eventTargetGroup.eventTargetGroupTitle,
                eventTargetGroup.eventTargetGroupContent,
                eventTargetGroup.eventTargetGroupId
            ]
        );

        return this.getById(eventTargetGroup.eventTargetGroupId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM event_target_groups \
             WHERE eventTargetGroupId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventTargetGroup_in_usage
            ))
        );
    }


    // Helpers

    private static async validate(eventTargetGroup: EventTargetGroup, withId: boolean = true): Promise<void> {
        return this.validateId(eventTargetGroup.eventTargetGroupId, withId)
            .then(() => this.validateTitle(eventTargetGroup)
            .then(() => this.validateContent(eventTargetGroup.eventTargetGroupContent)
        ));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventTargetGroupId_invalid
            ));
    }

    private static async validateTitle(eventTargetGroup: EventTargetGroup): Promise<void> {
        if (!eventTargetGroup.eventTargetGroupTitle
            || eventTargetGroup.eventTargetGroupTitle.length <= 0
            || eventTargetGroup.eventTargetGroupTitle.length > EventTargetGroupController.TITLE_LENGTH_MAX) {
                return Promise.reject(new Error(
                    DictionaryKeys.error_type_storage,
                    DictionaryKeys.event_eventTargetGroupTitle_invalid
                ));
        }
        
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM event_target_groups \
             WHERE eventTargetGroupTitle = ?",
             [eventTargetGroup.eventTargetGroupTitle]
        );
        
        if (!Array.isArray(rows) 
            || (rows.length > 0 && eventTargetGroup.eventTargetGroupId !== (rows[0] as EventTargetGroup).eventTargetGroupId)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventTargetGroupTitle_taken
            ));
        }

        return Promise.resolve();
    }

    private static async validateContent(content: string): Promise<void> {
        if (!content
            || content.length <= 0
            || content.length > EventTargetGroupController.CONTENT_LENGTH_MAX) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventTargetGroupContent_invalid
            ));
        }

        return Promise.resolve();
    }

}