import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimecardHelpComponent } from './timecard-help.component';

describe('TimecardHelpComponent', () => {
  let component: TimecardHelpComponent;
  let fixture: ComponentFixture<TimecardHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimecardHelpComponent]
    });
    fixture = TestBed.createComponent(TimecardHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
