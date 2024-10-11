import { inject, injectable } from "inversify";
import { Database } from "../config/Database";
import { IImageRepository } from "../domain/IImageRepository";
import FormDataLib from 'form-data';
import fs from 'fs';
import axios from "axios";

@injectable()
export class ImageRepository implements IImageRepository {

    constructor(@inject(Database) private db: Database) { }


    async getUnoptimizedProductImagesByRequestId(requestId: string, limit: number) {
        const result = await this.db.query('SELECT * FROM images.productimages WHERE ((request_id = $1) AND (optimized_urls IS NULL) ) LIMIT $2', [requestId, limit]);
        return result;
    }


    async addProductImages(data: any, requestId: string): Promise<boolean> {
        for (const product of data) {
            const imageUrls = product['Input Image Urls'].split(',').map((url: string) => url.trim());
            const queryText = 'INSERT INTO images.productimages(name, image_urls, request_id, serialNo) VALUES($1, $2, $3, $4) RETURNING id';
            const values = [product['Product Name'], imageUrls, requestId, product['S. No.']];
            const result = await this.db.query(queryText, values);
        }
        return true;
    }

    async addOptimizerJob(requestId: string) {
        const result = await this.db.query(`INSERT INTO images.optimizerjobs (request_id) VALUES ($1) RETURNING id`, [requestId]) as any;
        return result[0].id;
    }

    async getOptimizerJobToComplete() {
        const result = await this.db.query('SELECT * FROM images.optimizerjobs WHERE endedat IS NULL ORDER BY createdat ASC LIMIT 1');
        return result && result[0];
    }

    async getRequestStatus(request_id: string): Promise<{ pending: string, optimized: string }> {
        const result = await this.db.query('SELECT COUNT(*) FILTER (WHERE optimized_urls IS NULL) AS pending ,  COUNT(*) FILTER (WHERE optimized_urls IS NOT NULL) AS optimized FROM images.productimages WHERE request_id = $1', [request_id]);
        return result && result[0] ? result[0] : { pending: 0, optimized: 0 };
    }

    async addOptimizedUrls(optimizedProducts: any) {
        const result = await this.db.query('SELECT * FROM images.addoptimizedurls($1)', [optimizedProducts]);
    }

    async completeOptimizedJob(requestId: string) {
        const result = await this.db.query('UPDATE images.optimizerjobs SET endedat = $1 WHERE request_id = $2', [new Date(), requestId]);
    }

    async getProductsByRequestId(requestId: string) {
        const result = await this.db.query('SELECT * FROM images.productimages WHERE request_id = $1', [requestId]);
        return result;
    }

    async sendWebhookCsv(csvBuffer: Buffer, requestId: string, webhookUrl: string) {
        const form = new FormDataLib();
        form.append('file', csvBuffer, {
            filename: `optimized_images_${requestId}.csv`,
            contentType: 'text/csv',
        });

        form.append('metadata', JSON.stringify({ requestId: requestId }));
        try {
            const response = await axios.post(webhookUrl, form, {
                headers: {
                    ...form.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 10000,
            });
            return response;
        } catch (error) {
            console.log('Invalid Webhook URL Given')
        }
    }
}
