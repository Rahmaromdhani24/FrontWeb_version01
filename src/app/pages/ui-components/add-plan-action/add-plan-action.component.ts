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
import { EmailPistoletRequest } from 'src/app/Modeles/EmailPistoletRequest';
import { User } from 'src/app/Modeles/User';
import { TechnicienServiceService } from 'src/app/services/Technicien/technicien-service.service';
import { DetailsPlanAction } from 'src/app/Modeles/DetailsPlanAction';
import { GeneralService } from 'src/app/services/Géneral/general.service';

@Component({
  selector: 'app-add-plan-action',
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
  templateUrl: './add-plan-action.component.html',
  styleUrl: './add-plan-action.component.scss'
})
export class AddPlanActionComponent implements OnInit {

  pistoletPlanAction : any  ;
  matriculeTechnicien : any ; 
  categoriePistolet: string = '';
  couleurPistolet: string = '';
  numeroPistolet: number = 0;
 constructor(private router: Router , private serviceTechnicien : TechnicienServiceService , 
              private servicePistoletGeneral: PistoletGeneralService ,private  general :GeneralService ) {}
    
  myForm : FormGroup = new FormGroup({
  descriptionProbleme: new FormControl(null, Validators.required),
 // matriculeAgentQualite: new FormControl('', Validators.required),
  descriptionDecision: new FormControl('', Validators.required),
  delais: new FormControl('', Validators.required),
  responsable: new FormControl('', Validators.required)});

 ngOnInit(): void {
  this.matriculeTechnicien = localStorage.getItem('matricule');
  const stored = localStorage.getItem('PistoletPlanAction');
  if (stored) {
    const parsed = JSON.parse(stored);
    this.pistoletPlanAction = parsed;
    this.categoriePistolet = parsed.categorie ;
    this.couleurPistolet = this.getCouleurPistoletStyle(parsed.type );
    this.numeroPistolet = parsed.numeroPistolet;
  } 
}

submitForm() {
  console.log("Formulaire (JSON) :", JSON.stringify(this.myForm.value, null, 2));

  if (this.myForm.invalid) {
    Swal.fire({
      title: 'Champs manquants',
      text: 'Veuillez remplir tous les champs obligatoires.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (this.myForm.valid) {
    const detailsPlanAction: DetailsPlanAction = new DetailsPlanAction();
    detailsPlanAction.description_probleme = this.myForm.value.descriptionProbleme;
    detailsPlanAction.matricule_operateur = this.pistoletPlanAction.matriculeAgentQualité;
    detailsPlanAction.description_decision = this.myForm.value.descriptionDecision;

    const pdekId = this.pistoletPlanAction.pdekId;
    const numeroPage = this.pistoletPlanAction.numPage;
    const userId = this.matriculeTechnicien;
    const numeroPistolet = this.pistoletPlanAction.numeroPistolet;
    const typePistolet = this.pistoletPlanAction.type;
    const categoriePistolet = this.pistoletPlanAction.categorie;
    this.serviceTechnicien.ajouterPlanAction(pdekId, numeroPage,userId,  numeroPistolet,
        typePistolet , categoriePistolet , detailsPlanAction).subscribe({
      next: (data) => {
        console.log('Plan action ajouté avec succès', data);
        Swal.fire({
          title: 'Ajout réussi !',
          text: "Le plan d'action a été ajouté avec succès.",
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            confirmButton: 'custom-confirm-button'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicePistoletGeneral.recupererListePistoletsNonValidesTechniciens() ;
            this.recupererNombreNotificationsTechnicien() ; 
            this.general.nbrNotifications --;
         
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout', err);
        Swal.fire({
          title: 'Erreur',
          text: "Erreur dans ajout de plan d'acion.",
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
recupererNombreNotificationsTechnicien(){
  this.servicePistoletGeneral.getNombreNotificationsTechniciens().subscribe({
    next: (count) => {
      this.general.nbrNotifications = count;

    },
    error: (err) => {
      console.error('Erreur lors de la récupération des notifications :', err);
    }
  });
}
  getCouleurPistoletStyle(value: string): string {
    const couleur = value.replace('PISTOLET_', '').toLowerCase();
    switch (couleur) {
      case 'rouge':
        return 'rouge';
      case 'vert':
        return 'vert';
      case 'bleu':
        return 'bleu';
      case 'jaune':
        return 'jaune';
      default:
        return 'color: black; font-weight: bold;';
    }
  }
   toLowerCaseWord(word: string): string {
    return word.toLowerCase();
  }
  cancelForm(){
    this.router.navigate(['/ui-components/listePlanAction'])
  }
}
