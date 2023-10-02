import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUserComponent } from './email-user.component';

describe('EmailUserComponent', () => {
  let component: EmailUserComponent;
  let fixture: ComponentFixture<EmailUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailUserComponent]
    });
    fixture = TestBed.createComponent(EmailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
