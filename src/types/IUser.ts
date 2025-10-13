import User from "../models/user.model";

export default interface IUser extends User {
    token?: string;
}