import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IStorageService } from "../../domain/IStorageService";
import { IImageRepository } from "../../domain/IImageRepository";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import csvParser from 'csv-parser';
import { Readable } from 'stream';



@injectable()
export class ExtractCSVInfo extends Operation {
    constructor(@inject('storageService') private storageService: IStorageService,
        @inject('imageRepository') private imageRepository: IImageRepository) {
        super();
        this.setOutputs(['SUCCESS', 'BADREQUEST']);
    }

    async execute() {
      

        const url = 'https://storage.googleapis.com/images-for-processing/test.csv';
        const response = await axios.get(url, { responseType: 'stream' });
        const results = [] as any;


        (response.data as Readable).pipe(csvParser()).on('data', row=> {
            const isValid = this.validateRow(row);
            if (!isValid) {
              console.error(`Invalid row format: ${JSON.stringify(row)}`);
            } else {
              results.push(row);
            }
        }) .on('end', () => {
            console.log('CSV file successfully processed');
            console.log(results); // Processed rows
    });
}

     validateRow(row: any) {
        const {'Product Name': productName, 'Input Image Urls': inputImageUrls } = row;

        if (!productName || !inputImageUrls) {
          return false;
        }
      
        const urls = inputImageUrls.split(',').map((url: string) => url.trim());
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        const areUrlsValid = urls.every((url: string) => urlPattern.test(url));
        return areUrlsValid;
      }


    
    
}