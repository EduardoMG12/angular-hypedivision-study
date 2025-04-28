import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBooksIconComponent } from './side-books-icon.component';

describe('SideBooksIconComponent', () => {
  let component: SideBooksIconComponent;
  let fixture: ComponentFixture<SideBooksIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBooksIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBooksIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
