import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerConsoleComponent } from './player-console.component';

describe('PlayerConsoleComponent', () => {
  let component: PlayerConsoleComponent;
  let fixture: ComponentFixture<PlayerConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
