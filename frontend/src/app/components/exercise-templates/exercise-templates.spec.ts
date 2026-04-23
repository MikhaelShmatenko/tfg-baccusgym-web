import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTemplates } from './exercise-templates';

describe('ExerciseTemplates', () => {
  let component: ExerciseTemplates;
  let fixture: ComponentFixture<ExerciseTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTemplates],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTemplates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
