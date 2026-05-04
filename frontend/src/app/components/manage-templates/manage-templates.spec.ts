import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTemplates } from './manage-templates';

describe('ManageTemplates', () => {
  let component: ManageTemplates;
  let fixture: ComponentFixture<ManageTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTemplates],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTemplates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
