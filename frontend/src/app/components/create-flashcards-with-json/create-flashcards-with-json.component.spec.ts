import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFlashcardsWithJsonComponent } from './create-flashcards-with-json.component';

describe('CreateFlashcardsWithJsonComponent', () => {
  let component: CreateFlashcardsWithJsonComponent;
  let fixture: ComponentFixture<CreateFlashcardsWithJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFlashcardsWithJsonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFlashcardsWithJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
