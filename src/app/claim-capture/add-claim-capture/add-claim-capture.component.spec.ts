import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimCaptureComponent } from './add-claim-capture.component';

describe('AddClaimCaptureComponent', () => {
  let component: AddClaimCaptureComponent;
  let fixture: ComponentFixture<AddClaimCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClaimCaptureComponent]
    });
    fixture = TestBed.createComponent(AddClaimCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
