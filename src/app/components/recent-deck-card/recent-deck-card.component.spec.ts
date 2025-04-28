import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentDeckCardComponent } from './recent-deck-card.component';

describe('RecentDeckCardComponent', () => {
  let component: RecentDeckCardComponent;
  let fixture: ComponentFixture<RecentDeckCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentDeckCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentDeckCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
