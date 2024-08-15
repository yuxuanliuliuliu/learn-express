import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const port = 8000;
const dataFile = '../data/users.json';


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
