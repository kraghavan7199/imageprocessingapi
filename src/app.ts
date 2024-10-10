import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import './interfaces/http/controllers/UploadController';
import './interfaces/http/controllers/StatusController';
import './interfaces/http/controllers/WebhookController';
import { container } from '../inversify.config';
import { Storage } from '@google-cloud/storage';
import { Database } from './config/Database';
import { WorkerFactory } from './applications/Workers/WorkerFactory';


const server = new InversifyExpressServer(container);
const dbService = container.get(Database);
const worker = container.get(WorkerFactory);

dbService.connect();
worker.scheduleTasks();

server.setConfig((app) => {

  app.use(express.json());

  app.use(require('cors')());

});

const app = server.build();
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});