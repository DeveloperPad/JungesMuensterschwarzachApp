import appConfig from 'static-content/js/app.json';
import mapboxConfig from 'static-content/js/mapbox.json';

interface IConfig {
    BaseUrls: {
        APP: string;
        CONTACT_LINK: string;
        WEBSERVICE: string;
    },
    MapConfig: {
        key: string;
    },
    PNConfig: {
        SERVER_PUB: string;
    }
}

export class ConfigService {

    private static config: IConfig | undefined;

    public static getConfig(): IConfig {
        if (this.config === undefined) {
            this.config = {
                BaseUrls: appConfig.BaseUrls,
                MapConfig: mapboxConfig,
                PNConfig: appConfig.PNConfig
            };
        }

        return this.config;
    }

}