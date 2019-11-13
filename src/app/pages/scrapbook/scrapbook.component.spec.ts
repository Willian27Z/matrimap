import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapbookComponent } from './scrapbook.component';

describe('ScrapbookComponent', () => {
  let component: ScrapbookComponent;
  let fixture: ComponentFixture<ScrapbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrapbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrapbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
