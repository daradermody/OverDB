import { TestBed, inject } from '@angular/core/testing';

import { MovieServiceService } from './movie-service.service';

describe('MovieServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieServiceService]
    });
  });

  it('should be created', inject([MovieServiceService], (service: MovieServiceService) => {
    expect(service).toBeTruthy();
  }));
});
