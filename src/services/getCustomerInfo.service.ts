import Customer from '../db/models/customer.model';
import UserWallet from '../db/models/user-wallet.model';
import User, { IUser } from '../db/models/user.model';
import isValidEmail from '../utils/isValidEmail';


export default async (data: any) => {
  const { email, password } = data;

  var where = {};

  if (isValidEmail(email)) {
    where = { email };
  } else {
    where = { username: email };
  }

  const user: IUser | null = await User.findOne({
    where,
    include: [
      {
        model: Customer,
        as: 'customer',
        // include: [{
        //   model: UserWallet,
        //   as: 'defaultWallet'
        // }]
      }]
  });


  return user //!.get({ plain: true });
}

