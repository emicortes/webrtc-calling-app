import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDirectoryComponent } from './user-directory.component';

describe('UserDirectoryComponent', () => {
  let component: UserDirectoryComponent;
  let fixture: ComponentFixture<UserDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDirectoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
