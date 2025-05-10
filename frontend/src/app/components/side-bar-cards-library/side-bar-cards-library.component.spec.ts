import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarCardsLibraryComponent } from './side-bar-cards-library.component';

describe('SideBarCardsLibraryComponent', () => {
  let component: SideBarCardsLibraryComponent;
  let fixture: ComponentFixture<SideBarCardsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarCardsLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarCardsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
