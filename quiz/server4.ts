import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import readUsers from './readUsers'
import WriteUsers from './writeUsers'

const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.use("/read", readUsers)
app.use("/write", WriteUsers)
app.listen(port, () => {
  console.log(`Example app listening on new port ${port}`)
})
