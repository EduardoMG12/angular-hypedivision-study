import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedBookIconComponent } from './closed-book-icon.component';

describe('ClosedBookIconComponent', () => {
  let component: ClosedBookIconComponent;
  let fixture: ComponentFixture<ClosedBookIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosedBookIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedBookIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
