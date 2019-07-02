import { TestBed } from '@angular/core/testing';

import { NgxFileDropzoneService } from './ngx-file-dropzone.service';

describe('NgxFileDropzoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxFileDropzoneService = TestBed.get(NgxFileDropzoneService);
    expect(service).toBeTruthy();
  });
});
