import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyCardLibraryComponent } from './empty-card-library.component';

describe('EmptyCardLibraryComponent', () => {
  let component: EmptyCardLibraryComponent;
  let fixture: ComponentFixture<EmptyCardLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCardLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyCardLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
