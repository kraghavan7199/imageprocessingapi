import { inject, injectable } from "inversify";
import cron from 'node-cron';
import { IImageRepository } from "../../domain/IImageRepository";
import { ExtractCSVInfo } from "../UploadCsv/ExtractCSVInfo";
import { v4 as uuidv4 } from 'uuid';
import { Operation } from "../Operation";
import { IOptimizeService } from "../../domain/IOptimizeService";
import { UUID } from "crypto";

const BATCH_LIMIT  = 50;
@injectable()
export class OptimizeImageWorker {

    constructor(@inject('optimizeService') private optimizeService: IOptimizeService,
    @inject('imageRepository') private imageRepository: IImageRepository){
    }

   async execute() {

    const jobId = uuidv4();
    const products = await this.imageRepository.getUnoptimizedProductImages(BATCH_LIMIT);
    const productsWithOptimizedImage = await this.optimizeService.optimizeImages(products, jobId);
    }


}