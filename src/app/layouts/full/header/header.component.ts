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
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/Géneral/general.service';
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

  constructor(private router : Router , private servicePistolet : PistoletGeneralService , 
              public  serviceGeneral : GeneralService  ){}
  matriculeAgentQualite : number ; 
  pistolets: Pistolet[] = [];
  role : string | null ; 
  notification : Notification ; 
  nom_process : string ; 
  plant : string  | null ; 
  fullname  : string  | null ; 
  roleDashboard : string  | null ; 
  activationBoutonValider : boolean = false ;
  pistoletsValides: Set<number> = new Set();
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

    this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;
   
    
  }

  recupererNombreNotificationsPistolet(){
    this.servicePistolet.getNombreNotifications().subscribe({
      next: (count) => {
        this.serviceGeneral.nbrNotifications = count;

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }
  get pistoletsNonValides() {
    return this.pistolets.filter(p => !this.pistoletsValides.has(p.id));
  }
  recupererListePistoletsNonValides(){
    this.servicePistolet.getPistoletsNonValidees().subscribe({
      next: (data) => {
        this.pistolets = data;
        console.error('pistolets non valides :', this.pistolets);
        this.pistolets.forEach(p => {
          const etat = this.servicePistolet.etatPistolet(p.etendu, p.moyenne, p.type);
          p.activationValider = etat === "vert";
          p.messageEtat = this.genererMessageEtat(etat); // 
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pistolets :', err);
      }
    });
  }
  genererMessageEtat(etat: string): string {
    switch (etat) {
      case 'vert':
        return 'Attente de votre validation immédiate.';
      case 'jaune':
        return 'Zone jaune détectée : une vérification peut être nécessaire.';
      case 'rouge':
        return 'Zone rouge détectée : intervention immédiate requise.';
      default:
        return 'État inconnu.';
    }
  }
  
    formatPistolet(value: string): string {
         return value.replace('PISTOLET_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase());
       }
       getCouleurPistoletStyle(value: string): string {
         const couleur = value.replace('PISTOLET_', '').toLowerCase();
         switch (couleur) {
           case 'rouge':
             return 'color: red; font-weight: bold;';
           case 'vert':
             return 'color: green; font-weight: bold;';
           case 'bleu':
             return 'color: blue; font-weight: bold;';
           case 'jaune':
             return 'color: orange; font-weight: bold;';
           default:
             return 'color: black; font-weight: bold;';
         }
       }
    voirTousNotifications(){
      this.router.navigate(['/ui-components/pageNotificationsPistolet']) 
    }
    getDifferenceFromNow(pistolet: { dateCreation: string; heureCreation: string }): string {
      if (!pistolet?.dateCreation || !pistolet?.heureCreation) {
        return "Date invalide";
      }
    
      const instanceDateStr = `${pistolet.dateCreation}T${pistolet.heureCreation}:00`;
      const instanceDate = new Date(instanceDateStr);
      const now = new Date();
    
      if (isNaN(instanceDate.getTime())) {
        return "Date invalide";
      }
    
      const diffMs = now.getTime() - instanceDate.getTime();
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
      if (totalMinutes < 1) return "Il y a moins d’une minute";
      if (totalMinutes < 60) return `Il y a ${totalMinutes} min`;
      if (totalHours < 24) return `Il y a ${totalHours}h`;
    
      const remainingHours = totalHours % 24;
      return `Il y a ${totalDays}j ${remainingHours}h`;
    }
     voirPistolet(p : Pistolet ) {
          const jsonPistolet = JSON.stringify(p);
          const pistolet: Pistolet = JSON.parse(jsonPistolet);
          const response = {
            pdekId: p.pdekId,
            pageNumber: p.numPage
          };
          console.log('objet pistolet : '+pistolet) ; 
          console.log('objet responseApi , id pdek : '+response.pdekId +", numero de page : "+response.pageNumber) ; 
    
          //Pistolet Rouge
         if(this.formatPistolet(p.type) ==='Rouge'){
          localStorage.setItem("reponseApi", JSON.stringify(response));
          localStorage.setItem("pistolet", JSON.stringify(pistolet));
          this.router.navigate(['/pdekPistoletRouge'])
         }
    
         //Pistolet  Vert
         if(this.formatPistolet(p.type) ==='Vert'){
          localStorage.setItem("reponseApi", JSON.stringify(response));
          localStorage.setItem("pistolet", JSON.stringify(pistolet));
          this.router.navigate(['/pdekPistoletVert'])
    
        }
          //Pistolet Jaune 
         if(this.formatPistolet(p.type) ==='Jaune'){    
          localStorage.setItem("reponseApi", JSON.stringify(response));
          localStorage.setItem("pistolet", JSON.stringify(pistolet));
          this.router.navigate(['/pdekPistoletJaune'])
    
        }
    
         //Pistolet Bleu
         if(this.formatPistolet(p.type) ==='Bleu'){ 
          localStorage.setItem("reponseApi", JSON.stringify(response));
          localStorage.setItem("pistolet", JSON.stringify(pistolet));
          this.router.navigate(['/pdekPistoletBleu'])
         }
            }
      
      validerPdekPistolet(pistoletId: number) {
        this.servicePistolet.validerPistolet(pistoletId, this.matriculeAgentQualite).subscribe({
          next: () => {
            this.recupererNombreNotificationsPistolet();
            console.log('Pistolet validé avec succès');
            this.serviceGeneral.nbrNotifications--;
      
            // ✅ Retirer le pistolet validé de la liste locale
            this.pistolets = this.pistolets.filter(p => p.id !== pistoletId);
      
            Swal.fire({
              title: 'Confirmation !',
              text: 'Pistolet validé avec succès.',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                confirmButton: 'custom-confirm-button'
              }
            });
          },
          error: (err) => {
            console.error('Erreur lors de la validation :', err);
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la validation',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
      
  
    logout(){
      localStorage.clear() ;
      this.router.navigate(['/login'])
    }
}