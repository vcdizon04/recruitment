import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingRequirmentsComponent } from './missing-requirments.component';

describe('MissingRequirmentsComponent', () => {
  let component: MissingRequirmentsComponent;
  let fixture: ComponentFixture<MissingRequirmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingRequirmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingRequirmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
