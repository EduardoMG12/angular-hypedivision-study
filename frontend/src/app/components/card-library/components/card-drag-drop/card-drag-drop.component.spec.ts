import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDragDropComponent } from './card-drag-drop.component';

describe('CardDragDropComponent', () => {
  let component: CardDragDropComponent;
  let fixture: ComponentFixture<CardDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
