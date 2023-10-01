import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsAttentionComponent } from './visits-attention.component';

describe('VisitsAttentionComponent', () => {
  let component: VisitsAttentionComponent;
  let fixture: ComponentFixture<VisitsAttentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitsAttentionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitsAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
