import axios from 'axios';
import { logoutEvent, storeKeys } from '../../common';
import { TargetConfig } from '../../TargetConfig';
import { getData, removeData } from '../../Helpers/StorageHelper';

class API {
    constructor() {
        axios.defaults.baseURL = TargetConfig.APP_CONFIG_URL;

        axios.interceptors.request.use(
            async (config: any) => {
                const token = await getData(storeKeys.sessionToken);
                const item = { ...config };
                if (token) {
                    item.headers.Authorization = `Bearer ${token}`;
                }
                return item;
            },
            (error: any) => Promise.reject(error),
        );

        axios.interceptors.response.use(
            (responseInter: any) => responseInter,
            async (error: any) => {
                if (error?.response?.status === 401) {
                    await this.logout();
                }
                return Promise.reject(error);
            },
        );
    }

    logout = async () => {
        await removeData(storeKeys.sessionToken);
        logoutEvent.emit('logout');
    };

    async get(url: string) {
        return axios.get(url);
    }

    async getFilter(url: string, data?: any) {
        return axios.get(url, data);
    }

    async post(url: string, data?: any) {
        return axios.post(url, data);
    }

    async postDocs(url: string, data?: any) {
        return axios.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async put(url: string, data?: any) {
        return axios.put(url, data);
    }

    async delete(url: string) {
        return axios.delete(url);
    }
}

export default new API();
