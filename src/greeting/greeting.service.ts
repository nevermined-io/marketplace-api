import { SearchHit, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticService} from '../shared/elasticsearch/elastic.service'
import { GreetingDTO } from './dto/greeting.dto';

@Injectable()
export class GreetingService {
  constructor(
    private readonly elasticService: ElasticService
  ) {}
  
  async addGreeting(greeting: GreetingDTO) {
    await this.elasticService.addDocumentToIndex('greeting', {
        name: greeting.name,
        message: greeting.message
    });
  }

  async getGreeting(name: string): Promise<SearchHit<GreetingDTO>[]> {
    return this.elasticService.searchByIndex(
      'greeting',
      {
        match: {
          name,
        }
      }
    ) as Promise<SearchHit<GreetingDTO>[]>;
  }
}