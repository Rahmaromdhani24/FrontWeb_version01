
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
import { GeneralService } from 'src/app/services/Géneral/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
 selector: 'app-update-admin',
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
 templateUrl: './update-admin.component.html',
  styleUrl: './update-admin.component.scss'
})
export class UpdateAdminComponent  implements OnInit {
adminForm: FormGroup;
plants: string[] = [];
selectedPlant: string = '';
selectedOperation : string = '';
typeAdmin: string[] = [
 "Admin_ppo", 
 "Admin_qualité"  ,
"Admin_production"];
constructor(private service: SuperAdminService , private fb: FormBuilder ,
            private router : Router ,private route : ActivatedRoute  ) {}
  admin = {
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    typeAdmin: '',
    plant: '',
    segment: '',
    sexe: '',
    numeroTelephone: ''
  };
ngOnInit(): void {
  this.loadPlants();
  this.adminForm = this.fb.group({
    matricule: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    nom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]],
    prenom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    typeAdmin: ['', Validators.required],
    plant: ['', Validators.required],
    segment: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
    sexe: ['', Validators.required],
    numeroTelephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
  });
this.adminForm.get('matricule')?.disable();

  const matricule = this.route.snapshot.paramMap.get('matricule') || '';
  this.service.getUser(parseInt(matricule)).subscribe({
    next: (user) => {
      this.admin = user;
      this.adminForm.patchValue({
        matricule: user.matricule,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        typeAdmin: user.typeAdmin,
        plant: user.plant,
        segment: user.segment,
        sexe: user.sexe,
        numeroTelephone: user.numeroTelephone
      });
    }
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

     if (this.adminForm.valid) {
    const updatedUser = this.adminForm.value;
    const matricule = this.route.snapshot.paramMap.get('matricule');

    if (matricule) {
      this.service.updateUser(+matricule, updatedUser).subscribe({
        next: () => {

        Swal.fire('Succès', 'Administrateur modifié avec succès !', 'success');

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
  this.router.navigate(['/ui-components/listeAdminstrateursParSuperAdmin'])
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
}
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