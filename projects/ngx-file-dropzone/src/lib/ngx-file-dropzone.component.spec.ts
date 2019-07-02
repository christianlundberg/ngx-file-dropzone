import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFileDropzoneComponent } from './ngx-file-dropzone.component';

describe('NgxFileDropzoneComponent', () => {
  let component: NgxFileDropzoneComponent;
  let fixture: ComponentFixture<NgxFileDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxFileDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxFileDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
