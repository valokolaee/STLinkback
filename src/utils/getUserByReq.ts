// src/controllers/auth.controller.ts
import { Response } from 'express';
import { IUser } from '../models/user.model';
import IRequest from '../interfaces/IRequest';
 


export default (req: IRequest): IUser =>  req!?.user!.get({ plain: true })
