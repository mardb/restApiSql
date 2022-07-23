'use strict';
const { Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate:{
        notEmpty:{
          msg: '"First Name" is required.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
        allowNull: false, 
        validate:{
          notEmpty:{
            msg: '"Last Name" is required.'
          }
        }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate:{
        notEmpty:{
          msg: '"Email" is required.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: '"Password" is required.'
        }
    }
  }
},
  {
    sequelize,
    modelName: "User"
  }
)

User.associate = (models) => {
  //association
  User.hasMany(models.Course, {
    as: 'user',//alias
    foreignKey:{
        fieldName: 'userId',
        allowNull: false, 
    }
  });
};

 return User;
};