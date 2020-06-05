import { Whatsapp } from '../api/whatsapp';
import { CreateConfig } from '../config/create-config';
/**
 * Should be called to initialize whatsapp client
 */
export declare function create(session?: string, catchQR?: (qrCode: string, asciiQR: string) => void, options?: CreateConfig): Promise<Whatsapp>;
