import { inject, injectable } from 'inversify';
import { IOptimizeService } from './IOptimizeService';
import axios from 'axios';
import { PassThrough, Readable } from 'stream';
import sharp from 'sharp';
import { IStorageService } from './IStorageService';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class OptimizeService implements IOptimizeService {

    constructor(@inject('storageService') private storageService: IStorageService) {
    }


    optimizeImages(products: any) {
        return Promise.all(products.map(async (product: any) => {
            const imageUrls = product.image_urls;
            const optimizedUrls = await this.getOptimizedImageUrls(imageUrls);
            return { ...product, optimized_urls: optimizedUrls }
        }))
    }

    getOptimizedImageUrls(imageUrls: string[]) {
        return Promise.all(
            imageUrls.map(async (url: string, index) => {
                
                let compressedImage: Buffer;

                try {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    compressedImage = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();
                } catch (error) {
                    
                    const defaultUrl = 'https://storage.googleapis.com/images-for-processing/no_image.jpg';
                    const defaultResponse = await axios.get(defaultUrl, { responseType: 'arraybuffer' });
                    compressedImage = await sharp(defaultResponse.data).jpeg({ quality: 50 }).toBuffer();
                }
                
                const readableStream = new PassThrough();
                readableStream.end(compressedImage);
                
                const tempFile: Express.Multer.File = {
                    fieldname: 'file',
                    originalname: 'optimized-image-'+ uuidv4(),
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

