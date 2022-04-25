import { Post, Get, Put, Delete, Controller, Body, Param, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';
import { Public } from '../common/decorators/auth.decorator';

@ApiTags('Bookmark')
@Controller()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Create a bookmark entry',
  })
  @ApiResponse({
    status: 201,
    description: 'Bookmark is created',
    type: GetBookmarkDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createBookmark(@Body() createBookmark: CreateBookmarkDto): Promise<GetBookmarkDto> {
    return this.bookmarkService.createOne(createBookmark);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get a bookmark entry',
    summary: 'Public',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a bookmark user',
    type: GetBookmarkDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @Public()
  async getBookmarkById(@Param('id') bookmarkId: string): Promise<GetBookmarkDto> {
    const bookmarkSources = await this.bookmarkService.findOneById(bookmarkId);

    return GetBookmarkDto.fromSource(bookmarkSources);
  }

  @Get('user/:userId')
  @ApiOperation({
    description: 'Get all the user bookmarks',
    summary: 'Public',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all bookmark from a user',
    schema: SearchResponse.toDocs(GetBookmarkDto),
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Public()
  async getBookmarksByUserId(
    @Param('userId') userId: string,
    @Query() searchQueryDto: SearchQueryDto
  ): Promise<SearchResponse<GetBookmarkDto[]>> {
    const bookmarksSources = await this.bookmarkService.findManyByUserId(userId, searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      bookmarksSources,
      bookmarksSources.hits.map(GetBookmarkDto.fromSource)
    );
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Update an existing bookmark',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a updated bookmark',
    type: GetBookmarkDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateBookmarkById(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto
  ): Promise<GetBookmarkDto> {
    const bookmark = await this.bookmarkService.updateOneByEntryId(id, updateBookmarkDto);

    return GetBookmarkDto.fromSource(bookmark);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Delete a bookmark',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteBookmarkById(@Param('id') id: string): Promise<void> {
    await this.bookmarkService.deleteOneByEntryId(id);
  }
}
