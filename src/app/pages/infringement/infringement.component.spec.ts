import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfringementComponent } from './infringement.component';

describe('InfringementComponent', () => {
  let component: InfringementComponent;
  let fixture: ComponentFixture<InfringementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfringementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfringementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
