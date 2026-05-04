import { IUser } from '../models/user.model';
import IRequest from '../interfaces/IRequest';
import { ICustomer } from '../models/customer.model';
import { IAgent } from '../models/agent.model';
 
export default (req: IRequest) =>  req!?.user!.get({ plain: true })
