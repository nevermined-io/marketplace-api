import {
Post,
Controller,
Body,
InternalServerErrorException,
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
      description: 'allows users to bookmark marketplace contents',
    })
    @ApiResponse({
      status: 201,
      description: 'Bookmark is is created',
      type: [GetBookmarkDto],
    })
    @ApiResponse({
      status: 403,
      description: 'Bad Request',
    })
    async createBookmark(@Body() createBookmark: CreateBookmarkDto): Promise<GetBookmarkDto> {
        try {
          return this.bookmarkService.createOne(createBookmark);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}