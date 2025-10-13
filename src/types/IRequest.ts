import { extend } from "joi";
import User from "../models/user.model";
import { Request, Response } from 'express';

export default interface IRequest<T = any> extends Request {
  user?: User;
  body: T;
}

export interface IResponse<T = any> extends Response {
  data: T
}