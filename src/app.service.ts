import { Injectable } from '@nestjs/common';
const { google } = require('googleapis');
const { auth } = require('google-auth-library');
import * as ExcelJS from 'exceljs';
import axios from 'axios';

// Load API credentials from a JSON file
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

@Injectable()
export class AppService {
  private readonly analyticsreporting = google.analyticsreporting('v4');

  generate(body) {
    return (async () => {
      try {
        const jsonData = await this.fetchData(body);

        return jsonData;
      } catch (error) {
        console.error('Error fetching data:', error);
        return error;
      }
    })();
  }

  async generateExcel(data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Add data rows
    data.forEach((row) => {
      const values = Object.values(row);
      worksheet.addRow(values);
    });

    // Generate Excel content
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to Buffer object (if needed)
    return Buffer.from(excelBuffer);
  }

  // Fetch data from Google Analytics
  async fetchData(body) {
    const analytics = google.analyticsreporting('v4');
    // Set up the JWT client
    const jwtClient = new google.auth.JWT({
      email: body.keysObj.client_email,
      key: body.keysObj.private_key,
      scopes: SCOPES,
    });

    const response = await analytics.reports.batchGet({
      auth: jwtClient,
      requestBody: {
        reportRequests: [
          {
            viewId: body.viewId,
            dateRanges: [
              {
                startDate: body.fromDate,
                endDate: body.toDate,
              },
            ],
            metrics: [
              { expression: 'ga:users' },
              { expression: 'ga:sessions' },
              { expression: 'ga:pageviews' },
              { expression: 'ga:goalCompletionsAll' }, // Add conversion metric
              { expression: 'ga:transactionRevenue' }, // Add revenue metric
              { expression: 'ga:itemQuantity' }, // Add sales metric
              { expression: 'ga:transactions' }, // Add transactions metric for purchases
              { expression: 'ga:uniquePurchases' }, // Add unique purchases metric
            ],
            dimensions: [{ name: 'ga:date' }],
            dimensionFilterClauses: [
              {
                filters: [
                  {
                    dimensionName: 'ga:medium',
                    operator: 'EXACT',
                    expressions: ['organic'],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    // Transform dimensions to the desired format "YYYY-MM-DD"
    const formattedData = response.data.reports[0].data.rows.map((row) => {
      const dimension = row.dimensions[0];
      const formattedDimension = `${dimension.substring(
        0,
        4,
      )}-${dimension.substring(4, 6)}-${dimension.substring(6, 8)}`;
      return { dimensions: [formattedDimension], metrics: row.metrics };
    });

    return formattedData;
  }

  // const viewId = '163649506';

  // const jwtClient = new google.auth.JWT({
  //   email: 'becopets@becopets.iam.gserviceaccount.com',
  //   key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD59PjtlGieojXQ\nYRGS0Mx/H/jDzEVex4tWyJBG27gTd1tCbZfDAAkgo9Wp2yAuQ20DLauHGCHPoeXC\nx8UWAv6z/SfSFoKUaoxLjKpxEglF79wz0s3TX7VTkVoQZ5qT/4zK/sqWNG+gLfbz\nBKZHbYyrcJoNhbOjM5vppUpbsU0UEWS02wd/YTqZhDBcxMvfOdAx7vhZYP/LkW1u\ntDfMIVdiK9ZOhyH/dr3885l2m7kOT5T75Z+1FWDpKh9XLstZq4UvcGk9Hdv8egsJ\ng3m3VfZbo51UcIYD/LTHyV97o7PdZC4BSv6j2IW/06+JTub5+5CF2I59GpBiONBA\nDYMIW93BAgMBAAECggEAaGEPuGqSm7gCP+/hHk2aL/YCdIUvbMpoWgesFCL5xgtA\nLUfFqbUwmpRAC8vJLviSI9Mk/2eo6uNhJos0tqHuiewL/nPO+LpbtsrZfBk7jRyC\neJOtxvh/KJQYp6QUDXyYZ0aqA7qG6L15E/ebllVdelQtyLrODrdlAtc2635pQRjF\nDoCpuR++hPhmM37b8/PFIKRHL3xtO00ajCkaIh9HaWFciALH7X/ZtPEU5aWTjuft\nqnDgJgpjj7lsZsSkToO7uqL/gMo4gNc0B1F4mEq2c4wr+75iJeZVHSPeklpJB91i\nMY4pFwtQ6o5bjha8dN6vbru8WzEhxmY2C7JI7wR73wKBgQD+jqO55KYrj+1P7a/a\no/QnW/YP/sNwQb2pxwiTlT7gAKefsm/s3zq2YqMBD2Ld8l2Dj96W2sEMZBpSkOXT\ngwYrqtWcZzXokk5OIrqHSWT4QcoupDl4ZbvECr0rIia0KgqIEgT/Ux01ERkUmkZK\ntunUY1UMITd/Sk/cDsL4sr7EHwKBgQD7X6hqjYhDqXZLZ4cbC+CN5/FJHZjkFEQB\nmufDOKmpsgoI5t1p1YBiH/zeJBn/0KdwnHQeBtrYwiwvFcHwqsKumspm87hpBiZJ\nH/ZWwBiZunfvBNRQ/Sbdk6RCUpYUE8Tdco95EAGndlga19BaowqpCzJnMyZUA0Uo\nig8fHAoiHwKBgFWFkpgnq3RDPJV343bvUl3O1ZJ2Iy8ZxyC9D7KVl7QmRCqxBk1s\nigswhFcc1jh+7s/+i+fewrDpCLbom24+PNp64J1VR5VFYi16GXTOQa/uWoDlB7Hd\nbAHnIbrWFG6/GR6x/x/QyqVDg0uasTb00QZcAPy8RCrtynrCMtrfIpw9AoGASv9a\nPxgk/JL1wT+NFquvfoch/P+AmyPUumneFee07vU4ezlt++KAIEaM6jX5L9Kv8jAr\nkL3Y02zzQ8UJDOXVmcSC+L5kWalFCPIpS+6aKFty5vQY6GTvEJK5IjSDpE/Vn4BL\ngAIfjDgJx1B2UGRujMrTaejf2Zb0Lkkqg8yY1V8CgYBRkdQmiewsJs9dmdyLPWir\npqbb2BSUA0mp4WdWuxV6qUyvz1TfRp+7F8Z2rfQGH3u3uPH4Lp2DoVPplJB52GGp\niwypduPleO+614fEOfXlstbxrjS2G85VGKhZtbjEGWt2nFUDQlYSnyhWlqRjZy8Z\nntgP9kRGsqvrRJ6lpW/nPw==\n-----END PRIVATE KEY-----\n',
  //   scopes: SCOPES,
  // });

  // // Construct the request
  // const request = {
  //   auth: jwtClient,
  //   requestBody: {
  //     reportRequests: [
  //       {
  //         viewId: viewId,
  //         dateRanges: [
  //           {
  //             startDate: '2021-01-01',
  //             endDate: '2021-10-15',
  //           },
  //         ],

  //     async getSessionsWithProductViews(body) {
  //       try {
  //         const jwtClient = new google.auth.JWT({
  //             email: body.keysObj.client_email,
  //             key: body.keysObj.private_key,
  //             scopes: SCOPES,
  //           });

  //         const request = {
  //           auth: jwtClient,

  //             // reportRequests: [
  //             //   {
  //             //     viewId: body.viewId,
  //             //     dateRanges: [{ startDate: body.fromDate, endDate: body.toDate }],
  //             //     metrics: [{ expression: 'ga:productName' }],
  //             //     dimensions: [{ name: 'ga:productSku' }],
  //             //   },
  //             // ],

  //             requestBody: {
  //               reportRequests: [
  //                 {
  //                   viewId: body.viewId,
  //                   dateRanges: [
  //                     {
  //                       startDate: body.fromDate,
  //                       endDate: body.toDate,
  //                     },
  //                   ],
  //                   metrics: [
  //                     {
  //                       expression: 'ga:productDetailViews',
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },

  //         // Make the API request to Google Analytics
  //         const response = await this.analyticsreporting.reports.batchGet(request);

  //         // Handle the response and return the sessions with product views data
  //         const data = response.data;
  //         return data;
  //       } catch (error) {
  //         throw new Error(`Error fetching data from Google Analytics: ${error.message}`);
  //       }
  //     }
  // }

  async getProductViews(body) {
    const jwtClient = new google.auth.JWT({
      email: body.keysObj.client_email,
      key: body.keysObj.private_key,
      scopes: SCOPES,
    });

    const analyticsreporting = google.analyticsreporting({
      version: 'v4',
      auth: jwtClient,
    });

    const response = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: body.viewId,
            dateRanges: [
              {
                startDate: body.fromDate,
                endDate: body.toDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:productDetailViews',
              },
            ],
            dimensions: [{ name: 'ga:date' }],
          },
        ],
      },
    });

    const formattedData = response.data.reports[0].data.rows.map((row) => {
      const dimension = row.dimensions[0];
      const formattedDimension = `${dimension.substring(
        0,
        4,
      )}-${dimension.substring(4, 6)}-${dimension.substring(6, 8)}`;
      return { dimensions: [formattedDimension], metrics: row.metrics };
    });

    return formattedData;

  }




}
