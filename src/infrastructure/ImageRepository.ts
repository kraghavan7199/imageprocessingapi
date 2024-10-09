import { inject, injectable } from "inversify";
import { Database } from "../config/Database";
import { IImageRepository } from "../domain/IImageRepository";
import { UUID } from "crypto";



@injectable()
export class ImageRepository implements IImageRepository {

    constructor(@inject(Database) private db: Database) { }


    async addImageFile(fileUrl: string, requestId: any): Promise<any> {
        const result = await this.db.query(`INSERT INTO images.imagefiles (file_url, request_id) VALUES ($1, $2) RETURNING request_id`,
            [fileUrl, requestId]
        ) as any;

        return result[0].request_id;
    }

    async getCsvFile() {
        const result = await this.db.query('SELECT * FROM images.imagefiles WHERE job_id IS NULL LIMIT 1');
        return result[0];
    }

    async getUnoptimizedProductImages(limit: number) {
        const result = await this.db.query('SELECT * FROM images.productimages WHERE jobid IS NULL LIMIT $1', [limit]);
        return result;
    }


    async addProductImages(data: any, requestId: UUID) {
        for (const product of data) {
            const imageUrls = product['Input Image Urls'].split(',').map((url: string) => url.trim());
            const queryText = 'INSERT INTO images.productimages(name, image_urls, request_id) VALUES($1, $2, $3) RETURNING id';
            const values = [product['Product Name'], imageUrls, requestId];
            const result = await this.db.query(queryText, values);

            if (result && result.length) {
                return true
            }

            return false;
        }
    }
}
