import { IRole } from "../db/models/role.model";

const admin: IRole = { name: 'admin' };
const agent: IRole = { name: 'agent' };
const user: IRole = { name: 'user' };
export const client: IRole = { name: 'client' };


export const agentRoles = [admin, agent, user,];
export const clientRoles = [client];

export default [...clientRoles, ...agentRoles];
