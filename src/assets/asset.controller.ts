import { Post, Controller, Body, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAssetDto } from './dto/get-asset-dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetService } from './asset.service';
import { SearchQueryDto } from '../common/helpers/search-query.dto';

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
  getAllAssetIds(@Query() searchQueryDto: SearchQueryDto): Promise<string[]> {
    return this.assetService.findAllIds(searchQueryDto);
  }
}
