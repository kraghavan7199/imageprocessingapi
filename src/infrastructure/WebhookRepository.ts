import { inject, injectable } from "inversify";
import { IWebhookRepository } from "../domain/IWebhookRepository";
import { Database } from "../config/Database";


@injectable()
export class WebhookRepository implements IWebhookRepository {

    constructor(@inject(Database) private db: Database) { }

    async insertWebhookUrl(requestId: string, webhookUrl: string) {
        const result = await this.db.query('INSERT INTO images.webhookurls (request_id, webhookurl) VALUES ($1, $2) RETURNING id', [requestId, webhookUrl]);
        return result && result.length;
    }

    async getWebhookUrlByRequestId(requestId: string) {
        const result = await this.db.query('SELECT * FROM images.webhookurls WHERE request_id = $1', [requestId]);
        return result && result[0] && result[0].webhookurl
    }
}
