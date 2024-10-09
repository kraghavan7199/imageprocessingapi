import { inject, injectable } from "inversify";
import cron from 'node-cron';
import { ImageProcessingWorker } from "./ImageProcessingWorker";


@injectable()
export class Worker {

    constructor(@inject('imageProcessingWorker') private uploadCsv: ImageProcessingWorker){}

     scheduleTasks() {
       this.uploadCsv.execute();
    }


}