import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTestComponent } from './plan-test.component';

describe('PlanTestComponent', () => {
  let component: PlanTestComponent;
  let fixture: ComponentFixture<PlanTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
