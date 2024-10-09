import { Storage } from '@google-cloud/storage';
import { inject, injectable } from 'inversify';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IOptimizeService } from './IOptimizeService';
import axios from 'axios';
import { PassThrough, Readable } from 'stream';
import sharp from 'sharp';
import { IStorageService } from './IStorageService';
import { UUID } from 'crypto';


@injectable()
export class OptimizeService implements IOptimizeService {

    constructor(@inject('storageService') private storageService: IStorageService) {
    }


    optimizeImages(products: any, jobId: string) {
        return Promise.all(products.map(async (product: any) => {
            const imageUrls = product.image_urls;
            const optimizedUrls = await this.getOptimizedImageUrls(imageUrls);
            return { ...product, optimized_urls: optimizedUrls, jobid: jobId }
        }))
    }

    getOptimizedImageUrls(imageUrls: string[]) {
        return Promise.all(
            imageUrls.map(async (url: string, index) => {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                const compressedImage = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();

                const readableStream = new PassThrough();
                readableStream.end(compressedImage);

                const tempFile: Express.Multer.File = {
                    fieldname: 'file',
                    originalname: 'sw' + index,
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    buffer: compressedImage,
                    size: compressedImage.length,
                    stream: readableStream,
                    destination: '',
                    filename: '',
                    path: '',
                };

                return await this.storageService.uploadFile(tempFile);
            })
        );

    }



}

