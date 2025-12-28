import { IRole } from "../models/role.model";

 const admin: IRole = { name: 'admin' };
      const agent: IRole = { name: 'agent' };
      const user: IRole = { name: 'user' };
      const customer: IRole = { name: 'customer' };
      

export const agentRoles= [  admin, agent, user,];
export const customerRoles = [customer ];

export default [...customerRoles, ...agentRoles];
