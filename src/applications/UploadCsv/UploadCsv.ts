import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IImageRepository } from "../../domain/IImageRepository";
import { v4 as uuidv4 } from 'uuid';
import { Readable } from "stream";
import csvParser from "csv-parser";
import { FileRow } from "../../domain/Models/FileRow";


@injectable()
export class UploadCsv extends Operation {
  constructor(@inject('imageRepository') private imageRepository: IImageRepository) {
    super();
    this.setOutputs(['SUCCESS', 'BADREQUEST', 'ERROR']);
  }

  async execute(file: Express.Multer.File | null) {
    const { SUCCESS, BADREQUEST, ERROR } = this.outputs;

    if (!file?.buffer) {
      return this.emit(BADREQUEST, { message: 'No stream found' });
    }

    const requestId = uuidv4();
    const results: any[] = [];
    const readableStream = new Readable();

    readableStream.push(file.buffer);
    readableStream.push(null);

    try {
      await new Promise<void>((resolve, reject) => {
        readableStream.pipe(csvParser())
          .on('data', (row) => {
            if (this.validateRow(row)) {
              results.push(row);
            } 
          })
          .on('end', resolve)
          .on('error', reject);
      });

      const result = await this.imageRepository.addProductImages(results, requestId);
      await this.imageRepository.addOptimizerJob(requestId);
      if (result) {
        this.emit(SUCCESS, { requestId });
        return;
      }

      this.emit(ERROR, 'Error Uploading CSV')
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  validateRow(row: FileRow) {
    const { 'Product Name': productName, 'Input Image Urls': inputImageUrls } = row;
    if (!productName || !inputImageUrls) return false;

    const urls = inputImageUrls.split(',').map(url => url.trim());
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    return urls.every(url => urlPattern.test(url));
  }

}