import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class KeyObject {
  @ApiProperty()
  type: string;
  @ApiProperty()
  project_id: string;
  @ApiProperty()
  private_key_id: string;
  @ApiProperty()
  @IsNotEmpty()
  private_key: string;
  @ApiProperty()
  @IsNotEmpty()
  client_email: string;
  @ApiProperty()
  client_id: string;
  @ApiProperty()
  auth_uri: string;
  @ApiProperty()
  token_uri: string;
  @ApiProperty()
  auth_provider_x509_cert_url: string;
  @ApiProperty()
  client_x509_cert_url: string;
  @ApiProperty()
  universe_domain: string;
}
export class FilterDto {
  @ApiProperty({ default: '2021-01-01' })
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty({ default: '2021-10-15' })
  @IsNotEmpty()
  toDate: string;

  @ApiProperty()
  @IsNotEmpty()
  viewId: string;

  @ApiProperty()
  @IsNotEmpty()
  keysObj: KeyObject;
}
