import { ValueObject } from "./ValueObject";

export class Name extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || value.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }
  }
}