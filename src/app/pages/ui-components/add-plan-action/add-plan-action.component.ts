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
export class AddPlanActionComponent {

  constructor(private router: Router , private serviceTechnicien : TechnicienServiceService) {}
  
  details: DetailsPlanAction = {
    dateCreation: '',
    heureCreation: '',
    description_probleme: '',
    matricule_operateur: 0,
    matricule_chef_ligne: 0,
    description_decision: '',
    signature_qualite: 0,
    signature_maintenance: 0,
    signature_contermetre: 0
  };
  
  ajouterPlanAction(event: Event) {
    event.preventDefault();
  
  
    const pagePdekId = 5; // ou récupéré dynamiquement
    const userId = 123456; // ou depuis le localStorage ou autre
    console.log("Valeurs du formulaire :", this.details);

   /* this.serviceTechnicien.ajouterPlanAction(pagePdekId, userId, this.details).subscribe({
      next: (data) => {
        console.log('Plan action ajouté avec succès', data);
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout', err);
      }
    });*/
  }
  
  cancelForm(){
    this.router.navigate(['/ui-components/listePlanAction'])
  }
}
