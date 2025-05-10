import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-page-not-found',
  imports: [MatButtonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  constructor(private router: Router) {}

  goHome(): void {
    localStorage.clear() ; 
    this.router.navigate(['/login']); 
  }
}
