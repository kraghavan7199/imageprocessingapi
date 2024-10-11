export interface IWebhookRepository {
    insertWebhookUrl(requestId: string, webhookUrl: string): Promise<number| null>;
    getWebhookUrlByRequestId(requestId: string): Promise<string | null>;
}