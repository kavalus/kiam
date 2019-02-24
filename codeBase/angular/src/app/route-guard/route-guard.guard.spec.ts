import { TestBed, async, inject } from '@angular/core/testing';

import { RouteGuardGuard } from './route-guard.guard';

describe('RouteGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteGuardGuard]
    });
  });

  it('should ...', inject([RouteGuardGuard], (guard: RouteGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
