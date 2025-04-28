import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFlashcardComponent } from './create-flashcard.component';

describe('CreateFlashcardComponent', () => {
  let component: CreateFlashcardComponent;
  let fixture: ComponentFixture<CreateFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFlashcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
