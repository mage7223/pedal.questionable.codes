import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCounter } from './simple-counter';

describe('SimpleCounter', () => {
  let component: SimpleCounter;
  let fixture: ComponentFixture<SimpleCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleCounter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
