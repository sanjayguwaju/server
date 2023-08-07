const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');

// Create a new todo
router.post('/createusertodo', async (req, res) => {
  // Get user from access token
  const accessToken = req.headers.authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  // Create a new todo
  const todo = new Todo({
    userId,
    content: req.body.content, // The todo's content will be sent in the request body
    completed: false, // New todos are marked as not completed
  });

  try {
    // Save todo in the database
    const savedTodo = await todo.save();
    res.send(savedTodo);
  } catch (err) {
    // Error handling
    res.status(400).send(err);
  }
});

// Get user's todos
router.get('/getusertodo', async (req, res) => {
  // Get user from access token
  const accessToken = req.headers.authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  // Get todos
  const todos = await Todo.find({ userId });

  res.json(todos);
});

// Get a specific user's todo by ID
router.get('/getusertodo/:id', async (req, res) => {
  // Get user from access token
  const accessToken = req.headers.authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Find the todo by ID and user ID
    const todo = await Todo.findOne({ _id: req.params.id, userId });

    if (!todo) {
      return res.status(404).send('Todo not found');
    }

    res.json(todo);
  } catch (err) {
    // Error handling
    res.status(400).send(err);
  }
});


// Update a todo
router.put('/updateusertodo/:id', async (req, res) => {
  // Get user from access token
  const accessToken = req.headers.authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Update the todo
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }  // This option makes sure the function returns the updated todo
    );

    if (!updatedTodo) {
      return res.status(404).send('Todo not found');
    }

    res.send(updatedTodo);
  } catch (err) {
    // Error handling
    res.status(400).send(err);
  }
});

// Delete a todo
router.delete('/deleteusertodo/:id', async (req, res) => {
  // Get user from access token
  const accessToken = req.headers.authorization.split(' ')[1];
  const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Delete the todo
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId });

    if (!deletedTodo) {
      return res.status(404).send('Todo not found');
    }

    res.send(deletedTodo);
  } catch (err) {
    // Error handling
    res.status(400).send(err);
  }
});

module.exports = router;
