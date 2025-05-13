import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from '../Géneral/general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: GeneralService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
