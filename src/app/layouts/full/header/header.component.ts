import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
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
import { Soudure } from 'src/app/Modeles/Soudure';
import { Torsadage } from 'src/app/Modeles/Torsadage';
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/Géneral/general.service';
import { SoudureService } from 'src/app/services/Agent Qualité Operation Soudure/soudure.service';
import { TorsadageService } from 'src/app/services/Agent Qualite Operation Torsadage/torsadage.service';
import { forkJoin, interval, Subject, takeUntil } from 'rxjs';
import { SertissageNormal } from 'src/app/Modeles/SertissageNormal';
import { SertissageIDC } from 'src/app/Modeles/SertissageIDC';
import { SertissageIDCService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-idc.service';
import { SertissageNormalService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-normal.service';

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
              public  serviceGeneral : GeneralService , public serviceSoudure : SoudureService ,
              public serviceTorsadage : TorsadageService  , 
              public serviceSertissageIDC : SertissageIDCService  ,
              public serviceSertissageNormal : SertissageNormalService , 
              private cdr: ChangeDetectorRef ){}
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
  dropdownOpen = false;
  userSexe: string = '';
  userString  = localStorage.getItem('user') || '';
  operationUser  = localStorage.getItem('operation') || '';
  operationUser1  = localStorage.getItem('operation') ?? null;
  languages = [
    { code: 'fr', label: 'Français', flag: 'assets/flags/fr.png' },
    { code: 'en', label: 'English', flag: 'assets/flags/gb.png' },
    { code: 'de', label: 'Deutsch', flag: 'assets/flags/de.png' }
  ];

  selectedLang = this.languages[0];

  toggleDropdown() {  this.dropdownOpen = !this.dropdownOpen; }
  
  changeLanguage(lang: any) {  this.selectedLang = lang;  this.dropdownOpen = false;
    const frame = document.querySelector('iframe.goog-te-menu-frame') as HTMLIFrameElement;
    if (frame) {
      const innerDoc = frame.contentDocument || frame.contentWindow?.document;
      const items = innerDoc?.querySelectorAll('.goog-te-menu2-item span.text');
      items?.forEach((el: any) => {
        if (el.innerText === lang.label) {
          (el as HTMLElement).click();
        }
      });
    }
  }
private destroy$ = new Subject<void>();
  ngOnInit(): void {
  this.cdr.detectChanges();
  const user = JSON.parse(this.userString); // Convertir la chaîne en objet
  this.userSexe = user.sexe?.toLowerCase(); // suppose que le champ s'appelle "sexe"
   this.role= localStorage.getItem('role') ;//, "AGENT_QUALITE_PISTOLET");
   this.roleDashboard = localStorage.getItem('roleDashboard') ;
   this.fullname =  localStorage.getItem('fullName') ;
   this.plant=   localStorage.getItem('plant') ;
   this.plant=   localStorage.getItem('plant') ;
   this.operationUser1 = localStorage.getItem('operation') || null;
   console.log('operation:', this.operationUser); // Sertissage IDC, etc.
   this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletChefLigne() ; 
   console.log('role:', this.role);
   this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletChefLigne() ; 

   if (this.operationUser1 === 'undefined') {
     this.operationUser1 = null;
   }
   if (this.role === 'AGENT_QUALITE_PISTOLET') {
  this.nom_process = "Montage Pistolet";
  // S'abonner une seule fois
  this.serviceGeneral.nbrNotifications$.subscribe(val => {
    console.log("Nombre de notifications Pistolet mis à jour :", val);
  });
  // Appels aux services
  this.servicePistolet.recupererListePistoletsNonValidesAgentQualite();
  this.recupererNombreNotificationsPistolet(); // ✅ Appel correct ici
}

if (this.role === "TECHNICIEN") {
  this.nom_process = "Montage Pistolet";
  this.serviceGeneral.nbrNotifications$.subscribe(val => {
    console.log("Notifications Technicien (reactif) :", val);
  });
  this.serviceGeneral.donnees = [];
  this.servicePistolet.recupererListePistoletsNonValidesTechniciens();
  this.recupererNombreNotificationsTechnicien();
}


  if (this.role === 'AGENT_QUALITE') {
  this.serviceGeneral.donnees = [];
  // S'abonner UNE SEULE FOIS au BehaviorSubject
  this.serviceGeneral.nbrNotifications$.subscribe(val => {
    console.log("Nombre de notifications mis à jour :", val);
  });

  // Lancer les appels
  this.serviceSoudure.recupererListeSouudresNonValidesAgentQualite();
  this.serviceTorsadage.recupererListeTorsadagesesNonValidesAgentQualite();
  this.serviceSertissageIDC.recupererListeSertissagesIDCNonValidesAgentQualite();
  this.serviceSertissageNormal.recupererListeSertissagesIDCNonValidesAgentQualite();
  this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletAgentQualite();
}

      if (this.role === 'CHEF_DE_LIGNE') {
      this.serviceGeneral.donnees = [];

      // ⬇️ On s'abonne une seule fois ici
      this.serviceGeneral.nbrNotifications$.subscribe(val => {
        this.serviceGeneral.nbrNotifications = val;
        this.cdr.detectChanges(); // utile seulement si la détection ne se fait pas automatiquement
      });

      // Récupérer les notifications et les données associées
      this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletChefLigne();

      switch (this.operationUser) {
        case 'Soudure':
          this.serviceSoudure.recupererListeSouudresNonValidesChefDeLigne();
          break;
        case 'Torsadage':
          this.serviceTorsadage.recupererListeTorsadagesesNonValidesChefDeLigne();
          break;
        case 'Sertissage_IDC':
          this.serviceSertissageIDC.recupererListeSertissagesIDCNonValidesChefDeLigne();
          break;
        case 'Sertissage_Normal':
          this.serviceSertissageNormal.recupererListeSertissagesIDCNonValidesChefDeLigne();
          break;
      }
    }

    this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;
   
    
  }
  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
  getUserImage(): string {
    if (this.userSexe === 'femme') {
      return '/assets/images/profile/image1.png';
    } else {
      return '/assets/images/profile/user-1.jpg'; 
    }
  }
  /*recupererNombreNotificationsPistolet(){
    this.servicePistolet.getNombreNotifications().subscribe({
      next: (count) => {
        this.serviceGeneral.nbrNotifications = count;

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }*/
recupererNombreNotificationsPistolet() {
  this.servicePistolet.getNombreNotifications().subscribe({
    next: (count) => {
      this.serviceGeneral.setNombreNotifications(count); // ✅ MAJ via le BehaviorSubject
      console.log('Nombre de notifications Pistolet :', count);
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des notifications :', err);
    }
  });
}



 /* recupererNombreNotificationsTechnicien(){
    this.servicePistolet.getNombreNotificationsTechniciens().subscribe({
      next: (count) => {
        this.serviceGeneral.nbrNotifications = count;

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }*/
recupererNombreNotificationsTechnicien() {
  this.servicePistolet.getNombreNotificationsTechniciens().subscribe({
    next: (count) => {
      this.serviceGeneral.setNombreNotifications(count); // ✅ met à jour le BehaviorSubject
      console.log("Notifications technicien Pistolet :", count);
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des notifications :', err);
    }
  });
}


  get pistoletsNonValides() {
    return this.serviceGeneral.pistolets.filter(p => !this.pistoletsValides.has(p.id));
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
  
  genererMessageEtatAllProcess(etat: string): string {
    switch (etat) {
      case 'vert':
        return ', Attente de votre validation immédiate.';
      case 'jaune':
        return ' , Zone jaune détectée : une vérification peut être nécessaire.';
      case 'rouge':
        return ' , Zone rouge détectée : intervention immédiate requise.';
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

    voirTousNotificationsAllProcess(){
      this.router.navigate(['/ui-components/pagesNotificationsAllProcess']) 
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

    voirPdek(p: any) {
      console.log("Objet à afficher :", p);
      if (p.typeOperation === 'Soudure') {
        const soudure: Soudure = p as Soudure; // 👈 Pas besoin de passer par JSON
        console.log('Objet Soudure :', soudure);
        const response = {
          pdekId: p.pdekId,
          pageNumber: p.numPage };      
          console.log('Objet responseApi, id pdek :', response.pdekId, ", numéro de page :", response.pageNumber);
          localStorage.setItem("reponseApi", JSON.stringify(response));
          localStorage.setItem("soudure", JSON.stringify(soudure)); // Ici on stringify directement
          this.router.navigate(['/pdekSoudure']);
      }
         if (p.typeOperation === 'Torsadage') {
           const torsadage: Torsadage = p as Torsadage; // 👈 Pas besoin de passer par JSON
           console.log('Objet Torsadage :', torsadage);      
           const response = {
             pdekId: p.pdekId,
             pageNumber: p.numPage
           };
           console.log('Objet responseApi, id pdek :', response.pdekId, ", numéro de page :", response.pageNumber);     
           localStorage.setItem("reponseApi", JSON.stringify(response));
           localStorage.setItem("torsadage", JSON.stringify(torsadage)); // Ici on stringify directement
           this.router.navigate(['/pdekTorsadage']);
         }
  if (p.typeOperation === 'SertissageIDC') {
        const sertissage: SertissageIDC = p as SertissageIDC; // 👈 Pas besoin de passer par JSON
        console.log('Objet sertissage :', sertissage);
        const response = {
          pdekId: p.pdekId,
          pageNumber: p.numPage };   
        console.log('Objet responseApi, id pdek :', response.pdekId, ", numéro de page :", response.pageNumber);
        localStorage.setItem("reponseApi", JSON.stringify(response));
        localStorage.setItem("sertissage", JSON.stringify(sertissage)); // Ici on stringify directement
        this.router.navigate(['/pdekSertissageIDC']);
      }
      if (p.typeOperation === 'SertissageNormal') {
        const sertissage: SertissageNormal= p as SertissageNormal;
        console.log('Objet sertissage :', sertissage);
        const response = {
          pdekId: p.pdekId,
          pageNumber: p.numPage };   
        console.log('Objet responseApi, id pdek :', response.pdekId, ", numéro de page :", response.pageNumber);
        localStorage.setItem("reponseApi", JSON.stringify(response));
        localStorage.setItem("sertissage", JSON.stringify(sertissage)); // Ici on stringify directement
        this.router.navigate(['/pdekSertissage']);
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
    if (p.typeOperation === 'SertissageIDC') {
      const sertissage: SertissageIDC = p as SertissageIDC;
      localStorage.setItem("DonneePlanAction", JSON.stringify(sertissage));    
      this.router.navigate(['/ui-components/addPlanActionSertissageIDC']);
    }
    if (p.typeOperation === 'SertissageNormal') {
      const sertissage: SertissageNormal = p as SertissageNormal;
      localStorage.setItem("DonneePlanAction", JSON.stringify(sertissage));    
      this.router.navigate(['/ui-components/addPlanActionSertissageNormal']);
    }
  }
      validerPdekPistolet(pistoletId: number) {
        this.servicePistolet.validerPistolet(pistoletId, this.matriculeAgentQualite).subscribe({
          next: () => {
            this.recupererNombreNotificationsPistolet();
            console.log('Pistolet validé avec succès');
            this.serviceGeneral.nbrNotifications--;
      
            // ✅ Retirer le pistolet validé de la liste locale
            this.serviceGeneral.pistolets = this.serviceGeneral.pistolets.filter(p => p.id !== pistoletId);
      
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
      
      creerPlanAction(p: Pistolet) {
        console.log('Création d’un plan d’action pour le pistolet :', p);
      
        const pistoletJson = JSON.stringify(p) ;
        localStorage.setItem('PistoletPlanAction', pistoletJson); 
      
        this.router.navigate(['/ui-components/addPlanAction']);
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

 
         validerPdek(donnee : any) {
           console.log("Objet valider  :"+donnee) ; 
           if(donnee.typeOperation ==='Soudure'){
           this.serviceSoudure.validerSoudure (donnee.id, this.matriculeAgentQualite).subscribe({
             next: () => {
               this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletAgentQualite();
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
         if(donnee.typeOperation ==='Torsadage'){
          this.serviceTorsadage.validerTorsadage (donnee.id, this.matriculeAgentQualite).subscribe({
            next: () => {
              this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletAgentQualite();
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
        if(donnee.typeOperation ==='SertissageIDC'){
          this.serviceSertissageIDC.validerSertissageIDC (donnee.id, this.matriculeAgentQualite).subscribe({
            next: () => {
              this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletAgentQualite();
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
        if(donnee.typeOperation ==='SertissageNormal'){
          this.serviceSertissageNormal.validerSertissageNormal (donnee.id, this.matriculeAgentQualite).subscribe({
            next: () => {
              this.serviceGeneral.recupererNombreNotificationsTousProcessSaufPistoletAgentQualite();
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

  formatAttribut(input: string): string {
  return input.toLowerCase().replace(/_/g, ' ');}

    logout(){
      localStorage.clear() ;
      this.router.navigate(['/login'])
    }
}