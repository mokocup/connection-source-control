import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';

export interface MinMaxOptions {
  min: number;
  max: number;
  optional?: boolean;
}

@Injectable()
export class MinMaxPipe implements PipeTransform<string> {
  protected min: number;
  protected max: number;

  constructor(protected readonly options: MinMaxOptions) {
    this.min = options.min;
    this.max = options.max;
  }

  transform(value: string, metadata: ArgumentMetadata): number {
    if (isNil(value) && this.options?.optional) {
      return value;
    }
    if (!this.isNumeric(value)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
    if (!this.isInRange(+value)) {
      throw new BadRequestException(
        `Numeric string must between ${this.min}-${this.max}`,
      );
    }
    return parseInt(value, 10);
  }

  protected isInRange(value: number): boolean {
    return this.min <= value && value <= this.max;
  }

  protected isNumeric(value: string): boolean {
    return (
      ['string', 'number'].includes(typeof value) &&
      /^-?\d+$/.test(value) &&
      isFinite(value as any)
    );
  }
}
