import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedclaimComponent } from './submittedclaim.component';

describe('SubmittedclaimComponent', () => {
  let component: SubmittedclaimComponent;
  let fixture: ComponentFixture<SubmittedclaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmittedclaimComponent]
    });
    fixture = TestBed.createComponent(SubmittedclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
