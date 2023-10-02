import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimCaptureComponent } from './edit-claim-capture.component';

describe('EditClaimCaptureComponent', () => {
  let component: EditClaimCaptureComponent;
  let fixture: ComponentFixture<EditClaimCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditClaimCaptureComponent]
    });
    fixture = TestBed.createComponent(EditClaimCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
