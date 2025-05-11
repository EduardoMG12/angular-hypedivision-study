import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOutIconComponent } from './log-out-icon.component';

describe('LogOutIconComponent', () => {
  let component: LogOutIconComponent;
  let fixture: ComponentFixture<LogOutIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogOutIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogOutIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
