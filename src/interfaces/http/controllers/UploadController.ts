import { BaseHttpController, controller, httpGet, httpPost, request, requestParam, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import * as express from 'express';
import * as HttpStatus from 'http-status';
import multer from 'multer';
import { UploadCsv } from '../../../applications/UploadCsv/UploadCsv';

const upload = multer({ storage: multer.memoryStorage() });

@controller('/upload')
export class UploadController extends BaseHttpController {

    @inject('uploadCsv') private uploadCsv!: UploadCsv;

    @httpPost('', upload.single('file'))
    public async uploadImageCsv(@request() req: express.Request, @response() res: express.Response) {
        const { SUCCESS, BADREQUEST , ERROR} = this.uploadCsv.outputs;

        this.uploadCsv.on(SUCCESS, result => res.json(result));

        this.uploadCsv.on(BADREQUEST, err => res.status(HttpStatus.BAD_REQUEST).send(err));

        this.uploadCsv.on(ERROR, err => { throw (err); });

        await this.uploadCsv.execute(req.file || null)
    }

}