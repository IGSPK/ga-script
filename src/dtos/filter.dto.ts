import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class KeyObject {
  @ApiProperty({ default: 'service_account' })
  type: string;
  @ApiProperty({ default: 'becopets' })
  project_id: string;
  @ApiProperty({ default: 'b058f81239014c0a9477805adb77cdb4ae934ae4' })
  private_key_id: string;
  @ApiProperty({
    default:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD59PjtlGieojXQ\nYRGS0Mx/H/jDzEVex4tWyJBG27gTd1tCbZfDAAkgo9Wp2yAuQ20DLauHGCHPoeXC\nx8UWAv6z/SfSFoKUaoxLjKpxEglF79wz0s3TX7VTkVoQZ5qT/4zK/sqWNG+gLfbz\nBKZHbYyrcJoNhbOjM5vppUpbsU0UEWS02wd/YTqZhDBcxMvfOdAx7vhZYP/LkW1u\ntDfMIVdiK9ZOhyH/dr3885l2m7kOT5T75Z+1FWDpKh9XLstZq4UvcGk9Hdv8egsJ\ng3m3VfZbo51UcIYD/LTHyV97o7PdZC4BSv6j2IW/06+JTub5+5CF2I59GpBiONBA\nDYMIW93BAgMBAAECggEAaGEPuGqSm7gCP+/hHk2aL/YCdIUvbMpoWgesFCL5xgtA\nLUfFqbUwmpRAC8vJLviSI9Mk/2eo6uNhJos0tqHuiewL/nPO+LpbtsrZfBk7jRyC\neJOtxvh/KJQYp6QUDXyYZ0aqA7qG6L15E/ebllVdelQtyLrODrdlAtc2635pQRjF\nDoCpuR++hPhmM37b8/PFIKRHL3xtO00ajCkaIh9HaWFciALH7X/ZtPEU5aWTjuft\nqnDgJgpjj7lsZsSkToO7uqL/gMo4gNc0B1F4mEq2c4wr+75iJeZVHSPeklpJB91i\nMY4pFwtQ6o5bjha8dN6vbru8WzEhxmY2C7JI7wR73wKBgQD+jqO55KYrj+1P7a/a\no/QnW/YP/sNwQb2pxwiTlT7gAKefsm/s3zq2YqMBD2Ld8l2Dj96W2sEMZBpSkOXT\ngwYrqtWcZzXokk5OIrqHSWT4QcoupDl4ZbvECr0rIia0KgqIEgT/Ux01ERkUmkZK\ntunUY1UMITd/Sk/cDsL4sr7EHwKBgQD7X6hqjYhDqXZLZ4cbC+CN5/FJHZjkFEQB\nmufDOKmpsgoI5t1p1YBiH/zeJBn/0KdwnHQeBtrYwiwvFcHwqsKumspm87hpBiZJ\nH/ZWwBiZunfvBNRQ/Sbdk6RCUpYUE8Tdco95EAGndlga19BaowqpCzJnMyZUA0Uo\nig8fHAoiHwKBgFWFkpgnq3RDPJV343bvUl3O1ZJ2Iy8ZxyC9D7KVl7QmRCqxBk1s\nigswhFcc1jh+7s/+i+fewrDpCLbom24+PNp64J1VR5VFYi16GXTOQa/uWoDlB7Hd\nbAHnIbrWFG6/GR6x/x/QyqVDg0uasTb00QZcAPy8RCrtynrCMtrfIpw9AoGASv9a\nPxgk/JL1wT+NFquvfoch/P+AmyPUumneFee07vU4ezlt++KAIEaM6jX5L9Kv8jAr\nkL3Y02zzQ8UJDOXVmcSC+L5kWalFCPIpS+6aKFty5vQY6GTvEJK5IjSDpE/Vn4BL\ngAIfjDgJx1B2UGRujMrTaejf2Zb0Lkkqg8yY1V8CgYBRkdQmiewsJs9dmdyLPWir\npqbb2BSUA0mp4WdWuxV6qUyvz1TfRp+7F8Z2rfQGH3u3uPH4Lp2DoVPplJB52GGp\niwypduPleO+614fEOfXlstbxrjS2G85VGKhZtbjEGWt2nFUDQlYSnyhWlqRjZy8Z\nntgP9kRGsqvrRJ6lpW/nPw==\n-----END PRIVATE KEY-----\n',
  })
  @IsNotEmpty()
  private_key: string;
  @ApiProperty({ default: 'becopets@becopets.iam.gserviceaccount.com' })
  @IsNotEmpty()
  client_email: string;
  @ApiProperty({ default: '117215162937726322249' })
  client_id: string;
  @ApiProperty({ default: 'https://accounts.google.com/o/oauth2/auth' })
  auth_uri: string;
  @ApiProperty({ default: 'https://oauth2.googleapis.com/token' })
  token_uri: string;
  @ApiProperty({ default: 'https://www.googleapis.com/oauth2/v1/certs' })
  auth_provider_x509_cert_url: string;
  @ApiProperty({
    default:
      'https://www.googleapis.com/robot/v1/metadata/x509/becopets%40becopets.iam.gserviceaccount.com',
  })
  client_x509_cert_url: string;
  @ApiProperty({ default: 'googleapis.com' })
  universe_domain: string;
}
export class FilterDto {
  @ApiProperty({ default: '2021-01-01' })
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty({ default: '2021-10-15' })
  @IsNotEmpty()
  toDate: string;

  @ApiProperty({ default: '163649506' })
  @IsNotEmpty()
  viewId: string;

  @ApiProperty()
  @IsNotEmpty()
  keysObj: KeyObject;
}
