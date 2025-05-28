import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello' })
  @ApiResponse({
    status: 200,
    description: 'Returns Hello',
  })
  getHello(): string {
    return this.appService.getHello()
  }
}
