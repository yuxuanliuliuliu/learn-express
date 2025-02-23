import express, { Response, NextFunction, Request } from 'express';
import  { promises as fsPromises } from 'fs';
import path from 'path';

const router = express.Router()
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

readUsersFile();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use('/adduser', addMsgToRequest);

router.post('/adduser', async (req: UserRequest, res: Response) => {
  try {
    let newuser = req.body as User;
    users.push(newuser);
    
    await fsPromises.writeFile(
      path.resolve(__dirname, dataFile), 
      JSON.stringify(users)
    );
    
    console.log('User Saved');
    res.send('done');
  } catch (err) {
    console.log('Failed to write:', err);
    res.status(500).send('Error saving user');
  }
});



export default router