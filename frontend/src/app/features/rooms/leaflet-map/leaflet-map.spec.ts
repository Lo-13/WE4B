import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletMap } from './leaflet-map';

describe('LeafletMap', () => {
  let component: LeafletMap;
  let fixture: ComponentFixture<LeafletMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeafletMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeafletMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
