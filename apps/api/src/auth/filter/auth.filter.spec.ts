import { SupertokensExceptionFilter } from './auth.filter';

describe('AuthFilter', () => {
  it('should be defined', () => {
    expect(new SupertokensExceptionFilter()).toBeDefined();
  });
});
