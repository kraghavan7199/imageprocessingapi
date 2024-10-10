import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IImageRepository } from "../../domain/IImageRepository";
import { v4 as uuidv4, validate, version } from 'uuid';


@injectable()
export class GetRequestStatus extends Operation {
    constructor(@inject('imageRepository') private imageRepository: IImageRepository) {
        super();
        this.setOutputs(['SUCCESS', 'BADREQUEST', 'ERROR']);
    }

    async execute(requestId: string) {
        const { SUCCESS, BADREQUEST, ERROR } = this.outputs;
        try {

            if (!validate(requestId) || version(requestId) !== 4) {
                this.emit(BADREQUEST, {message: 'Invalid Request Id'});
                return;
            }

            let requestStatus = await this.imageRepository.getRequestStatus(requestId);
            requestStatus.pending += ' Product Image(s)';
            requestStatus.optimized += ' Product Image(s)';
            this.emit(SUCCESS, requestStatus);
        } catch (error) {
            this.emit(ERROR, error)
        }

    }
}