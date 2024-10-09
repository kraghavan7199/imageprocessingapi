import { Storage } from '@google-cloud/storage';
import { injectable } from 'inversify';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IOptimizeService } from './IOptimizeService';
import axios from 'axios';
import { Readable } from 'stream';


@injectable()
export class OptimizeService implements IOptimizeService {

    constructor() {
    }


    optimizeImages(data: any) {

        data.forEach((d: any) => {
            const imageUrls = d.image_urls;

            imageUrls.map(async (url: string) => {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                // const compressedImage = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();
                // const stream = new Readable();
                // stream.push(compressedImage);
                //  stream.push(null);
                // const tempFile: Express.Multer.File = {
                //     fieldname: 'file',
                //     originalname: `sw`,
                //     encoding: '7bit',
                //     mimetype: 'image/jpeg',
                //     buffer: compressedImage,
                //     size: compressedImage.length,
                //     stream: stream,
                //     destination: '',
                //     filename: '',
                //     path: '',
                //   };
                // console.log(tempFile)
            })

        })
    }


}

