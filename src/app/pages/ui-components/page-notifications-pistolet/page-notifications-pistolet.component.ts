import { Component  , OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { PistoletMecaniqueService } from 'src/app/services/Agent Qualité Montage Pistolet/Ajout PDEK Pistolet/pistolet-mecanique.service';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Assure-toi que CommonModule est importé
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AjoutPistoletResponse } from 'src/app/Modeles/AjoutPistoletResponse';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { GeneralService } from 'src/app/services/Géneral/general.service';

interface CoupePropre {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-page-notifications-pistolet',
  imports: [ MatFormFieldModule,
      MatSelectModule,
      FormsModule,
      ReactiveFormsModule,
      MatRadioModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatCheckboxModule,
      CommonModule],
  templateUrl: './page-notifications-pistolet.component.html',
  styleUrl: './page-notifications-pistolet.component.scss'
})
export class PageNotificationsPistoletComponent implements OnInit {

constructor(private router : Router , private servicePistolet : PistoletGeneralService ,
  private pistoletGeneralService: PistoletGeneralService ,  public  serviceGeneral : GeneralService ){}

  matriculeAgentQualite : number ; 
  pistolets: Pistolet[] = [];
  role : string | null ; 
  notification : Notification ; 
  nom_process : string ; 
  plant : string  | null ; 
  fullname  : string  | null ; 
  roleDashboard : string  | null ; 
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

  recupererListePistoletsNonValides(){
    this.servicePistolet.getPistoletsNonValidees().subscribe({
      next: (data) => {
        this.pistolets = data;
        this.pistolets.forEach(p => {
          const etat = this.servicePistolet.etatPistolet(p.etendu, p.moyenne, p.type);
          p.activationValider = etat === "vert";
          p.messageEtat = this.genererMessageEtat(etat); 
        });  
     },
      error: (err) => {
        console.error('Erreur lors de la récupération des pistolets :', err);
      }
    });
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
          this.pistoletGeneralService.validerPistolet(pistoletId, this.matriculeAgentQualite).subscribe({
            next: () => {
              this.recupererNombreNotificationsPistolet();
              console.log('Pistolet validé avec succès');
              this.pistoletsValides.add(pistoletId); // Marquer ce pistolet comme validé
            
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
        
    
    voirTousNotifications(){
      this.router.navigate(['/ui-components/pageNotifications']) 
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
    get pistoletsNonValides() {
      return this.pistolets.filter(p => !this.pistoletsValides.has(p.id));
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
    
    genererMessageEtat(etat: string): string {
      switch (etat) {
        case 'vert':
          return 'attente de votre validation immédiate.';
        case 'jaune':
          return 'zone jaune détectée : une vérification peut être nécessaire.';
        case 'rouge':
          return 'zone rouge détectée : intervention immédiate requise.';
        default:
          return 'État inconnu.';
      }
    }
    
 
    logout(){
      localStorage.clear() ;
      this.router.navigate(['/login'])
    }
}