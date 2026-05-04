import { DataTypes, Model } from 'sequelize';

export default class Setting extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public value!: string;
  public softDeleted!: boolean;
  public createdAt!: Date;


  public static initModel(sequelize: any): typeof Setting {
    return Setting.init(
      {
        id: {
          type: DataTypes.INTEGER,// 'INT',
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),// 'VARCHAR(255)',
          allowNull: false,
          unique: true,
        },
        value: {
          type: DataTypes.STRING(255),// 'VARCHAR(255)',
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING(255),//'TEXT',
          allowNull: true,
        },
        softDeleted: {
          type: DataTypes.BOOLEAN,// 'BOOLEAN',
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          type: DataTypes.DATE,// 'DATETIME',
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        modelName: 'Setting',
        tableName: 'settings',
        timestamps: false,
      }
    );
  }

  public static associate(models: any) {


  }
}



export interface ISetting extends Partial<Setting> { }