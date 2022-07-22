'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate:{
          notEmpty:{
            msg: '"Title" is required.'
          }
        }
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate:{
          notEmpty:{
            msg: '"Description" is required.'
          }
        }
      },

      estimatedTime: {
        type: DataTypes.STRING,
      },

      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: false
      },

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

    }
  )


  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

};