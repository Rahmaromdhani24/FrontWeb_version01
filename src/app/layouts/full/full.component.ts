import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CoreService } from 'src/app/services/core.service';

import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppNavItemComponent } from './sidebar/nav-item/nav-item.component';
import { navItems } from './sidebar/sidebar-data';
import { AppTopstripComponent } from './top-strip/topstrip.component';
import { NavItem } from './sidebar/nav-item/nav-item';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { GeneralService } from 'src/app/services/Géneral/general.service';


const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';


@Component({
  selector: 'app-full',
  imports: [
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
    HeaderComponent,
    //AppTopstripComponent
  ],
  templateUrl: './full.component.html',
  styleUrl:  './full.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FullComponent implements OnInit {
  navItems = navItems;
  fullName: string = '';
  role: string = '';
  userString  = localStorage.getItem('user') || '';
  userRole: string = localStorage.getItem('role') || '';  // Récupère le rôle de l'utilisateur depuis localStorage
  userSexe: string = '';
  ngOnInit(): void { 
    // Récupération du nom complet de l'utilisateur
    if( this.role =="AGENT_QUALITE_PISTOLET"){
      this.servicePistolet.recupererListePistoletsNonValidesAgentQualite() ;
      this.servicePistolet.getNombreNotifications().subscribe({
      next: (count) => {
          this.serviceGeneral.nbrNotifications = count;
  
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des notifications :', err);
        }
      });
    
    }
    if( this.role =="TECHNICIEN"){
      this.servicePistolet.recupererListePistoletsNonValidesTechniciens() ;
      this.servicePistolet.getNombreNotificationsTechniciens().subscribe({
        next: (count) => {
          this.serviceGeneral.nbrNotifications = count;
  
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des notifications :', err);
        }
      });
    }
    if (this.userString) {
      const user = JSON.parse(this.userString); // Convertir la chaîne en objet
      this.userSexe = user.sexe?.toLowerCase(); // suppose que le champ s'appelle "sexe"
      this.fullName = `${user.prenom} ${user.nom}`; // Affecter à this.fullName
      localStorage.setItem('fullName' , this.fullName ) ; 
      console.log("Nom complet de l'utilisateur : " + this.fullName); // Vérification dans la console
    }
  
    // Récupération du rôle de l'utilisateur
    const storedRole = localStorage.getItem('role');
    const roleMapping: { [key: string]: string } = {
      'AGENT_QUALITE': 'Agent de qualité',
      'AGENT_QUALITE_PISTOLET': 'Agent de qualité',
      'CHEF_DE_LIGNE': 'Chef de ligne',
      'TECHNICIEN': 'Technicien',
      'ADMINISTRATEUR': 'Administrateur'
    };
    this.role = storedRole ? roleMapping[storedRole] || storedRole : 'Rôle inconnu';
    localStorage.setItem('roleDashboard' , this.role ) ; 

  }
  
  clearStorage(){
    localStorage.clear() ; 
    this.router.navigate(['/login']);
  }
  
  getUserImage(): string {
    if (this.userSexe === 'femme') {
      return '/assets/images/profile/image1.png';
    } else {
      return '/assets/images/profile/user-1.jpg'; 
    }
  }
  
  // Fonction pour vérifier si l'utilisateur a accès à un item
  hasAccess(item: NavItem): boolean {
    // Si aucun rôle n'est spécifié, on affiche l'élément
    if (!item.roles) {
      return true;
    }
    // Si l'élément a des rôles spécifiés, on vérifie si l'utilisateur a l'un des rôles
    return item.roles.includes(this.userRole);
  }

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;
  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  options = this.settings.getOptions();
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }


  constructor(
    private settings: CoreService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private servicePistolet : PistoletGeneralService , 
    public  serviceGeneral : GeneralService 
  ) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
      });

    
















































    
    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });
  }



  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    //this.settings.setOptions(this.options);
  }
  
  

}
