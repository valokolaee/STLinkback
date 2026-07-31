import { IUser } from "../db/models/user.model";
import { IWithdrawalRequest } from "../db/models/withdrawal-request.model";


export default interface IWithdrawalRequestWithUser extends IWithdrawalRequest {
  user?: IUser;
}