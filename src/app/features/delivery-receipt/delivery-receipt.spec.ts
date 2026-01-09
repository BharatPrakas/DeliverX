import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryReceipt } from './delivery-receipt';

describe('DeliveryReceipt', () => {
  let component: DeliveryReceipt;
  let fixture: ComponentFixture<DeliveryReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
