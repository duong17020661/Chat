import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoChatComponent } from './info-chat.component';

describe('InfoChatComponent', () => {
  let component: InfoChatComponent;
  let fixture: ComponentFixture<InfoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
