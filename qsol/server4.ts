import  { promises as fsPromises } from 'fs';
import path from 'path';
import express, { Response, NextFunction } from 'express';
import cors from 'cors';
import { User, UserRequest } from './types';
import readUsers from './readUsers';
import writeUsers from './writeUsers';

const app = express();
const port = 8000;
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

app.use(
  cors({origin: 'http://localhost:3000'})
);
app.use(addMsgToRequest);

app.use('/read', readUsers);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write', writeUsers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
