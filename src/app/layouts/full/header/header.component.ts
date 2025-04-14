import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { Pistolet } from 'src/app/Modeles/Pistolet';
export interface Notification {
    processName: string;  
    message: string;     
    pdekStatus: string;   
    statusColor: string;
    buttons: string[];    // (ex: "Voir PDEK", "Valider PDEK")
    isButtonDisabled?: boolean;  // Si le bouton de validation est désactivé (par défaut false)
  }
@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatMenuModule ,
    MatButtonModule ,
    MatIconModule
    
  ],
  styleUrl:  './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Ajouter ceci
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent  implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  constructor(private router : Router , private servicePistolet : PistoletGeneralService){}

  notificationsCount: number = 0;
  pistolets: Pistolet[] = [];
  role : string | null ; 
  notification : Notification ; 
  nom_process : string ; 
  plant : string  | null ; 
  fullname  : string  | null ; 
  roleDashboard : string  | null ; 
  ngOnInit(): void {
   this.role= localStorage.getItem('role') ;//, "AGENT_QUALITE_PISTOLET");
   this.roleDashboard = localStorage.getItem('roleDashboard') ;
   this.fullname =  localStorage.getItem('fullName') ;
   this.plant=   localStorage.getItem('plant') ;
    if( this.role =="AGENT_QUALITE_PISTOLET"){
      this.nom_process ="Montage Pistolet"; 
      this.recupererNombreNotificationsPistolet() ; 
      this.recupererListePistoletsNonValides() ;
    }

      
  }

  recupererNombreNotificationsPistolet(){
    this.servicePistolet.getNombreNotifications().subscribe({
      next: (count) => {
        this.notificationsCount = count;
        console.error('nombre notifications est  :', this.notificationsCount);

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }

  recupererListePistoletsNonValides(){
    this.servicePistolet.getPistoletsNonValidees().subscribe({
      next: (data) => {
        this.pistolets = data;
        console.error('pistolets non valides :', this.pistolets);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pistolets :', err);
      }
    });
  }
    voirPistolet(pistoletId: number) {
      console.log(`Afficher PDEK pour le pistolet avec ID ${pistoletId}`);
      // Ajouter la logique pour afficher le PDEK de ce pistolet
    }
  
    validerPistolet(pistoletId: number) {
      console.log(`Valider PDEK pour le pistolet avec ID ${pistoletId}`);
    }
    logout(){
      localStorage.clear() ;
      this.router.navigate(['/login'])
    }
}