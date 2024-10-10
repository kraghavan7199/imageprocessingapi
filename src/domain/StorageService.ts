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
        this.storage = new Storage({
            credentials: {
                "type": "service_account",
                "project_id": "imageapi-438016",
                "private_key_id": "0c74c5ffccb12e490e1119df594349de3b6d7af4",
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWpsI5C1DZm5ZU\n7ql1AZHy4vjF5toZ5p6RiUyQZnjs/9+0LtQl0INEXCUuDHlrh1WNrQLcNd/GSkgQ\nSwLIQ2eDbsMzqBrVP6iZSkP60epAgY9YCY7O0MSpnjiAqnhRrxoY9yL87513e5kG\nDluDbvoG5DYhy8hzMNTXm3Eu9hL+fii7RqR/HkOYgpQcZeXR13Jl2XtSSMPJkrW9\nqceTMcB8YEJCn9mVlvHkMScqjjGt3QjIB5nMEiDK8+iPOTF7MW76xGqk2vaii2mb\ndJDnx+332iSQkxX1WYQIJ0O/dFPWjRn8aK8iWYPuw+yArP5PzNgydZ9W+J26x9vI\nYiJUNt9rAgMBAAECggEAF+/z0+G3q/TGYIVW/3Xj3UbDgGpcoyvNPiSmFapfzOpB\n+7mHLgphQSPXf5mjhsLKXyjOm1kksdvBypNa5ZNivU0CVsXl7CcTubiG+TcknPn1\nztcOBnFQpSvAWFTqYw2YZvVUgQmFsXfmmj7KpM8g8djMUpuDqJjm+35Zsmd9ucSK\ngwpJs0sRcqllaqbrUIC6Eys03w+rTPB6y2ycQpZvfiNDi/HgW6USXeWEZ56Z2p4v\nmH0tHc8w+w5YKKwFoJI+dQZMVEdCFaDH1jgKXsKTKLA/nQhPi2iInVNRGluegWZN\n24PnfkEx6H7BeQVnEx/4xrvX40C3/wL1si+LXtUJvQKBgQD7pFCxVX0+7IOPp7VE\nzYup1pddHpxaj8Hi6JFgVzH+IgUpiBpYIBHcZ7F4t3Saa1UTNh2T8M93SxHLla40\noM1xHfKUBO7/PrQM8KTTrMlx+/T4NnREsjLCW6CaL/Kgz+q0WjbIBlkogTnVO2Pq\njs8YDppla+Jng7SZJwsl3xjTbwKBgQDaXnEZThDe6+Rkw0fGUvMFP67Xsv9ueegX\nXhMSlT4ogjnU0fCyiDokSWE/08szJJ20ODvTjqTeoL7Qs40dKbKlNy6mP64YP/7A\neowvZInzMQkVZiexus2lLw8mexPkahEyuiUMHE9fusmLcqaUjL7qD5+oSYkGHTD5\nWOBl3DUFxQKBgGXuqm0a9w/tGGGxioDjTgavEUM8KhOZFe3HTVQcHfkWaMbpBdra\nqsGAE2iVz5rZjW2pxxNtQWzOMNgpupZA6NdATUneMb2c9awkMnA4FqWgbRu6WyCU\nmnEWUpkCgSLY9fa2cGhYAfehWP7h/tg9nu/cwngA2oYZ2KcNJLvjghfrAoGAfa0Y\n/m1VfFbbDbruFhArWXv7TpzwMU7r6nb0Fx/ZtEquqfNhyf5pJ/UriSaFrhuGv/AV\nTn6sGIz/BPIxZvVWoYuOx5OiyMYcAf8Fq0j7tAEmrzAp7DoMnOLmn0j6e90npMBJ\nDh1E+V1xHVaQ1LHkNqVjR+F6gRBP3VHvY/BGe9kCgYEAuODMC1LvfHE13HcESLhj\ns5BPSwe+sx46rRwa+XUSwdaDmxNZ4R/i/F/wuddsG+j4tAfr5QRnbnjNIvKkiGaB\n4M/CxJTsNuRkR7xlyxKfnggD8IL5tYMy47U3TFlEK96LiIVAFXJbY6sk3jpgLpyh\nNriJ9xl+w2BlT0TiWSaT5qU=\n-----END PRIVATE KEY-----\n",
                "client_email": "imageprocessingservice@imageapi-438016.iam.gserviceaccount.com",
                "client_id": "100395815851659535017",
                "universe_domain": "googleapis.com"
            }
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
                console.log(err)
                reject(err)});
            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    }
}

