import { TestBed } from '@angular/core/testing';

import { EbayapiService } from './ebayapi.service';

describe('EbayapiService', () => {
  let service: EbayapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbayapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
