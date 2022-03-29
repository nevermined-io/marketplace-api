import { Post, Controller, Body, Get, Query, ValidationPipe, UsePipes, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAssetDto } from './dto/get-asset-dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetService } from './asset.service';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { QueryBodyDDOdto } from './dto/query-body-ddo.dto';

@ApiTags('Asset')
@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('/ddo')
  @ApiOperation({
    description: 'Create a asset entry',
  })
  @ApiResponse({
    status: 201,
    description: 'asset is created',
    type: GetAssetDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  createAsset(@Body() createAssetDto: CreateAssetDto): Promise<GetAssetDto> {
    return this.assetService.createOne(createAssetDto);
  }

  @Get()
  @ApiOperation({
    description: 'Get all asset Ids',
  })
  @ApiResponse({
    status: 200,
    description: 'Assets Ids',
    isArray: true,
    schema: {
      example: ['did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430'],
      items: { type: 'string' },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  getAllAssetIds(@Query() searchQueryDto: SearchQueryDto): Promise<string[]> {
    return this.assetService.findManyIds(searchQueryDto);
  }

  @Get('/ddo')
  @ApiOperation({
    description: 'Get DDO of all assets',
  })
  @ApiResponse({
    status: 200,
    description: 'Assets Ids',
    type: [GetAssetDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDDOAllAssets(@Query() searchQueryDto: SearchQueryDto): Promise<GetAssetDto[]> {
    return this.listDDOs(searchQueryDto);
  }

  @Get('/ddo/query')
  @ApiOperation({
    description: 'Get a list of DDOs that match with the given text',
  })
  @ApiResponse({
    status: 200,
    description: 'list of DDOs',
    type: [GetAssetDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  listDDObyQuery(@Query() searchQueryDto: SearchQueryDto): Promise<GetAssetDto[]> {
    return this.listDDOs(searchQueryDto);
  }

  @Post('/ddo/query')
  @ApiOperation({
    description: 'Get a list of DDOs that match with the executed query.',
  })
  @ApiResponse({
    status: 200,
    description: 'list of DDOs',
    type: [GetAssetDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  listDDObyQueryPost(@Body() searchQueryDto: QueryBodyDDOdto): Promise<GetAssetDto[]> {
    return this.listDDOs(searchQueryDto);
  }

  private async listDDOs(searchQueryDto: SearchQueryDto): Promise<GetAssetDto[]> {
    const assetsSource = await this.assetService.findMany(searchQueryDto);

    return assetsSource.map((a) => GetAssetDto.fromSource(a));
  }

  @Delete('ddo')
  @ApiOperation({
    description: 'Retire metadata of all assets',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted all DDOs from marketplace',
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteAllDDOs() {
    await this.assetService.deleteAll();
  }
}
