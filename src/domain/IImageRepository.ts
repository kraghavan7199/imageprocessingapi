import { UUID } from "crypto";

export interface IImageRepository {
    addImageFile(fileUrl: any, requestId: any): any;
    getCsvFile():any;
    addProductImages(data: any, requestId: UUID): any;
    getProductImages(limit: number): any;
}