import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularyCreateCardComponent } from './formulary-create-card.component';

describe('FormularyCreateCardComponent', () => {
  let component: FormularyCreateCardComponent;
  let fixture: ComponentFixture<FormularyCreateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularyCreateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularyCreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
