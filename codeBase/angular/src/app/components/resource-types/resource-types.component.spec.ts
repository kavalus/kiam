import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTypesComponent } from './resource-types.component';

describe('ResourceTypesComponent', () => {
  let component: ResourceTypesComponent;
  let fixture: ComponentFixture<ResourceTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
