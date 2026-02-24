import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReceipt } from './purchase-receipt';

describe('PurchaseReceipt', () => {
  let component: PurchaseReceipt;
  let fixture: ComponentFixture<PurchaseReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
