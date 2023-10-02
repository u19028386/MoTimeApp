import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolePermissionsComponent } from './user-role-permissions.component';

describe('UserRolePermissionsComponent', () => {
  let component: UserRolePermissionsComponent;
  let fixture: ComponentFixture<UserRolePermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRolePermissionsComponent]
    });
    fixture = TestBed.createComponent(UserRolePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
