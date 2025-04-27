import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotIconComponent } from './robot-icon.component';

describe('RobotIconComponent', () => {
  let component: RobotIconComponent;
  let fixture: ComponentFixture<RobotIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
