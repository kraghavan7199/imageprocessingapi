import { Storage } from '@google-cloud/storage';
import { injectable } from 'inversify';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

@injectable()
export class StorageService {
    private storage: Storage;
    private bucketName: string = 'images-for-processing';

    constructor() {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");

        this.storage = new Storage({
            credentials: credentials
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype || 'image/jpeg'
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => { 
                reject(err)});
            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    }
}

