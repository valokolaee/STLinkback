import { IUser } from "../models/user.model";
import { IWithdrawalRequest } from "../models/withdrawal-request.model";


export default interface IWithdrawalRequestWithUser extends IWithdrawalRequest {
  user?: IUser;
}