import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMarkIconComponent } from './book-mark-icon.component';

describe('BookMarkIconComponent', () => {
  let component: BookMarkIconComponent;
  let fixture: ComponentFixture<BookMarkIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookMarkIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookMarkIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
