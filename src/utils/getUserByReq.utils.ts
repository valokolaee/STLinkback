import { IUser } from '../models/user.model';
import IRequest from '../interfaces/IRequest';
 
export default (req: IRequest): IUser =>  req!?.user!.get({ plain: true })
