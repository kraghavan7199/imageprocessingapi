import { inject, injectable } from "inversify";
import cron from 'node-cron';
import { OptimizeImageWorker } from "./OptimizeImageWorker";


@injectable()
export class WorkerFactory {

  constructor(
    @inject('optimizeImageWorker') private optimizeImageWorker: OptimizeImageWorker) { }

  scheduleTasks() {
    this.scheduleImageOptimizerTask();
  }

  scheduleImageOptimizerTask() {
    cron.schedule('* * * * *', () => {
      this.optimizeImageWorker.execute();
    });
  }



}