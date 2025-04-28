import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBookIconComponent } from './open-book-icon.component';

describe('OpenBookIconComponent', () => {
  let component: OpenBookIconComponent;
  let fixture: ComponentFixture<OpenBookIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenBookIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenBookIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
