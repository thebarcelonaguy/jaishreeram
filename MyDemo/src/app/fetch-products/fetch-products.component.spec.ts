import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchProductsComponent } from './fetch-products.component';

describe('FetchProductsComponent', () => {
  let component: FetchProductsComponent;
  let fixture: ComponentFixture<FetchProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FetchProductsComponent]
    });
    fixture = TestBed.createComponent(FetchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});