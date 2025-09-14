import { ValueObject } from "./ValueObject";

export class Id extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/gm;
    if (!uuidRegex.test(value)) {
      throw new Error('Invalid UUID format');
    }
  }
}