import { inject, injectable } from "inversify";
import cron from 'node-cron';
import { ImageProcessingWorker } from "./ImageProcessingWorker";
import { OptimizeImageWorker } from "./OptimizeImageWorker";


@injectable()
export class Worker {

    constructor(@inject('imageProcessingWorker') private uploadCsv: ImageProcessingWorker,
    @inject('optimizeImageWorker') private optimizeImageWorker: OptimizeImageWorker){}

     scheduleTasks() {
      // this.uploadCsv.execute();
     // this.optimizeImageWorker.execute();
    }


}