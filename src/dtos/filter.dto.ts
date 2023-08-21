
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

class KeyObject {
    @ApiProperty()
    type: string
    @ApiProperty()
    project_id: string
    @ApiProperty()
    private_key_id: string
    @ApiProperty()
    private_key: string
    @ApiProperty()
    client_email: string
    @ApiProperty()
    client_id: string
    @ApiProperty()
    auth_uri: string
    @ApiProperty()
    token_uri: string
    @ApiProperty()
    auth_provider_x509_cert_url: string
    @ApiProperty()
    client_x509_cert_url: string
    @ApiProperty()
    universe_domain: string
}
export class FilterDto {
    @ApiProperty({ default: '02-10-2023' })
    @IsNotEmpty()
    fromDate: string

    @ApiProperty({ default: '15-10-2023' })
    @IsNotEmpty()
    toDate: string

    @ApiProperty()
    @IsNotEmpty()
    keysObj: KeyObject
}

