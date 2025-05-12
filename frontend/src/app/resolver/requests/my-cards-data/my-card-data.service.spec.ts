import { TestBed } from '@angular/core/testing';

import { MyCardDataService } from './my-card-data.service';

describe('MyCardDataService', () => {
  let service: MyCardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
