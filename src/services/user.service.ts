// src/services/user.service.ts
import { models } from '../db';

export class UserService {
  /**
   * @param userId 
   * @param profileImage 
   */
  static async updateProfileImage(userId: number, profileImage: string): Promise<boolean> {
    try {
      const result = await models.User.update(
        { profileImage },
        { where: { id: userId } }
      );

      if (result[0] === 0) {
        console.log('❌ User not found');
        return false;
      }

      console.log(`✅ Profile image updated for user ${userId}`);
      return true;

    } catch (error) {
      console.error('❌ Error updating profile image:', error);
      return false;
    }
  }

  /**
   * @param userId 
   */
  static async getUserById(userId: number) {
    try {
      const user = await models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'profileImage', 'clientType', 'roleId']
      });

      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }
  
  /**
   * @param username 
   */
  static async getUserByEmail(email: string) {
    try {
      const user = await models.User.findOne({ where: { email }}) 

      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }
  /**
   * @param username 
   */
  static async getUserByUserName(username: string) {
    try {
      const user = await models.User.findOne({ where: { username }}) 

      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }
  /**
   * @param userId 
   */
  static async getUserInvestmentsById(userId: number) {
    try {
      const user = await models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'profileImage', 'clientType', 'roleId']
      });
      return []//'investments under construction'
      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }
  
  
  /**
   * @param userId 
   */
  static async getUserReferralsById(userId: number) {
    try {
      const user = await models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'profileImage', 'clientType', 'roleId']
      });
      return 'referrals under construction'
      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  /**
   * @param userId 
   */
  static async getUserLoansById(userId: number) {
    try {
      const user = await models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'profileImage', 'clientType', 'roleId']
      });
      return 'Loans under construction'
      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }


  /**
   * @param userId 
   */
  static async getBankAffiliations(userId: number) {
    try {
      const user = await models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'profileImage', 'clientType', 'roleId']
      });
      return 'bankAffiliations under construction'
      return user;

    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  /**
   * @param userId 
   * @param updateData 
   */
  static async updateUser(userId: number, updateData: Partial<User>) {
    try {
      const result = await models.User.update(updateData, {
        where: { id: userId }
      });

      return result[0] > 0;

    } catch (error) {
      console.error('❌ Error updating user:', error);
      return false;
    }
  }
}

interface User {
  id?: number;
  username?: string;
  email?: string;
  profileImage?: string;
  logoUrl?: string;
  clientType?: 'individual' | 'financial_entities' | 'business';
  roleId?: number;
}