import axios, { CancelTokenSource } from 'axios';
import qs from 'qs';

import { WebserviceUrls } from '../constants/specific-urls';
import { ConfigService } from '../services/ConfigService';

export default class Request {

    private urlSuffix: WebserviceUrls;
    private params: object;
    private successCallback: (response: any) => void;
    private errorCallback: (error: any) => void;

    private axiosSource: CancelTokenSource | undefined;

    constructor(urlSuffix: WebserviceUrls,
        params: object,
        successCallback: (response: any) => void,
        errorCallback: (error: any) => void) {

        this.urlSuffix = urlSuffix;
        this.params = params;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
    }

    public execute = (): Promise<void> => {
        if (this.axiosSource) {
            // request already executed
            return Promise.resolve();
        }

        this.axiosSource = axios.CancelToken.source();

        // replace null values by "null", as null cannot be transmitted
        // const params = this.params;
        // Object.keys(params).forEach(prop => {
            // if (params[prop] === null) {
                // params[prop] = "null";
            // }
        // });

        return axios({
            cancelToken: this.axiosSource.token,
            data: this.params,
            method: "POST",
            transformRequest: [(data, headers) => {
                return qs.stringify(data, { strictNullHandling: true });
            }],
            url: ConfigService.getConfig().BaseUrls.WEBSERVICE + this.urlSuffix,
            withCredentials: true
        })
        .then(response => response.data)
        .then(this.successCallback)
        .catch(this.errorCallback);
    }

    public cancel = (): void => {
        if (this.axiosSource) {
            this.axiosSource.cancel();
        }
    }

}

export interface IResponse {

    successMsg: string;
    errorMsg: string;

}