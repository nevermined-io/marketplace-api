import {
Post,
Get,
Put,
Delete,
Controller,
Body,
NotFoundException,
Param,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@ApiTags('Bookmark')
@Controller()
export class BookmarkController {
constructor(
    private readonly bookmarkService: BookmarkService
) {}

    @Post()
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
    async createBookmark(@Body() createBookmark: CreateBookmarkDto): Promise<GetBookmarkDto> {
      return this.bookmarkService.createOne(createBookmark);
    }

    @Get(':id')
    @ApiOperation({
      description: 'Get a bookmark entry',
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
    async getBookmarkById(@Param('id') bookmarkId: string): Promise<GetBookmarkDto>{
      const bookmarkSources = await this.bookmarkService.findManyById(bookmarkId);

      if(!bookmarkSources?.length) {
        throw new NotFoundException(`Bookmark with ${bookmarkId} not found`);
      }

      return GetBookmarkDto.fromSource(bookmarkSources[0]);
    }

    @Get('user/:userId')
    @ApiOperation({
      description: 'Get all the user bookmarks',
    })
    @ApiResponse({
      status: 200,
      description: 'Return all bookmark from a user',
      type: [GetBookmarkDto],
    })
    async getBookmarksByUserId(@Param('userId') userId: string): Promise<GetBookmarkDto[]> {
      const bookmarksSources = await this.bookmarkService.findManyByUserId(userId);

      return bookmarksSources.map(GetBookmarkDto.fromSource);
    }

    @Put(':id')
    @ApiOperation({
      description: 'Update an existing bookmark'
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
    async updateBookmarkById(
      @Param('id') id: string,
      @Body() updateBookmarkDto: UpdateBookmarkDto
    ): Promise<GetBookmarkDto> {
      const bookmarkSources = await this.bookmarkService.findManyById(id);

      if(!bookmarkSources?.length) {
        throw new NotFoundException(`Bookmark with ${id} not found`);
      }

      const bookmark = await this.bookmarkService.updateOneByEntryId(String(bookmarkSources[0]._id), updateBookmarkDto);

      return GetBookmarkDto.fromSource(bookmark);
    }

    @Delete(':id')
    @ApiOperation({
      description: 'Delete a bookmark'
    })
    @ApiResponse({
      status: 200,
      description: 'return all bookmark left of the use'
    })
    @ApiResponse({
      status: 404,
      description: 'Not found'
    })
    async deleteBookmarkById(@Param('id') id: string): Promise<GetBookmarkDto[]> {
      const bookmarkSources = await this.bookmarkService.findManyById(id);

      if(!bookmarkSources?.length) {
        throw new NotFoundException(`Bookmark with ${id} not found`);
      }

      await this.bookmarkService.deleteOneByEntryId(String(bookmarkSources[0]._id));

      const bookmarkSourcesLeft = await this.bookmarkService.findManyByUserId(bookmarkSources[0]._source.userId);

      return bookmarkSourcesLeft.map(GetBookmarkDto.fromSource);
    }
}