import { inject, injectable } from "inversify";
import cron from 'node-cron';


@injectable()
export class Worker {

    constructor(
      ){}

    scheduleTasks() {

        cron.schedule('0 0 * * 0', () => {
            
        }); 
    }


}