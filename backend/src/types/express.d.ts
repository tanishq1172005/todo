import { User } from '../models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Using any to avoid complex type issues for now, or better: typeof User
        }
    }
}