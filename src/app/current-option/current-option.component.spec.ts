import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOptionComponent } from './current-option.component';

describe('CurrentOptionComponent', () => {
  let component: CurrentOptionComponent;
  let fixture: ComponentFixture<CurrentOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
