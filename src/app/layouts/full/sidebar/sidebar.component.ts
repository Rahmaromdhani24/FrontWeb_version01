import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  imports: [BrandingComponent, TablerIconsModule, MaterialModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  userRole: string = localStorage.getItem('role') || '';  // Récupère le rôle de l'utilisateur depuis localStorage
  filteredNavItems: NavItem[];
  constructor() {
    this.filteredNavItems = this.filterNavItems(navItems);
  }
  filterNavItems(items: NavItem[]): NavItem[] {
    return items
      .filter(item => {
        // Si "roles" n'est pas défini, l'élément est visible pour tous
        if (!item.roles) {
          return true;
        }
        // Vérifie si le rôle de l'utilisateur (en localStorage) est inclus dans les "roles" de l'élément
        return item.roles.some(role => role.toUpperCase() === this.userRole.toUpperCase());
      })
      .map(item => ({
        ...item,
        children: item.children ? this.filterNavItems(item.children) : undefined, // Filtre les enfants récursivement
      }));
  }
  

  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  ngOnInit(): void {}
}
