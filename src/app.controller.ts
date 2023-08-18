import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate')
  async generate(@Body() body: { fromDate: string; toDate: string }) {
    const { fromDate, toDate } = body;
    const data = await this.appService.generate(fromDate, toDate);
    const csvContent = this.generateCsv(data);
    const filePath = await this.saveFile(csvContent, 'users.csv');
    return 'file created successfully';
  }

  generateCsv(data: any[]): string {
    const csvRows = ['Date,Users,Sessions,PageViews'];

    data.forEach((row) => {
      const date = row.dimensions[0];
      const users = row.metrics[0].values[0];
      const sessions = row.metrics[0].values[1];
      const pageViews = row.metrics[0].values[2];

      const csvRow = `${date},${users},${sessions},${pageViews}`;
      csvRows.push(csvRow);
    });

    return csvRows.join('\n');
  }

  async saveFile(content: string, filename: string): Promise<string> {
    const savePath = path.join(
      'D:',
      'Work',
      'analytics',
      'src',
      'csv',
      filename,
    );

    await fs.promises.writeFile(savePath, content);

    return savePath;
  }

  @Get('/download')
  async downloadCsv(@Res() res: Response) {
    const savePath = path.join(
      'D:',
      'Work',
      'analytics',
      'src',
      'csv',
      'users.csv',
    );
    try {
      const csvContent = await fs.promises.readFile(savePath, 'utf-8');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users.xls`);

      res.send(csvContent);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }
}
