import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GeneralService } from '../Géneral/general.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: GeneralService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const user = this.authService.getCurrentUser(); // doit contenir `role`

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles.includes(user.role)) {
      return true;
    }

    this.router.navigate(['/unauthorized']); // tu peux créer cette page si besoin
    return false;
  }
}
