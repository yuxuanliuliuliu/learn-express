import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface UserRequest extends Request {
  users?: User[];
}

const app = express();
const port = 8000;
const dataFile = '../data/users.json';

let users: User[];

fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log('reading file ... ');
  if (err) throw err;
  users = JSON.parse(data.toString());
});

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

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

app.use('/read/username', addMsgToRequest);
app.get('/read/username/:name', (req: UserRequest, res: Response) => {
  let name = req.params.name;
  let users_with_name = req.users?.filter(function(user) {
    return user.username === name;
  });
  console.log(users_with_name);
  if(users_with_name?.length === 0) {
    res.send({
      error: {message: `${name} not found`, status: 404}
    });
  }
  else {
    res.send(users_with_name);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req: UserRequest, res: Response) => {
  let newuser = req.body as User;
  users.push(newuser);
  fs.writeFile(path.resolve(__dirname, dataFile), JSON.stringify(users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
