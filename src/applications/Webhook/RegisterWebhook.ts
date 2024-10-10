import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IImageRepository } from "../../domain/IImageRepository";


@injectable()
export class RegisterWebhook extends Operation {
    constructor(@inject('imageRepository') private imageRepository: IImageRepository) {
        super();
        this.setOutputs(['SUCCESS', 'BADREQUEST']);
    }

    async execute(requestId: string, webhookUrl: string) {
        const { SUCCESS, BADREQUEST } = this.outputs;

        try {
            const result = await this.imageRepository.insertWebhookUrl(requestId, webhookUrl);
            if(result) {
                this.emit(SUCCESS, true);
            }
        } catch {

        }

    }
}