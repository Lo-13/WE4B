import { TestBed } from '@angular/core/testing';

import {Logs} from './logs';

describe('Logs', () => {
  let service: Logs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Logs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
