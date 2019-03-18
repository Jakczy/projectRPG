import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestLogAndOthersComponent } from './quest-log-and-others.component';

describe('QuestLogAndOthersComponent', () => {
  let component: QuestLogAndOthersComponent;
  let fixture: ComponentFixture<QuestLogAndOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestLogAndOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestLogAndOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
