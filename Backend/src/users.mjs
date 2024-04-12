'use strict'

const users = [
    {
      id: 1,
      username: "johndoe",
      password: "password1",
      email: "johndoe@example.com"
    },
    {
      id: 2,
      username: "janedoe",
      password: "password2",
      email: "janedoe@example.com"
    },
    {
      id: 3,
      username: "bobsmith",
      password: "password3",
      email: "bobsmith@example.com"
    }
  ];

  // TODO: implement route handlers below for users

  const getUsers = (req, res) => {
    res.json(users);
  };

  const getUserById = (req, res) => {
    const userFound = users.find(user => user.id == req.params.id);
    if (userFound) {
      res.json(userFound);
    } else {
      res.status(404).json({error: 'User not found'});
    }
  };

  const postUser = (req, res) => {
    const newUser = req.body;

    // error handling
    if (!newUser.username || !newUser.password || !newUser.email) {
        return res.status(400).json({error: 'Missing required fields'});
      }

    // generating a new user
    const newUserId = users.length + 1;

    // add new user to array
    const user = {
        id: newUserId,
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
    };

    users.push(user);

    res.status(201).json(user);
  };


// // TODO: implement modify item
// const index = items.findIndex(item => item.id == req.params.id);
// // not found
// if (index === -1) {
//   return res.sendStatus(404);
// }
// // bad request
// if (!req.body.name) {
//   return res.status(400).json({error: "item name missing"});
// }
// items[index].name = req.body.name;
// res.json({updated_item: items[index]});

  const putUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const index = users.findIndex(user => user.id === userId);

    // not found
    if (index === -1) {
        return res.sendStatus(404);
    }

    // bad request
    if (!updatedUser.username || !updatedUser.password || !updatedUser.email) {
        return res.status(400).json({error: 'missing required fields'});
      }

    // update the user
    users[Index] = {
        id: userId,
        username: updatedUser.username,
        password: updatedUser.password,
        email: updatedUser.email,
      };

    res.json(users[index]);
  };

  // Dummy login, returns user object if username & password match
  const postLogin = (req, res) => {
    const userCreds = req.body;
    if (!userCreds.username || !userCreds.password) {
      return res.sendStatus(400);
    }
    const userFound = users.find(user => user.username == userCreds.username);
    // user not found
    if (!userFound) {
      return res.status(403).json({error: 'username/password invalid'});
    }
    // check if posted password matches to user found password
    if (userFound.password === userCreds.password) {
      res.json({message: 'logged in successfully', user: userFound});
    } else {
      return res.status(403).json({error: 'username/password invalid'});
    }
  };

  export {getUsers, getUserById, postUser, putUser, postLogin};
