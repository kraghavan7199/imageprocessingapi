import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import './interfaces/http/controllers/UploadController';
import { container } from '../inversify.config';
import { Storage } from '@google-cloud/storage';
import { Database } from './config/Database';
import { Worker } from './applications/WorkerFactory/Workers';


const server = new InversifyExpressServer(container);
const dbService = container.get(Database);
const worker = container.get(Worker);

dbService.connect();
worker.scheduleTasks();

server.setConfig((app) => {

  app.use(express.json());

  app.use(require('cors')());

});

const app = server.build();
const port = process.env.PORT || 3000;;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});