import { TestBed } from '@angular/core/testing';

import { CsvGeneratorService } from './csv-generator.service';

describe('CsvGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CsvGeneratorService = TestBed.get(CsvGeneratorService);
    expect(service).toBeTruthy();
  });
});
