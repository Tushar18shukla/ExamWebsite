import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestIdComponent } from './test-id.component';

describe('TestIdComponent', () => {
  let component: TestIdComponent;
  let fixture: ComponentFixture<TestIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
