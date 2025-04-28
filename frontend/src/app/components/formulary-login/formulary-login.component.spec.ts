import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularyLoginComponent } from './formulary-login.component';

describe('FormularyLoginComponent', () => {
  let component: FormularyLoginComponent;
  let fixture: ComponentFixture<FormularyLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularyLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
