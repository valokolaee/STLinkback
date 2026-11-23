import IServiceResult from "../interfaces/IServiceResult";
import errorHandlerUtils from "./errorHandler.utils";

export default (res: IServiceResult<any>, error?: any):IServiceResult<any> => {
    if (error) {
        return {
            ok: false,
            message: errorHandlerUtils(error)?.response.message!
        }

    } else {
        return res
    }
}