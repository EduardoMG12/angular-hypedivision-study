import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumIconComponent } from './album-icon.component';

describe('AlbumIconComponent', () => {
  let component: AlbumIconComponent;
  let fixture: ComponentFixture<AlbumIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
