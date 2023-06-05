import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateItemStock {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  stock: number;
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  name: string;
}
