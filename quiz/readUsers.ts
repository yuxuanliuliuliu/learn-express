import  { promises as fsPromises } from 'fs';
import express, { Response, NextFunction, Request } from 'express';
import path from 'path';

const router = express.Router();

/**
 * A type that represents a user object
 */
interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

/**
 * A type that represents the request received by the server
 */
interface UserRequest extends Request {
  users?: User[];
}
const dataFile = '../data/users.json';
let users: User[];

async function readUsersFile() {
  try {
    console.log('reading file ... ');
    const data = await fsPromises.readFile(path.resolve(__dirname, dataFile));
    users = JSON.parse(data.toString());
    console.log('File read successfully');
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

readUsersFile();

const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

router.use('/usernames', addMsgToRequest);
// read all users
router.get('/usernames', (req: UserRequest, res: Response) => {
  {
    let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
    });
    res.send(usernames)}
});

// read particular user
router.get('/username/:name', (req: UserRequest, res: Response) => {
  let name = req.params.name;
  let user_with_name = req.users?.filter(function(user) {
    return user.username ===name;
  })
  if (user_with_name?.length ===0){
    res.send({
      error: {message: `${name} not found`, status: 404}
    })
  }
  else{
    res.send(user_with_name)
  }
});

export default router