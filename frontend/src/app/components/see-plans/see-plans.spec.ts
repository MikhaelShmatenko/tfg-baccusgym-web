import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePlans } from './see-plans';

describe('SeePlans', () => {
  let component: SeePlans;
  let fixture: ComponentFixture<SeePlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeePlans],
    }).compileComponents();

    fixture = TestBed.createComponent(SeePlans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
