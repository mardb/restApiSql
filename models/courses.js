'use strict';
const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const users = require('./users');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" is required.',
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Description" is required.',
          },
        },
      },

      estimatedTime: {
        type: DataTypes.STRING,
      },

      materialsNeeded: {
        type: DataTypes.STRING,
      },

      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { sequelize }
  );

  Course.associate = (models) => {
    //associations
    Course.belongsTo(models.User, {
      as: 'user', //alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  return Course;
};
