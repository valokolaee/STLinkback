import { Response } from "express";
import IResponse from "../interfaces/IResponse";
import errorHandlerUtils from "./errorHandler.utils";

export default (res: Response, status: number, body?: IResponse<any>, error?: any) => {

    if (error !== undefined) {

        errorHandlerUtils(error)
    }

    return res.status(status).json(body)
}