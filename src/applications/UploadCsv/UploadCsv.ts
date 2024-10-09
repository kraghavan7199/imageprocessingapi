import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IStorageService } from "../../domain/IStorageService";
import { IImageRepository } from "../../domain/IImageRepository";
import { v4 as uuidv4 } from 'uuid';


@injectable()
export class UploadCsv extends Operation {
    constructor(@inject('storageService') private storageService: IStorageService,
        @inject('imageRepository') private imageRepository: IImageRepository) {
        super();
        this.setOutputs(['SUCCESS', 'BADREQUEST']);
    }

    async execute(file: any) {
        const { SUCCESS, BADREQUEST } = this.outputs;
        try {
            const fileUrl = await this.storageService.uploadFile(file);
            const requestId = await this.imageRepository.addImageFile(fileUrl, uuidv4());
            this.emit(SUCCESS, { requestId: requestId });
        } catch {

        }

    }
}