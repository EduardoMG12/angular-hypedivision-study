import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularyRegisterComponent } from './formulary-register.component';

describe('FormularyRegisterComponent', () => {
  let component: FormularyRegisterComponent;
  let fixture: ComponentFixture<FormularyRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularyRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
