import { TestBed } from '@angular/core/testing';

import { ShowAlertToastService } from './show-alert-toast.service';

describe('ShowAlertToastService', () => {
  let service: ShowAlertToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowAlertToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
