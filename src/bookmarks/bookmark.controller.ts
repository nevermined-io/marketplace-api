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
      type: [GetBookmarkDto],
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
      type: [GetBookmarkDto],
    })
    @ApiResponse({
      status: 404,
      description: 'Not found',
    })
    async getBookmarks(@Param('id') bookmarkId: string): Promise<GetBookmarkDto>{
      const bookmark = await this.bookmarkService.findOne(bookmarkId);

      if(!bookmark) {
        throw new NotFoundException(`Bookmark with ${bookmarkId} not found`);
      }

      return bookmark;
    }
}