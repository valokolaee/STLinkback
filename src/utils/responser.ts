import { Response } from "express";
import IResponse from "../interfaces/IResponse";

export default (res: Response, status:number,body?:IResponse<any>) => res.status(status).json(body)