import { config } from 'config';
import * as mysql from 'mysql2/promise';

export class DatabaseController {

    private static pool: mysql.Pool = mysql.createPool(config.database);
    
    public static getPool = (): mysql.Pool => {
        return DatabaseController.pool;
    }

}