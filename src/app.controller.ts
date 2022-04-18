import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TokensBody } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/graph/data/:days')
  async getGraphData(@Body() body: TokensBody, @Param('days') days: number) {
    try {
      console.log(body, 'tyhe body', days);
      const data = await this.appService.getGraphData(body, days);
      return data;
    } catch (error) {
      return error;
    }
  }
  @Post('/graph/profit/:days')
  async getTokenHoldingProfit(
    @Body() body: TokensBody,
    @Param('days') days: number,
  ) {
    try {
      const data = await this.appService.getTokenHoldingProfit(body, days);
      return data;
    } catch (error) {
      return error;
    }
  }
}
