import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PGraphComponent } from './p-graph.component';

describe('PGraphComponent', () => {
  let component: PGraphComponent;
  let fixture: ComponentFixture<PGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PGraphComponent]
    });
    fixture = TestBed.createComponent(PGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
