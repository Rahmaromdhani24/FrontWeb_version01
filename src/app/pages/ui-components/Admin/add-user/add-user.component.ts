

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common'; 
import { TablerIconsModule } from 'angular-tabler-icons';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';
import Swal from 'sweetalert2';
import { Admin } from 'src/app/Modeles/Admin';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/services/Admin/admin-service.service';
import { Users } from 'src/app/Modeles/Users';

@Component({
selector: 'app-add-user',
  imports: [ 
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        CommonModule , 
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        TablerIconsModule],
 templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent  implements OnInit {
adminForm: FormGroup;
plants: string[] = [];
selectedPlant: string = '';
selectedOperation : string = '';
typeOperations: string[] = [
 "Soudure", 
 "Torsadage"  ,
  "Sertissage_IDC" ,
  "Sertissage_Normal" ,
  "Montage_Pistolet"];
  typesRoles: string[] = [
    "CHEF_DE_LIGNE", 
    "AGENT_QUALITE"  ,
      "TECHNICIEN" ];

constructor(private service: SuperAdminService , private fb: FormBuilder , 
            private router : Router , private serviceAdmin : AdminServiceService) {}
  user = {
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    typeOperation: '',
    plant: '',
    segment: '',
    sexe: '',
    numeroTelephone: '' ,
    role : ''
  };
ngOnInit(): void {
  this.loadPlants();
    this.adminForm = this.fb.group({
      matricule: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      nom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]] , 
      prenom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]] , 
      email: ['', [Validators.required, Validators.email]],
      typeOperation: [''],
      plant: ['', Validators.required],
      segment: ['', [  Validators.max(50)]] , 
      sexe: ['', Validators.required],
      numeroTelephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]] ,
      role: ['', Validators.required],
    });
}


  onSubmit() {
   
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
       Swal.fire({
            title: 'Champs manquants',
            text: 'Veuillez remplir tous les champs obligatoires.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
    }

    const formData = this.adminForm.value;
    console.log('Formulaire soumis :', formData);
     // Création de l'objet Admin avec mapping des champs
  const admin: Users = {
    matricule: formData.matricule,
    nom: formData.nom,
    prenom: formData.prenom,
    email: formData.email,
    plant: formData.plant,
    segment: Number(formData.segment),
    numeroTelephone: Number(formData.numeroTelephone),
    typeOperation: formData.typeOperation,
    sexe: formData.sexe  ,   
    role : formData.role 
  };

  console.log('Admin prêt à être envoyé :', admin);

  // Exemple d'appel au service
  this.serviceAdmin.addUser(admin).subscribe({
next: () => {
  Swal.fire('Succès', 'Utilisateur ajouté avec succès !', 'success');

  // Réinitialisation complète
  this.adminForm.reset(); // Réinitialise les valeurs

  // Supprimer les erreurs et les états touchés
  Object.keys(this.adminForm.controls).forEach(key => {
    const control = this.adminForm.get(key);
    control?.setErrors(null);       // Supprimer les erreurs
    control?.markAsPristine();      // Marquer comme vierge
    control?.markAsUntouched();     // Marquer comme non touché
    control?.updateValueAndValidity(); // Recalculer la validité
  });
  this.router.navigate(['/ui-components/users'])
}

,
  error: (err) => {
    console.error('Erreur lors de l\'ajout', err);

    // Vérification du code de statut HTTP dans l'erreur
    if (err.status === 409) {
      // Matricule déjà existant
      Swal.fire('Erreur', 'Le matricule existe déjà !', 'error');
    } else {
      // Autres erreurs
      Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout.', 'error');
    }
  }
});
  }
loadPlants() {
  this.service.getPlants().subscribe({
    next: (data) => this.plants = data,
    error: (err) => console.error('Erreur API', err)
  });
}

formatOperation(label: string): string {
  return label.replace(/_/g, ' '); }


}