import { TestBed } from '@angular/core/testing';

import { Admin.GuardService } from './admin.guard.service';

describe('Admin.GuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Admin.GuardService = TestBed.get(Admin.GuardService);
    expect(service).toBeTruthy();
  });
});
