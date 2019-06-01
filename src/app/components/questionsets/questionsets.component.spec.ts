import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsetsComponent } from './questionsets.component';

describe('QuestionsetsComponent', () => {
  let component: QuestionsetsComponent;
  let fixture: ComponentFixture<QuestionsetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
