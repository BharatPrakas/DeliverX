import { TestBed } from '@angular/core/testing';

import { HttpRouting } from './http-routing';

describe('HttpRouting', () => {
  let service: HttpRouting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRouting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
