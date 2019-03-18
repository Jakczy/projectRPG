import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundPhotosComponent } from './background-photos.component';

describe('BackgroundPhotosComponent', () => {
  let component: BackgroundPhotosComponent;
  let fixture: ComponentFixture<BackgroundPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
