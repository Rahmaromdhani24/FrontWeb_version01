import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreursChefLigneComponent } from './erreurs-chef-ligne.component';

describe('ErreursChefLigneComponent', () => {
  let component: ErreursChefLigneComponent;
  let fixture: ComponentFixture<ErreursChefLigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErreursChefLigneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErreursChefLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
