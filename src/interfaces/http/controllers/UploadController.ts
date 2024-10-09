import { BaseHttpController, controller, httpGet, httpPost, request, requestParam, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import * as express from 'express';
import multer from 'multer';
import { UploadCsv } from '../../../applications/UploadCsv/UploadCsv';
import { ExtractCSVInfo } from '../../../applications/UploadCsv/ExtractCSVInfo';

const upload = multer({ storage: multer.memoryStorage() });

@controller('/upload')
export class UploadController extends BaseHttpController {

    @inject('uploadCsv') private uploadCsv!: UploadCsv;
    @inject('extractCsv') private extractCsv!: ExtractCSVInfo;

    @httpPost('', upload.single('file'))
    public async uploadImageCsv(@request() req: express.Request, @response() res: express.Response) {

        const { SUCCESS, BADREQUEST } = this.uploadCsv.outputs;
        this.uploadCsv.on(SUCCESS, result => res.json(result))
        await this.uploadCsv.execute(req.file)
    }

    @httpGet('')
    public async sit(@request() req: express.Request, @response() res: express.Response) {

        this.extractCsv.execute()
    }

}