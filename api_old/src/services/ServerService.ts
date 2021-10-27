/* tslint:disable no-console */
import * as bodyParser from 'body-parser';
import { config } from 'config';
import * as express from 'express';
import { Server } from 'http';
import * as nodemailer from 'nodemailer';
import { initializeAccountDataRoutes } from 'src/routes/AccountDataRoutes';
import { initializeAccountTokenDirectRoutes } from 'src/routes/AccountTokenDirectRoutes';
import { initializeAccountTokenMailRoutes } from 'src/routes/AccountTokenMailRoutes';
import { initializeEventArrivalRoutes } from 'src/routes/EventArrivalRoutes';
import { initializeEventEnrollmentRoutes } from 'src/routes/EventEnrollmentRoutes';
import { initializeEventLocationRoutes } from 'src/routes/EventLocationRoutes';
import { initializeEventOfferRoutes } from 'src/routes/EventOfferRoutes';
import { initializeEventPackingListRoutes } from 'src/routes/EventPackingListRoutes';
import { initializeEventPriceRoutes } from 'src/routes/EventPriceRoutes';
import { initializeEventRoutes } from 'src/routes/EventRoutes';
import { initializeEventScheduleRoutes } from 'src/routes/EventScheduleRoutes';
import { initializeEventTargetGroupRoutes } from 'src/routes/EventTargetGroupRoutes';
import { initializeUUIDRoutes } from 'src/routes/UUIDRoutes';
import { MailService } from 'src/services/MailService';

export class ServerService {

    private static instance: ServerService;
    private server: Server;

    private constructor() {}

    public static getInstance = (): ServerService => {
        if (!ServerService.instance) {
            ServerService.instance = new ServerService();
        }

        return ServerService.instance;
    }

    public restart = (): void => {
        if (this.server) {
            this.server.close();
        }

        const app = express();

        this.initializeErrorHandling(app);
        this.activateURLEncoding(app);
        this.initializeRoutes(app);

        this.testEMailServerConnection();

        this.server = app.listen(config.web.port, () => {
            console.log("[API] Server listening on port: " + config.web.port);
        });
    }

    private initializeErrorHandling = (app: express.Application): void => {
        app.use((err: any, req: express.Request, res: express.Response, next: any) => {
            console.error(err.stack);
            res.status(500).send(err.stack);
        });
    }

    private activateURLEncoding = (app: express.Application): void => {
        app.use(
            bodyParser.json()
        );
    }

    private initializeRoutes = (app: express.Application): void => {
        initializeAccountDataRoutes(app);
        initializeAccountTokenDirectRoutes(app);
        initializeAccountTokenMailRoutes(app);
        initializeEventRoutes(app);
        initializeEventArrivalRoutes(app);
        initializeEventEnrollmentRoutes(app);
        initializeEventLocationRoutes(app);
        initializeEventOfferRoutes(app);
        initializeEventPackingListRoutes(app);
        initializeEventPriceRoutes(app);
        initializeEventScheduleRoutes(app);
        initializeEventTargetGroupRoutes(app);
        initializeUUIDRoutes(app);
    }

    private async testEMailServerConnection(): Promise<void> {
        if (!config.mail.active) {
            return Promise.resolve();
        }

        try {
            await MailService.verifyConnection();
            console.log("[EMail] Server connected on port: " + config.mail.port);
        } catch (exc) {
            console.error("[EMail] Server connection not possible:");
            console.error(exc);
        }
    }

}