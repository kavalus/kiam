import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeUsersComponent } from './administrative-users.component';

describe('AdministrativeUsersComponent', () => {
  let component: AdministrativeUsersComponent;
  let fixture: ComponentFixture<AdministrativeUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrativeUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
