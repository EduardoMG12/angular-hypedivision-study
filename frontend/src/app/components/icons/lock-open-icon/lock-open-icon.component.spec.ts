import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockOpenIconComponent } from './lock-open-icon.component';

describe('LockOpenIconComponent', () => {
  let component: LockOpenIconComponent;
  let fixture: ComponentFixture<LockOpenIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockOpenIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockOpenIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
