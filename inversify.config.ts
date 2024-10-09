import { Container } from 'inversify';
import { UploadCsv } from './src/applications/UploadCsv/UploadCsv';
import { IStorageService } from './src/domain/IStorageService';
import { StorageService } from './src/domain/StorageService';
import { Database } from './src/config/Database';
import { IImageRepository } from './src/domain/IImageRepository';
import { ImageRepository } from './src/infrastructure/ImageRepository';
import { ExtractCSVInfo } from './src/applications/UploadCsv/ExtractCSVInfo';
import { Worker } from './src/applications/WorkerFactory/Workers';


const container = new Container();

container.bind(Database).toSelf().inSingletonScope();
container.bind<UploadCsv>('uploadCsv').to(UploadCsv);
container.bind<ExtractCSVInfo>('extractCsv').to(ExtractCSVInfo);

container.bind<IStorageService>('storageService').to(StorageService);


container.bind<IImageRepository>('imageRepository').to(ImageRepository);
container.bind(Worker).toSelf().inSingletonScope();

export{ container }