import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAccount } from './modify-account';

describe('ModifyAccount', () => {
  let component: ModifyAccount;
  let fixture: ComponentFixture<ModifyAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
