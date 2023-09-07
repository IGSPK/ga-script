import { Injectable } from '@nestjs/common';
const { google } = require('googleapis');
const { auth } = require('google-auth-library');
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
// Load API credentials from a JSON file
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

@Injectable()
export class AppService {
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
              { expression: 'ga:goalCompletionsAll' },
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
}
