import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVisitsComponent } from './home-visits.component';

describe('HomeVisitsComponent', () => {
  let component: HomeVisitsComponent;
  let fixture: ComponentFixture<HomeVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeVisitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
