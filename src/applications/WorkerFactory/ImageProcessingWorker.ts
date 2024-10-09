import { inject, injectable } from "inversify";
import cron from 'node-cron';
import { IImageRepository } from "../../domain/IImageRepository";
import { ExtractCSVInfo } from "../UploadCsv/ExtractCSVInfo";
import { v4 as uuidv4 } from 'uuid';
import { Operation } from "../Operation";

@injectable()
export class ImageProcessingWorker extends Operation {

    constructor(@inject('imageRepository') private imageRepository: IImageRepository,
    @inject('extractCsv') private extractCsv: ExtractCSVInfo){
        super();
    }

   async execute() {

       const { SUCCESS, BADREQUEST } = this.extractCsv.outputs;
       const imageCsvInfo = await this.imageRepository.getCsvFile();
       this.extractCsv.on(SUCCESS , () => {
        console.log('ahsdjashdjhasjdhajsdhjasdhjahdjkahsdjkahjkdaj')
       })

       this.extractCsv.execute(imageCsvInfo.file_url, imageCsvInfo.request_id);
    }


}