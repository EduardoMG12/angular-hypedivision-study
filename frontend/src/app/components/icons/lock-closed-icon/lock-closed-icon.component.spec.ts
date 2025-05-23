import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockClosedIconComponent } from './lock-closed-icon.component';

describe('LockClosedIconComponent', () => {
  let component: LockClosedIconComponent;
  let fixture: ComponentFixture<LockClosedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockClosedIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockClosedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
