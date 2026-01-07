import { WhereOptions } from 'sequelize';


export default <T>(filters: WhereOptions<T>): WhereOptions<T> => {

  const where: Partial<T> = {};

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof WhereOptions<T>];
    if (value !== undefined && value !== null) {
      where[key as keyof T] = value;
    }
  });

  return where as WhereOptions;
}