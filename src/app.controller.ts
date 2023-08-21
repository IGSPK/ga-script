import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ApiTags, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FilterDto } from './dtos/filter.dto';
import { AppService } from './app.service';

@Controller()
@ApiTags('Google Analytics Module')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate')
  async generate(@Body() body: FilterDto) {
    const data = await this.appService.generate(body);
    const csvContent = this.generateCsv(data);
    const filePath = await this.saveFile(csvContent, 'users.csv');
    return {
      message:
        'Your google analytics report for page views, users & sessions with organic traffic saved successfully!!! you can download your .xls file form localhost:8000/api/download',
    };
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
    const savePath = path.join(__dirname, '..', 'src/csv/' + filename);

    await fs.promises.writeFile(savePath, content);

    return savePath;
  }

  @ApiExcludeEndpoint()
  @Get('/download')
  async downloadCsv(@Res() res: Response) {
    const downloadPath = path.join(__dirname, '..', 'src/csv/users.csv');
    try {
      const csvContent = await fs.promises.readFile(downloadPath, 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users.xls`);
      res.send(csvContent);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }
}
