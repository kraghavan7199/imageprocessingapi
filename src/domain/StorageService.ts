import { Storage } from '@google-cloud/storage';
import { injectable } from 'inversify';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

@injectable()
export class StorageService {
    private storage: Storage;
    private bucketName: string = 'images-for-processing';

    constructor() {
        this.storage = new Storage({
            credentials: {
                "type": "service_account",
                "project_id": "imageapi-438016",
                "private_key_id": "664402788f62b08bb750a2a23b30c45efeeee90a",
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcJqWbpBj4pCJ1\ntHBJr33uE/0NmY8n2Pbda5WKl8ER132tS/MxVDWJ/frq8THj4bp1GQDG0PlcBcIC\nsImrcflFylLdnB62MSID+Gs3WwIDbp1lJ3Ypn+dn7TramGzIwVmAitgoaz0s+0gA\nv3Dir4jH52yCkz1rNQBcCdidsJjFuJl6pHBFQzToRdrShK0W3wvTRQ70dZ5RBnu/\njxacdgwrjxrHixy+1XC/3q5HaacQX00yxMsVcQ3orlC3jWeFu9VPu/geXFvxR8Rj\nZWM7pO+4SyPvGZ2BioBwo6YdOfytCUn6TDgsUn5FBo745rc7wwMSSwUTTKF99iTw\ncnunhaZxAgMBAAECggEAICBVZzmyR4mha10V0xsvigmDwUYMLXMWi0SkrjB9sPmI\nalybatU79KmT871u+ccJ0Si1P7Jj81pd6aa/lE3tLr4rIVwK94oRSQbVrDxlpCYg\nbNzbE0JKXlfxCWNd0knxa6BlS5+QpQ4H6Nt6UrExr4s+CHlZpBJyAf2mmv7n15nK\nXa0/uGP1JN+vCAgN/7OX1i3nkWfMuYy1PBGUWxRGQT6qbJ3hMGULQLI4IckJ5lAd\nhvcityuuEoxASlJnh73/6i88p2UgN9dpc6PD6yNfL8SnNHzikyyc2zn8ilMhVqDg\n29vC81GYMQbfez5nE3kaoPJipX0yCN1M2XMNL3OeSQKBgQDSUIqjz5t4DFb+WCCl\nR9+fdWD2BXx8q5gEmr2rRXuVq19G/eklLI+bBQv7nbDC2+TcAF7RjOYBCGLYqVcu\nIxHDWl2NVwYene03mbxBAOjK9ti2Nm3J/6aRo2J4wqr/IbCtvKeT361VRQNlT6DI\nyx0YkBffsZKzMwXsVd8qRv4D/QKBgQC+EhmeySS99Dqn5E2u5qcbwXzktMYJhIUv\nu0l19aJBnUjd6VCYln4nkKovR1K7mxuUsKJgNGrdN29nQsfji9D4RrPi6646kr79\nnx44ZcpA7bATwyGAU+5HmmczjmqBYR3lVUJ3y1bI+aaYc+ost47a/IcEAaZYnTfS\nySaBblYkhQKBgHU4zw1euZi/x/0bwZZd6RZHpjN5+1jBi4mFdhHwOGHDkudOvpQp\nsiEFPxiPW+ZACd9VlYPWtJv+wJliSWU9xrjLtTkCODb4by9+UJ8qkpYN39wvmiHs\njDrAhjIozoZFkORFMmIJWeMdBDeDmmpQS3dVWPklUE7xMWv4sNovl4VBAoGBAIzX\ntrptzFchyfEtAM9wxTWRC+4hcnoNA/BZtNa+/MvoM92UjQ90vOiujx1XmZvBFQ/6\nT2hAj0t7T4bR+nLH4UKIibXF9KYcpYAkT211KAky1/3c409HYlMWvBB9ILjccR3G\nLum7+IQWUne3tTgLkMT+yUGTw2L4pSwBuBHC4/xNAoGAT02+U/T6hFaUK+/uB9js\nfLmofCibgw6vXxfB+z9/HljT97uLJBSpTS8KX1/4S6I9FGYMY/GSIjkKKh0LCd1q\ngjFasXDrRYmIxrdPPYxAX6Ppo/HnTJKPul25vGpWO0OV2qmnOgD4y9QE2J0idYaT\ngP3vJ28TaOD0e6jV4tvTGkY=\n-----END PRIVATE KEY-----\n",
                "client_email": "imageprocessingservice@imageapi-438016.iam.gserviceaccount.com",
                "client_id": "100395815851659535017",
                "universe_domain": "googleapis.com"
            }
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => reject(err));
            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    }
}

