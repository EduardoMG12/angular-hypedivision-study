import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLibraryComponent } from './card-library.component';

describe('CardLibraryComponent', () => {
  let component: CardLibraryComponent;
  let fixture: ComponentFixture<CardLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
