import User, { IUser } from '../db/models/user.model';
import IRequest from '../interfaces/IRequest';
import { IClient } from '../db/models/client.model';
import { IAgent } from '../db/models/agent.model';

export default (req: IRequest): User | undefined => req!?.user