import { inject, injectable } from "inversify";
import { Database } from "../config/Database";
import { IImageRepository } from "../domain/IImageRepository";



@injectable()
export class ImageRepository implements IImageRepository {

    constructor(@inject(Database) private db: Database) { }

    async addImageFile(fileUrl: string, requestId: any): Promise<any> {
        const result = await this.db.query(`INSERT INTO images.imagefiles (file_url, request_id) VALUES ($1, $2) RETURNING request_id`,
            [fileUrl, requestId]
        ) as any;

        return result[0].request_id;
    }
}