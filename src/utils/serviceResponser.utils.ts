import IServiceResult from "../interfaces/IServiceResult";
import errorHandlerUtils from "./errorHandler.utils";

export default (res: IServiceResult<any>, error?: any) => {
    
    errorHandlerUtils(error)
    return res
}