import { TestBed } from '@angular/core/testing';

import { TabDetectionService } from './tab-detection.service';

describe('TabDetectionService', () => {
  let service: TabDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
