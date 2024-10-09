import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IStorageService } from "../../domain/IStorageService";
import { v4 as uuidv4 } from 'uuid';
import { UUID } from "crypto";


@injectable()
export class UploadCsv extends Operation {
    constructor(@inject('storageService') private storageService: IStorageService) {
        super();
        this.setOutputs(['SUCCESS', 'BADREQUEST']);
    }

    async execute(requestId: UUID) {
        const { SUCCESS, BADREQUEST } = this.outputs;
        try {
           
        } catch {

        }

    }
}