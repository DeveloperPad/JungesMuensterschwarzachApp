import * as express from 'express';
import { ApiRoutes } from 'models/Routes';
import { CryptoService } from 'src/services/CryptoService';

export function initializeUUIDRoutes(app: express.Application): void {

    // C

    // R
    app.get(ApiRoutes.UUID, (req: express.Request, res: express.Response) => {
        res.send(CryptoService.generateUUID());
    });

    // U

    // D
    
}