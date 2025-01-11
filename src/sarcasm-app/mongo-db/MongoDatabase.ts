import mongoose, { Mongoose } from "mongoose";

class MongoDatabase {
    public conn: Mongoose | undefined;
    public uri: string;

    constructor(uri: string) {
        this.uri = uri;
        this.conn = undefined;
    }

    public get connection(): Mongoose | undefined {
        return this.conn;
    }

    public get connectionUri(): string {
        return this.uri;
    }

    public async connect(): Promise<Mongoose> {
        try {
            this.conn = await mongoose.connect(this.uri, {
                serverSelectionTimeoutMS: 5000
            });

            return this.conn;
        } catch (error) {
            console.log(':::Database connection failed:::', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (this.conn) {
            await this.conn.disconnect();
        }
    }
}

export default MongoDatabase;