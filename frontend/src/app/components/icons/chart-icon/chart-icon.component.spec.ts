import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartIconComponent } from './chart-icon.component';

describe('ChartIconComponent', () => {
  let component: ChartIconComponent;
  let fixture: ComponentFixture<ChartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
