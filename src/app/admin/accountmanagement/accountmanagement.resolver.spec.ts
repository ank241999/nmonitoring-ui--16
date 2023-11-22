import { TestBed } from '@angular/core/testing';
import { DashboardResolver } from '../admin.resolver';

describe('DashboardResolver', () => {
  let resolver: DashboardResolver;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardResolver]
    });
    resolver = TestBed.get(DashboardResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve with the correct data', (done) => {
    resolver.resolve().then((result) => {
      expect(result).toEqual({});
      done();
    });
  });
});
