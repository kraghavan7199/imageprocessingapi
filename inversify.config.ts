import { Container } from 'inversify';
import { UploadCsv } from './src/applications/UploadCsv/UploadCsv';
import { Database } from './src/config/Database';
import { IImageRepository } from './src/domain/IImageRepository';
import { ImageRepository } from './src/infrastructure/ImageRepository';
import { WorkerFactory } from './src/applications/Workers/WorkerFactory';
import { OptimizeImageWorker } from './src/applications/Workers/OptimizeImageWorker';
import { IOptimizeService } from './src/domain/IOptimizeService';
import { OptimizeService } from './src/domain/OptimizeService';
import { GetRequestStatus } from './src/applications/Status/GetRequestStatus';
import { RegisterWebhook } from './src/applications/Webhook/RegisterWebhook';
import { IStorageService } from './src/domain/IStorageService';
import { StorageService } from './src/domain/StorageService';


const container = new Container();

container.bind(Database).toSelf().inSingletonScope();
container.bind<UploadCsv>('uploadCsv').to(UploadCsv);
container.bind<OptimizeImageWorker>('optimizeImageWorker').to(OptimizeImageWorker);
container.bind<GetRequestStatus>('getRequestStatus').to(GetRequestStatus);
container.bind<IOptimizeService>('optimizeService').to(OptimizeService);
container.bind<IImageRepository>('imageRepository').to(ImageRepository);
container.bind<RegisterWebhook>('registerWebhook').to(RegisterWebhook);
container.bind(WorkerFactory).toSelf().inSingletonScope();
container.bind<IStorageService>('storageService').to(StorageService);


export{ container }