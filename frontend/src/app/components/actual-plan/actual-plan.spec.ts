import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualPlan } from './actual-plan';

describe('ActualPlan', () => {
  let component: ActualPlan;
  let fixture: ComponentFixture<ActualPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualPlan],
    }).compileComponents();

    fixture = TestBed.createComponent(ActualPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
