import { DataTypes, Model } from "sequelize";
import { db } from "../config";

export interface FoodAttributes {
  id: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyType: number;
  price: string;
  rating: number;
  vendorID: string;
  image: string
}

export class FoodInstance extends Model<FoodAttributes> {}

FoodInstance.init({
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foodType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    readyType: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    rating: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    vendorID: {
      type: DataTypes.UUIDV4,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize: db,
    tableName: "food",
  }
);
