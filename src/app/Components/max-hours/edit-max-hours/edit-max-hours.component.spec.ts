import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaxHoursComponent } from './edit-max-hours.component';

describe('EditMaxHoursComponent', () => {
  let component: EditMaxHoursComponent;
  let fixture: ComponentFixture<EditMaxHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMaxHoursComponent]
    });
    fixture = TestBed.createComponent(EditMaxHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
