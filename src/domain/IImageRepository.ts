import { UUID } from "crypto";

export interface IImageRepository {
    addProductImages(data: any, requestId: string): Promise<boolean> ;
    getUnoptimizedProductImagesByRequestId(requestId: string ,limit: number): any;
    addOptimizerJob(request_id: string): Promise<number>
    getOptimizerJobToComplete(): any;
    getRequestStatus(request_id: string): Promise<{pending: string, optimized: string}>;
    addOptimizedUrls(optimizedProducts: any): any;
    completeOptimizedJob(requestId: string): any;
    getProductsByRequestId(requestId: string): any;
    sendWebhookCsv(file: any, requestId: string, webhookUrl: string): any;
}