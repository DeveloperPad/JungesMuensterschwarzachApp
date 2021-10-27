import { plainToClass } from 'class-transformer';
import { AccessLevel } from 'models/AccessLevel';
import { AccessLevels } from 'models/AccessLevels';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { RowDataPacket } from 'mysql2';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';

export class AccessLevelController {

    // C

    // R

    public static async getAll(): Promise<AccessLevel[]> {
        const [rows, fields] = await DatabaseController.getPool().query(
            "SELECT * \
             FROM access_levels \
             ORDER BY accessLevel"
        );

        return Promise.resolve(
            (rows as RowDataPacket[]).map((row: any) => {
                return plainToClass(AccessLevel, row, cleanOptions);
            })
        );
    }

    public static async getByAccessLevel(accessLevel: number): Promise<AccessLevel> {
        return this.validateAccessLevel(accessLevel)
            .then(_ => this.getByAccessLevelDB(accessLevel));
    }

    private static async getByAccessLevelDB(accessLevel: number): Promise<AccessLevel> {
        const [rows, fields] = await DatabaseController.getPool().execute(
            "SELECT * \
             FROM access_levels \
             WHERE accessLevel = ?",
             [accessLevel]
        );
        
        if (!Array.isArray(rows) || rows.length <= 0) {
            return Promise.reject(new Error(
                    DictionaryKeys.error_type_server,
                    DictionaryKeys.account_accessLevel_invalid
            ));
        }

        return Promise.resolve(plainToClass(AccessLevel, rows[0], cleanOptions));
    }

    // U

    // D

    // Helpers

    public static async validateAccessLevel(accessLevel: number): Promise<void> {
        const numericAccessLevel = parseInt(accessLevel.toString(), 10); // do not ask!

        return !isNaN(numericAccessLevel) && Object.values(AccessLevels)
                .filter(v => typeof v === "number")
                .includes(numericAccessLevel) ?
            Promise.resolve() : 
            Promise.reject(
                new Error(
                    DictionaryKeys.error_type_client,
                    DictionaryKeys.account_accessLevel_invalid
                )
            );
    }

}