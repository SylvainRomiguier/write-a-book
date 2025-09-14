import { randomUUID } from "node:crypto";
import { UuidService } from "../domain/services/UuidService";

export class UuidNodeService implements UuidService {
    generateUuid(): string {
        // Using Node.js's built-in crypto module to generate a UUID
        return randomUUID();
    }
    }