import { inject, injectable } from "inversify";
import { Operation } from "../Operation";
import { IImageRepository } from "../../domain/IImageRepository";
import { IWebhookRepository } from "../../domain/IWebhookRepository";


@injectable()
export class RegisterWebhook extends Operation {
    constructor(@inject('webhookRepository') private webhookRepository: IWebhookRepository) {
        super();
        this.setOutputs(['SUCCESS', 'BADREQUEST']);
    }

    async execute(requestId: string, webhookUrl: string) {
        const { SUCCESS, BADREQUEST } = this.outputs;

        try {
            const result = await this.webhookRepository.insertWebhookUrl(requestId, webhookUrl);
            if(result) {
                this.emit(SUCCESS, true);
            }
        } catch {

        }

    }
}