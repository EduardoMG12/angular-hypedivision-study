import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLibraryOfCardsComponent } from './my-library-of-cards.component';

describe('MyCardsComponent', () => {
  let component: MyLibraryOfCardsComponent;
  let fixture: ComponentFixture<MyLibraryOfCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLibraryOfCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLibraryOfCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
