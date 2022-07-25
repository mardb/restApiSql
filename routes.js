'use strict';
const express = require('express');

// Construct a router instance.
const router = express.Router();
// as they are created.
const { User, Course } = require('./models');
const {asyncHandler} = require('./middleware/async-handler')
const { authenticateUser } = require('./middleware/auth-user');

//USER
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
    });
  })
);

// creates a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post(
  '/users',
  // authenticateUser,
  asyncHandler(async (req, res) => {
    //   // Get the user from the request body.

    try {
      await User.create(req.body)
      // Set the status to 201 Created and end the response.
      // res.status(201).end();
      res.status(201).location('/').json({ messsage: 'Account successfully created!' }).end();
    } catch (error) {
      console.log('Error: ', error.name);
      // Validate that we have a `name` value.
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
// Route that creates a new user.

//COURSES

//  returns all courses including the User associated with each course and a 200 HTTP status code.
router.get( '/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll()
    //TODO: include the User associated with each course
    res.status(200).json({courses})
  })
);

// return the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findOne()
   //TODO: include the User associated with each course
  res.status(200).json({course})
}));

// create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses/', authenticateUser, asyncHandler(async(req, res) => {
  try{

const course = await Course.create(req.body);
  res.status(201).set('Location', `courses/${course.id}`).end();
} catch(error){
  //if else 
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
}));

//updates the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser ,asyncHandler(async (req, res) => {
  try{
  const course = await Course.findByPk(req.params.id);
  await course.update(req.body);
  res.status(204).end()
  } catch(error){
    //if else 
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
}));

//deletes the corresponding course - returns a 204 HTTP status code and no content.
router.delete('/courses/:id', asyncHandler, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  if(course.userId === req.currentUser.id){
    await course.destroy(req.body)
    res.status(204).end()
  } else{
    res.status(404).json({message:'Course not found.'}).end()
  }


}));

module.exports = router;
