import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplePay } from './simple-pay';

describe('SimplePay', () => {
  let component: SimplePay;
  let fixture: ComponentFixture<SimplePay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimplePay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplePay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
