import { injectable } from 'inversify';
import { Pool, PoolClient } from 'pg';

@injectable()
export class Database {
    private pool: Pool;

    constructor() {

        this.pool = new Pool({
            user: 'postgres',         
            host: 'localhost',        
            database: 'postgres', 
            password: 'postgres',   
            port: 5432,     
          });


    }

    async query(text: string, params?: any[]) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result.rows;
        } finally {
            client.release();
        }
    }

    async connect(): Promise<void> {
        try {
            const client: PoolClient = await this.pool.connect();
            console.log('Connected to PostgreSQL');
            client.release();
        } catch (err: any) {
            console.error('Error connecting to PostgreSQL:', err.message);
        }
    }
}