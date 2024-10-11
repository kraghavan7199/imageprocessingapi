import { BaseHttpController, controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import * as express from 'express';
import { RegisterWebhook } from '../../../applications/Webhook/RegisterWebhook';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

@controller('/webhook')
export class WebhookController extends BaseHttpController {

    @inject('registerWebhook') private registerWebhookUrlFeature!: RegisterWebhook;

    @httpPost('/register')
    public async registerWebhookUrl(@request() req: express.Request, @response() res: express.Response) {
        
        const { SUCCESS, BADREQUEST } = this.registerWebhookUrlFeature.outputs;
        this.registerWebhookUrlFeature.on(SUCCESS, result => res.json(result))

        const { webhookUrl, requestId} = req.body;

       await this.registerWebhookUrlFeature.execute(requestId, webhookUrl);

    }

    @httpPost('', upload.single('file'))
    public async test(@request() req: express.Request, @response() res: express.Response) {
        console.log('for test********************************************', req.file)

    }

}