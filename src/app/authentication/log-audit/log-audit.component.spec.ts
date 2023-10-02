import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAuditComponent } from './log-audit.component';

describe('LogAuditComponent', () => {
  let component: LogAuditComponent;
  let fixture: ComponentFixture<LogAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogAuditComponent]
    });
    fixture = TestBed.createComponent(LogAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
