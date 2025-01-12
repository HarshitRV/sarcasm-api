import { CustomRequest } from '../../src/sarcasm-app/utils/utils.types.ts';

declare module 'express' {
    export interface Request extends CustomRequest {}
}
