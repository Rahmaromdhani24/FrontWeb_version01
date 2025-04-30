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
import { ChefLigneService } from 'src/app/services/Chef de ligne/chef-ligne.service';
import { SoudureService } from 'src/app/services/Agent Qualité Operation Soudure/soudure.service';
import { TorsadageService } from 'src/app/services/Agent Qualite Operation Torsadage/torsadage.service';
import { forkJoin } from 'rxjs';
import { SertissageIDCService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-idc.service';
import { SertissageNormalService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-normal.service';

@Component({
  selector: 'app-add-plan-action-sertissage-normal',
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

  templateUrl: './add-plan-action-sertissage-normal.component.html',
  styleUrl: './add-plan-action-sertissage-normal.component.scss'
})
export class AddPlanActionSertissageNormalComponent implements OnInit {

  donneePlanAction : any  ;
  matriculeTechnicien : any ; 
  operation: string = '';
  sectionFil: string = '';
  numeroPistolet: number = 0;
  role : string ='' ; 
 constructor(private router: Router , private serviceChefLigne : ChefLigneService , 
              private serviceSoudure: SoudureService ,
              private serviceTorsadage: TorsadageService ,
              private serviceSertissageIDC : SertissageIDCService ,
              private serviceSertissageNormal : SertissageNormalService ,
              public  general :GeneralService ) {}
    
  myForm : FormGroup = new FormGroup({
  descriptionProbleme: new FormControl(null, Validators.required),
 // matriculeAgentQualite: new FormControl('', Validators.required),
  descriptionDecision: new FormControl('', Validators.required),
  delais: new FormControl('', Validators.required),
  responsable: new FormControl('', Validators.required)});

 ngOnInit(): void {
  this.matriculeTechnicien = localStorage.getItem('matricule');
  const stored = localStorage.getItem('DonneePlanAction');
  if (stored) {
    const parsed = JSON.parse(stored);
    this.donneePlanAction = parsed;
    this.operation = parsed.typeOperation ;
    this.sectionFil = parsed.sectionFil ;
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
    detailsPlanAction.matricule_operateur = this.donneePlanAction.matriculeAgentQualité;
    detailsPlanAction.description_decision = this.myForm.value.descriptionDecision;
    detailsPlanAction.delais = this.myForm.value.delais;
    detailsPlanAction.responsable = this.myForm.value.responsable;
    
    const pdekId = this.donneePlanAction.pdekId;
    const numeroPage = this.donneePlanAction.numPage;
    const userId = this.matriculeTechnicien;
    const idSoudure =  this.donneePlanAction.id;
    this.serviceChefLigne.ajouterPlanActionSertissageNormal(pdekId, numeroPage,userId,  idSoudure , detailsPlanAction).subscribe({
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
            this.general.donnees = [];
            this.general.nbrNotifications=0 ; 
            this.serviceSoudure.recupererListeSouudresNonValidesChefDeLigne() ;
            this.serviceTorsadage.recupererListeTorsadagesesNonValidesChefDeLigne() ;
            this.serviceSertissageIDC.recupererListeSertissagesIDCNonValidesChefDeLigne();
            this.serviceSertissageNormal.recupererListeSertissagesIDCNonValidesChefDeLigne();
            this.general.recupererNombreNotificationsTousProcessSaufPistoletChefLigne() ;
            this.router.navigate(['/dashboard']);
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

   toLowerCaseWord(word: string): string {
    return word.toLowerCase();
  }
  cancelForm(){
    this.router.navigate(['/ui-components/listePlanAction'])
  }
}
