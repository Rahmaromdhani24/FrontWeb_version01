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
import { SoudureService } from 'src/app/services/Agent Qualité Operation Soudure/soudure.service';
import { Soudure } from 'src/app/Modeles/Soudure';
import { TorsadageService } from 'src/app/services/Agent Qualite Operation Torsadage/torsadage.service';
import { forkJoin } from 'rxjs';
import { Torsadage } from 'src/app/Modeles/Torsadage';


@Component({
  selector: 'app-page-tous-notifications-all-process',
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
  templateUrl:  './page-tous-notifications-all-process.component.html',
  styleUrl: './page-tous-notifications-all-process.component.scss'
})
export class PageTousNotificationsAllProcessComponent implements OnInit {

constructor(private router : Router , private servicePistolet : PistoletGeneralService ,
  public serviceSoudure : SoudureService ,  public  serviceGeneral : GeneralService ,
  public serviceTorsadage : TorsadageService ){}

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

   if( this.role =="AGENT_QUALITE"){
   // this.serviceSoudure.recupererListeSouudresNonValidesAgentQualite() ;
    //this.serviceTorsadage.recupererListeTorsadagesesNonValidesAgentQualite() ;
    this.recupererNombreNotificationsTousProcessSaufPistolet() ;  
  }
  if( this.role =="CHEF_DE_LIGNE"){
    //this.serviceSoudure.recupererListeSouudresNonValidesChefDeLigne() ;
    //this.serviceTorsadage.recupererListeTorsadagesesNonValidesChefDeLigne() ;
    this.recupererNombreNotificationsTousProcessSaufPistolet() ; 
  }
  this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;
      
  }
  

 
  voirPdek(p: any) {
    console.log("Objet à afficher :", p);
  
    if (p.typeOperation === 'Soudure') {
      const soudure: Soudure = p as Soudure; // 👈 Pas besoin de passer par JSON
      console.log('Objet Soudure :', soudure);
  
      const response = {
        pdekId: p.pdekId,
        pageNumber: p.numPage
      };
      console.log('Objet responseApi, id pdek :', response.pdekId, ", numéro de page :", response.pageNumber);
  
      localStorage.setItem("reponseApi", JSON.stringify(response));
      localStorage.setItem("soudure", JSON.stringify(soudure)); // Ici on stringify directement
      this.router.navigate(['/pdekSoudure']);
    }
  }
  

/*
     if(this.formatPistolet(p.type) ==='Rouge'){
      localStorage.setItem("reponseApi", JSON.stringify(response));
      localStorage.setItem("pistolet", JSON.stringify(pistolet));
      this.router.navigate(['/pdekPistoletRouge'])
     }

     if(this.formatPistolet(p.type) ==='Vert'){
      localStorage.setItem("reponseApi", JSON.stringify(response));
      localStorage.setItem("pistolet", JSON.stringify(pistolet));
      this.router.navigate(['/pdekPistoletVert'])

    }
     if(this.formatPistolet(p.type) ==='Jaune'){    
      localStorage.setItem("reponseApi", JSON.stringify(response));
      localStorage.setItem("pistolet", JSON.stringify(pistolet));
      this.router.navigate(['/pdekPistoletJaune'])

    }

     if(this.formatPistolet(p.type) ==='Bleu'){ 
      localStorage.setItem("reponseApi", JSON.stringify(response));
      localStorage.setItem("pistolet", JSON.stringify(pistolet));
      this.router.navigate(['/pdekPistoletBleu'])
     }*/
        
  
        valider(donnee : any) {
          console.log("Objet valider  :"+donnee) ; 
          if(donnee.typeOperation ==='Soudure'){
          this.serviceSoudure.validerSoudure (donnee.id, this.matriculeAgentQualite).subscribe({
            next: () => {
              this.recupererNombreNotificationsTousProcessSaufPistoletAgentQualite();
              console.log('Pdek validé avec succès');
              this.pistoletsValides.add(donnee.id); 
             this.serviceGeneral.donnees = this.serviceGeneral.donnees.filter(p => p.id !== donnee.id);

              Swal.fire({
                title: 'Confirmation !',
                text: 'Pdek validé avec succès.',
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
      return this.serviceGeneral.pistolets.filter(p => !this.pistoletsValides.has(p.id));
    }  

    getDifferenceFromNowAll(donnee: { date: string; heureCreation: string }): string {
      if (!donnee?.date || !donnee?.heureCreation) {
        return "Date invalide";
      }
    
      const instanceDateStr = `${donnee.date}T${donnee.heureCreation}:00`;
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

  
    
    recupererNombreNotificationsTechnicien(){
      this.servicePistolet.getNombreNotificationsTechniciens().subscribe({
        next: (count) => {
          this.serviceGeneral.nbrNotifications = count;
  
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des notifications :', err);
        }
      });
    }
   
   recupererNombreNotificationsTousProcessSaufPistoletAgentQualite() {
      forkJoin([
        this.serviceSoudure.getNombreNotificationsAgentQualitePourValidation(),
        this.serviceTorsadage.getNombreNotificationsAgentQualitePourValidation()
      ]).subscribe({
        next: ([countSoudure, countTorsadage]) => {
          this.serviceGeneral.nbrNotifications = countSoudure + countTorsadage;
          console.log('Total notifications :', this.serviceGeneral.nbrNotifications);
        },
        error: (err: any) => {
          console.error('Erreur lors de la récupération des notifications :', err);
        }
      });
    }
  
    genererMessageEtatAllProcess(etat: string): string {
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

        creerPlanActionAllProcess(p: any) {
          if (p.typeOperation === 'Soudure') {
          const soudure: Soudure = p as Soudure;
          localStorage.setItem("DonneePlanAction", JSON.stringify(soudure));    
          this.router.navigate(['/ui-components/addPlanActionSoudure']);
        }
        if (p.typeOperation === 'Torsadage') {
          const torsadage: Torsadage = p as Torsadage;
          localStorage.setItem("DonneePlanAction", JSON.stringify(torsadage));    
          this.router.navigate(['/ui-components/addPlanActionTorsadage']);
        }
      }

      
        recupererNombreNotificationsTousProcessSaufPistoletChefLigne(){
          forkJoin([
            this.serviceSoudure.getNombreNotificationsChefDeLigne(),
            this.serviceTorsadage.getNombreNotificationsChefDeLigne()
          ]).subscribe({
            next: ([countSoudure, countTorsadage]) => {
              this.serviceGeneral.nbrNotifications = countSoudure + countTorsadage;
              console.log('Total notifications :', this.serviceGeneral.nbrNotifications);
            },
            error: (err: any) => {
              console.error('Erreur lors de la récupération des notifications :', err);
            }
          });
        }
        recupererNombreNotificationsTousProcessSaufPistolet() {
          forkJoin([
            this.serviceSoudure.getNombreNotificationsAgentQualitePourValidation(),
            this.serviceTorsadage.getNombreNotificationsAgentQualitePourValidation()
          ]).subscribe({
            next: ([countSoudure, countTorsadage]) => {
              this.serviceGeneral.nbrNotifications = countSoudure + countTorsadage;
              console.log('Total notifications :', this.serviceGeneral.nbrNotifications);
            },
            error: (err: any) => {
              console.error('Erreur lors de la récupération des notifications :', err);
            }
          });
        }
    logout(){
      localStorage.clear() ;
      this.router.navigate(['/login'])
    }
}