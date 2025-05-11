import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookTabsIconComponent } from './notebook-tabs-icon.component';

describe('NotebookTabsIconComponent', () => {
  let component: NotebookTabsIconComponent;
  let fixture: ComponentFixture<NotebookTabsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookTabsIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebookTabsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
