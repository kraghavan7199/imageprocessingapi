import { inject, injectable } from "inversify";
import { IImageRepository } from "../../domain/IImageRepository";
import { IOptimizeService } from "../../domain/IOptimizeService";
import { createObjectCsvStringifier, createObjectCsvWriter } from "csv-writer";
import path from "path";
import multer from "multer";

const BATCH_LIMIT = 50;
@injectable()
export class OptimizeImageWorker {

    constructor(@inject('optimizeService') private optimizeService: IOptimizeService,
        @inject('imageRepository') private imageRepository: IImageRepository) {
    }

    async execute() {
        console.log('called*****')
        const job = await this.imageRepository.getOptimizerJobToComplete();
        if (job) {
            const products = await this.imageRepository.getUnoptimizedProductImagesByRequestId(job.request_id, BATCH_LIMIT);
            const productsWithOptimizedImage = await this.optimizeService.optimizeImages(products);
            await this.imageRepository.addOptimizedUrls(productsWithOptimizedImage);
            if(products.length < BATCH_LIMIT) {
                await this.imageRepository.completeOptimizedJob(job.request_id);
                const payload  = this.getWebhookPayload(job.request_id);
            }
        }
    }

    async getWebhookPayload(requestId: string) {
        const products = await this.imageRepository.getProductsByRequestId(requestId);
        const webhookUrl = await this.imageRepository.getWebhookUrlByRequestId(requestId);

        if(webhookUrl) {
            const upload = multer({ storage: multer.memoryStorage() });
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    {id: 'name', title: 'Product Name' },
                    {id: 'image_urls', title: 'Input Image Urls'},
                    {id: 'optimized_urls', title: 'Output Image Urls'}
                ]
            });
            
            const csvData = csvStringifier.stringifyRecords(products);
            const csvBuffer = Buffer.from(csvData, 'utf-8');
            await this.imageRepository.sendWebhookCsv(csvBuffer, requestId, webhookUrl);
        }
    }
}