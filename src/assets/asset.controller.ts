import { Post, Controller, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAssetDto } from './dto/get-asset-dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetService } from './asset.service';

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
}
