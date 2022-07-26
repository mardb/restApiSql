'use strict';
const express = require('express');

// Construct a router instance.
const router = express.Router();
// as they are created.
const { User, Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');
const bcrypt = require('bcryptjs/dist/bcrypt');

//  returns all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      attributes: {
        include: ['id', 'firstName', 'lastName', 'emailAddress'],
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  })
);

// creates a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post(
  '/users',
  asyncHandler(async (req, res) => {
    // Get the user from the request body.
    try {
      const user = req.body;
      await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,

        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              include: ['id', 'firstName', 'lastName', 'emailAddress'],
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      });
      res
        .status(201)
        .location('/')
        .json({ message: 'Account successfully created!' })
        .end();
    } catch (error) {
      console.log('Error: ', error.name);
      // Validates that we have a `name` value.
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstrainError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//  returns all courses including the User associated with each course and a 200 HTTP status code.
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    res.status(200).json({ courses });
  })
);

// returns the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        },
      ],
    });

    res.status(200).json({ course });
  })
);

// creates a new course, sets the Location header to the URI for the newly created course, and returns a 201 HTTP status code and no content.
router.post(
  '/courses/',
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).location(`courses/${course.id}`).end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstrainError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//updates the corresponding course and return a 204 HTTP status code and no content.
router.put(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstrainError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//deletes the corresponding course - returns a 204 HTTP status code and no content.
router.delete(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course.userId === req.currentUser.id) {
      await course.destroy(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Course not found.' }).end();
    }
  })
);

module.exports = router;
