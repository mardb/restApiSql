'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')

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
        validate: {
          notEmpty: {
            msg: 'Please provide your first name.',
          },
          notNull: {
            msg: '"First Name" is required.',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide your last name.',
          },
          notNull: {
            msg: '"Last Name" is required.',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg:'The email you entered already exists.'
        },
        validate: {
          notNull: {
            msg:  '"Email address" is required.'
          },
          isEmail:{  
            msg: 'Please provide a valid email address.', 
          }
        },
      },
      password: {
        // type: DataTypes.VIRTUAL,//sets a virtual field
        type: DataTypes.STRING,//sets a virtual field
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a password.',
          },
          notNull: {
            msg: '"Password" is required.',
          },
          len: {
            args:[8, 20],
            msg: 'The password should be between 8 and 20 characters in length.'
          }
        },
      },
      // confirmedPassword:{
      //   type:DataTypes.STRING,
      //   allowNull: false,
      //   set(val){
      //     if(val === this.password){
      //       const hashedPassword = bcrypt.hashSync(val, 10);
      //       this.setDataValue('confirmedPassword', hashedPassword);

      //     }
      //   },
      //   validate:{
      //     notNull: {
      //       msg: 'Both passwords must match'
      //     }
      //   }
      // }
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.associate = (models) => {
    //association
    User.hasMany(models.Course, {
      as: 'user', //alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};
