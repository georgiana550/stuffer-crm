import { ApiProperty } from '@nestjs/swagger';

export class ImportLeadsRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
