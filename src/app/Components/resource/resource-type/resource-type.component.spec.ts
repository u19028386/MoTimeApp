import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTypeComponent } from './resource-type.component';

describe('ResourceTypeComponent', () => {
  let component: ResourceTypeComponent;
  let fixture: ComponentFixture<ResourceTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceTypeComponent]
    });
    fixture = TestBed.createComponent(ResourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
