import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewvoucherComponent } from './viewvoucher.component';

describe('ViewvoucherComponent', () => {
  let component: ViewvoucherComponent;
  let fixture: ComponentFixture<ViewvoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewvoucherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
