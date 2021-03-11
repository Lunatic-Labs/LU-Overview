import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTestComponent } from './data-test.component';

describe('DataTestComponent', () => {
  let component: DataTestComponent;
  let fixture: ComponentFixture<DataTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
