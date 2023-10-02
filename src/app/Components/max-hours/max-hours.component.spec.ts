import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxHoursComponent } from './max-hours.component';

describe('MaxHoursComponent', () => {
  let component: MaxHoursComponent;
  let fixture: ComponentFixture<MaxHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaxHoursComponent]
    });
    fixture = TestBed.createComponent(MaxHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
