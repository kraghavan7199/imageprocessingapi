import { inject, injectable } from "inversify";
import cron from 'node-cron';
import { IImageRepository } from "../../domain/IImageRepository";


@injectable()
export class ImageProcessingWorker {

    constructor(@inject('imageRepository') private imageRepository: IImageRepository){}

   async execute() {
       const imageCsvInfo = await this.imageRepository.getCsvFile();
        
    }


}