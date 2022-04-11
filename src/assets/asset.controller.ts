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
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAssetDto } from './dto/get-asset-dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetService } from './asset.service';
import { DDOStatusService } from './ddo-status.service';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';
import { Request } from '../common/helpers/request.interface';
import { QueryBodyDDOdto } from './dto/query-body-ddo.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AttributesDto } from './dto/attributes.dto';
import { GetDDOStatusDto } from './dto/get-ddo-status.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { ServiceDDOService } from './ddo-service.service';

@ApiTags('Asset')
@Controller()
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly ddosStatusService: DDOStatusService,
    private readonly serviceDDOService: ServiceDDOService
  ) {}

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
  async createAsset(@Req() req: Request, @Body() createAssetDto: CreateAssetDto): Promise<GetAssetDto> {
    const url = `${req.protocol}://${req.hostname}${req.client.localPort ? `:${req.client.localPort}` : ''}${req.url}`;
    const assetDto = await this.assetService.createOne(createAssetDto);
    await this.ddosStatusService.createOne(createAssetDto, url);

    return assetDto;
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
    const assetSource = await this.assetService.findOneById(did);

    return GetAssetDto.fromSource(assetSource);
  }

  @Get('ddo/:did/status')
  @ApiOperation({
    description: 'Get DDO status of a particular asset',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a DDO status',
    type: GetDDOStatusDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getDDOStatus(@Param('did') did: string): Promise<GetDDOStatusDto> {
    const statusSource = await this.ddosStatusService.findOneById(did);

    return GetDDOStatusDto.fromSource(statusSource);
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

  @Post('service')
  @ApiResponse({
    description: 'Create a service',
  })
  @ApiResponse({
    status: 201,
    description: 'Service created',
    type: GetServiceDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  async createService(@Body() serviceDto: CreateServiceDto): Promise<GetServiceDto> {
    return this.serviceDDOService.createOne(serviceDto);
  }

  @Post('service/query')
  @ApiOperation({
    description: 'Get a list of services that match with the executed query.',
  })
  @ApiResponse({
    status: 200,
    description: 'list of services',
    schema: SearchResponse.toDocs(GetServiceDto),
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  async getServiceQueryPost(@Body() searchQueryDto: QueryBodyDDOdto): Promise<SearchResponse<GetServiceDto[]>> {
    const servicesSource = await this.serviceDDOService.findMany(searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      servicesSource,
      servicesSource.hits.map(GetServiceDto.fromSource)
    );
  }

  @Get('service/:agreementId')
  @ApiOperation({
    description: 'Get service by passing agreementId',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a service',
    type: GetServiceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getService(@Param('agreementId') agreementId: string): Promise<GetServiceDto> {
    const serviceSource = await this.serviceDDOService.findOneById(agreementId);

    return GetServiceDto.fromSource(serviceSource);
  }

  @Delete('service')
  @ApiOperation({
    description: 'Delete all the services',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted all services',
  })
  async deleteAllServices() {
    await this.serviceDDOService.deleteAll();
  }

  private async listDDOs(searchQueryDto: SearchQueryDto): Promise<SearchResponse<GetAssetDto[]>> {
    const assetsSource = await this.assetService.findMany(searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      assetsSource,
      assetsSource.hits.map(GetAssetDto.fromSource)
    );
  }
}
