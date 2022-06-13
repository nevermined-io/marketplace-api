import { Get, Req, Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import path from 'path';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { Public } from '../common/decorators/auth.decorator';
import { Request } from '../common/helpers/request.interface';
import { GetInfoDto } from './dto/get-info.dto';

@ApiTags('Info')
@Controller()
export class InfoController {
  constructor(private readonly elasticService: ElasticService) {}

  @Get()
  @ApiOperation({
    description: 'Get API info',
    summary: 'Public',
  })
  @ApiResponse({
    status: 200,
    description: 'Return API Info',
    type: GetInfoDto,
  })
  @Public()
  async getInfo(@Req() req: Request<unknown>): Promise<GetInfoDto> {
    const pathEndpoint = `${req.protocol}://${req.hostname}${req.client.localPort ? `:${req.client.localPort}` : ''}${
      req.url
    }`;
    const packageJsonPath = path.join(__dirname, '../..', 'package.json');
    const packageJsonString = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonString) as { version: string };

    const elsInfo = await this.elasticService.getInfo();

    return {
      APIversion: packageJson.version,
      // prettier-ignore
      elasticsearchVersion: (elsInfo.body as { version: { "number": string } }).version.number,
      docs: `${pathEndpoint}api/v1/docs`,
    };
  }
}
