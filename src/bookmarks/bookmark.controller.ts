import {
Post,
Controller,
Body,
NotFoundException,
Get,
Param,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { GetBookmarkDto } from './dto/get-bookmark.dto';

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
      const bookmark = await this.bookmarkService.findOneById(bookmarkId);

      if(!bookmark) {
        throw new NotFoundException(`Bookmark with ${bookmarkId} not found`);
      }

      return bookmark;
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
}