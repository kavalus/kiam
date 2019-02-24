import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapconfigComponent } from './ldapconfig.component';

describe('LdapconfigComponent', () => {
  let component: LdapconfigComponent;
  let fixture: ComponentFixture<LdapconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdapconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
