import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LupeIconComponent } from './lupe-icon.component';

describe('LupeIconComponent', () => {
  let component: LupeIconComponent;
  let fixture: ComponentFixture<LupeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LupeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LupeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
