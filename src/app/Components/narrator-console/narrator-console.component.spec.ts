import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NarratorConsoleComponent } from './narrator-console.component';

describe('NarratorConsoleComponent', () => {
  let component: NarratorConsoleComponent;
  let fixture: ComponentFixture<NarratorConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NarratorConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarratorConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
