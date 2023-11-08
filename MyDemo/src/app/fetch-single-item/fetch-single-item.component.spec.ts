import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchSingleItemComponent } from './fetch-single-item.component';

describe('FetchSingleItemComponent', () => {
  let component: FetchSingleItemComponent;
  let fixture: ComponentFixture<FetchSingleItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FetchSingleItemComponent]
    });
    fixture = TestBed.createComponent(FetchSingleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
