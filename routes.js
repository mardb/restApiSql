'use strict';
const express = require('express');
// Construct a router instance.
const router = express.Router();
// as they are created.
const {User, Course} = require('./models')



function asyncHandler(cb){
  return async(req, res, next) => {
    try{
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}
//USER
//  returns all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get('/users',asyncHandler( async(req, res) => {
// try{
  const user = req.currentUser
  await User.findAll()
  res.status(200).json(user
    // {
      // id: user.id,
      // firstName: user.firstName,
      // lastName: user.lastName,
      // emailAddress: user.emailAddress
  // }
  );
// }catch(err){
//   throw err
// }
}));

// creates a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/users', asyncHandler(async(req, res) => {
//   // Get the user from the request body.

  try{
    
  const user = await User.create(req.body)
  res.status(201).end()

//     // Set the status to 201 Created and end the response.
    res.status(201).end();

} catch(err){
  // Validate that we have a `name` value.
  if (!user.name) { 
    errors.push('Please provide a value for "name"');
  }

  // Validate that we have an `email` value.
  if (!user.email) { 
    errors.push('Please provide a value for "email"');
  } 

  // Validate that we have a `password` value.
  if (!user.password) {
    errors.push('Please provide a value for "password"');
  }

 
  }



}));
// Route that creates a new user.


//COURSES

//  returns all courses including the User associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async(req, res) => {
  res.json(users);
}));
// return the corresponding course including the User associated with that course and a 200 HTTP status code.
// router.get('/courses/:id', asyncHandler(async(req, res) => {
//   res.json(users);
// }));

// create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
// router.post('/courses/', asyncHandler(async(req, res) => {
//   res.json(users);
// }));

//updates the corresponding course and return a 204 HTTP status code and no content.
// router.put('/courses/:id',asyncHandler(async (req, res) => {
//   res.json(users);
// }));
//deletes the corresponding course - returns a 204 HTTP status code and no content.
// router.delete('/courses/:id', asyncHandler(async(req, res) => {
//   res.json(users);
// }));


module.exports = router;