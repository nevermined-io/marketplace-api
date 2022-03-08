import { Reflector } from '@nestjs/core';
import { ConfigService } from '../../../shared/config/config.service';
import { RolesGuard } from './auth.guard';

jest.mock('../../../shared/config/config.service');

describe('RolesGuard', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    // @ts-ignore
    ConfigService.mockClear();
  });

  it('should be defined', () => {
    expect(new RolesGuard(new ConfigService())).toBeDefined();
  });
});