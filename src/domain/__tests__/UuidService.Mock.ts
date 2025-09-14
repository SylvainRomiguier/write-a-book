import { UuidService } from "../services/UuidService";

export class UuidServiceMock implements UuidService {
  generateUuid(): string {
    const uuid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      return r.toString(16);
    });
    return uuid;
  }
}
