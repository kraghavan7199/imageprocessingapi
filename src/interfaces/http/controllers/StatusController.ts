import { BaseHttpController, controller, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import * as express from 'express';
import * as HttpStatus from 'http-status';
import { GetRequestStatus } from '../../../applications/Status/GetRequestStatus';


@controller('/status')
export class StatusController extends BaseHttpController {

    @inject('getRequestStatus') private getRequestStatusFeature!: GetRequestStatus;

    @httpGet('/:reqId')
    public async getRequestStatus(@request() req: express.Request, @response() res: express.Response) {
        
        const { SUCCESS, BADREQUEST, ERROR } = this.getRequestStatusFeature.outputs;

        this.getRequestStatusFeature.on(SUCCESS, result => res.json(result));

        this.getRequestStatusFeature.on(BADREQUEST, err => res.status(HttpStatus.BAD_REQUEST).send(err));

        this.getRequestStatusFeature.on(ERROR, err => { throw (err); });

        const reqId = req.params.reqId;

        console.log(reqId)

       await this.getRequestStatusFeature.execute(reqId);

    }

}