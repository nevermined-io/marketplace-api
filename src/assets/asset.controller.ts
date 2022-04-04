import {
  Post,
  Controller,
  Body,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
  Delete,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAssetDto } from './dto/get-asset-dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetService } from './asset.service';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';
import { QueryBodyDDOdto } from './dto/query-body-ddo.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AttributesDto } from './dto/attributes.dto';

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
    schema: SearchResponse.toDocs(GetAssetDto),
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  getDDOAllAssets(@Query() searchQueryDto: SearchQueryDto): Promise<SearchResponse<GetAssetDto[]>> {
    return this.listDDOs(searchQueryDto);
  }

  @Get('/ddo/query')
  @ApiOperation({
    description: 'Get a list of DDOs that match with the given text',
  })
  @ApiResponse({
    status: 200,
    description: 'list of DDOs',
    schema: SearchResponse.toDocs(GetAssetDto),
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  listDDObyQuery(@Query() searchQueryDto: SearchQueryDto): Promise<SearchResponse<GetAssetDto[]>> {
    return this.listDDOs(searchQueryDto);
  }

  @Post('/ddo/query')
  @ApiOperation({
    description: 'Get a list of DDOs that match with the executed query.',
  })
  @ApiResponse({
    status: 200,
    description: 'list of DDOs',
    schema: SearchResponse.toDocs(GetAssetDto),
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  listDDObyQueryPost(@Body() searchQueryDto: QueryBodyDDOdto): Promise<SearchResponse<GetAssetDto[]>> {
    return this.listDDOs(searchQueryDto);
  }

  @Delete('ddo')
  @ApiOperation({
    description: 'Retire metadata of all assets',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted all DDOs from marketplace',
  })
  async deleteAllDDOs() {
    await this.assetService.deleteAll();
  }

  @Get('ddo/:did')
  @ApiOperation({
    description: 'Get DDO of a particular asset',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a DDO',
    type: GetAssetDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getDDO(@Param('did') did: string): Promise<GetAssetDto> {
    const AssetSource = await this.assetService.findOneById(did);

    return GetAssetDto.fromSource(AssetSource);
  }

  @Put('ddo/:did')
  @ApiOperation({
    description: 'Update DDO of an existing asset',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a updated DDO',
    type: GetAssetDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async updateDDO(@Param('did') did: string, @Body() updateAssetDto: UpdateAssetDto): Promise<GetAssetDto> {
    const assetSource = await this.assetService.updateOneByEntryId(did, updateAssetDto);

    return GetAssetDto.fromSource(assetSource);
  }

  @Delete('ddo/:did')
  @ApiResponse({
    description: 'Retire metadata of an asset',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted DDO',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteDDO(@Param('did') did: string): Promise<void> {
    await this.assetService.deleteOneByEntryId(did);
  }

  @Get('metadata/:did')
  @ApiResponse({
    description: 'Get metadata of a particular asset',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a metadata from asset',
    type: AttributesDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getDDOMetadata(@Param('did') did: string): Promise<AttributesDto> {
    const assetSource = await this.assetService.findOneById(did);

    const metada = GetAssetDto.fromSource(assetSource).service?.find((s) => s.attributes)?.attributes;

    if (!metada) {
      throw new NotFoundException(`Asset with did ${did} doesn't have metada`);
    }

    return metada;
  }

  private async listDDOs(searchQueryDto: SearchQueryDto): Promise<SearchResponse<GetAssetDto[]>> {
    const assetsSource = await this.assetService.findMany(searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      assetsSource,
      assetsSource.hits.map((a) => GetAssetDto.fromSource(a))
    );
  }
}
