import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserRolePermissionComponent } from './add-user-role-permission.component';

describe('AddUserRolePermissionComponent', () => {
  let component: AddUserRolePermissionComponent;
  let fixture: ComponentFixture<AddUserRolePermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserRolePermissionComponent]
    });
    fixture = TestBed.createComponent(AddUserRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
