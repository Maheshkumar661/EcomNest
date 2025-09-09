
import { getStringForKey, keys } from '../../modules/Strings';
import API from '../Api/index'


const handleApiCall = async (apiCall: () => Promise<any>, callback: (status: boolean, result: any) => void) => {
    try {
        const response = await apiCall();
        if (response?.data) {
            callback(true, response.data);
        } else {
            callback(false, response);
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message ?? getStringForKey(keys.kSomethingWrong);
        callback(false, errorMessage);
    }
};

class ProductStore {
    getProductList = async (data: any, callback: (status: boolean, result: any) => void) => {
        await handleApiCall(() => API.get('c53fb45e-5085-487a-afac-0295f62fb86e'), callback);
    };

}

const productStore = new ProductStore();
export default productStore;