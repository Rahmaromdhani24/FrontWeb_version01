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
import { ActivatedRoute, Router } from '@angular/router';
import { Operateur } from 'src/app/Modeles/Operateur';
import { AdminServiceService } from 'src/app/services/Admin/admin-service.service';
import { Users } from 'src/app/Modeles/Users';

@Component({
  selector: 'app-update-utilisateur',
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
 templateUrl: './update-utilisateur.component.html',
  styleUrl: './update-utilisateur.component.scss'
})
export class UpdateUtilisateurComponent  implements OnInit {
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
    "AGENT_QUALITE",
    "TECHNICIEN" 
    ];

constructor(private service: AdminServiceService , private fb: FormBuilder , 
            private router : Router  , private route : ActivatedRoute) {}
  utilisateur = {
    matricule: '',
    nom: '',
    prenom: '',
    typeOperation: '',
    plant: '',
    segment: '',
    sexe: '',
    numeroTelephone: '' , 
    role :'' , 
    email :''
  };
ngOnInit(): void {
  this.loadPlants();
    this.adminForm = this.fb.group({
      matricule: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      nom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]] , 
      prenom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]] , 
      typeOperation: ['', Validators.required],
      plant: ['', Validators.required],
      segment: ['', [Validators.required, Validators.min(1), Validators.max(50)]] , 
      sexe: ['', Validators.required],
      numeroTelephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]] ,
     role: ['', Validators.required],
     email: ['', Validators.required]

    });

  this.adminForm.get('matricule')?.disable();
 const matricule = this.route.snapshot.paramMap.get('matricule') || '';
  this.service.getUtilisateur(parseInt(matricule)).subscribe({
    next: (user) => {
      this.utilisateur = user;
      this.adminForm.patchValue({
        matricule: user.matricule,
        nom: user.nom,
        prenom: user.prenom,
        typeOperation: user.typeOperation,
        plant: user.plant,
        segment: user.segment,
        sexe: user.sexe,
        numeroTelephone: user.numeroTelephone , 
        role : user.role , 
        email : user.email 
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
    
        const formData = this.adminForm.value;
        console.log('Formulaire soumis :', formData);
         // Création de l'objet Admin avec mapping des champs
      const operateur: Users = {
        matricule: formData.matricule,
        nom: formData.nom,
        prenom: formData.prenom,
        plant: formData.plant,
        segment: Number(formData.segment),
        sexe: formData.sexe,
        numeroTelephone: Number(formData.numeroTelephone),
        typeOperation: formData.typeOperation ,
        role: formData.role     , 
        email: formData.email     , 
      };
    
      console.log('Admin prêt à être envoyé :', operateur);
       if (this.adminForm.valid) {
        const updatedUser = this.adminForm.value;
        const matricule = this.route.snapshot.paramMap.get('matricule');
    
        if (matricule) {
          this.service.updateUtilisateur(+matricule, operateur).subscribe({
            next: () => {
    
            Swal.fire('Succès', 'Opérateur modifié avec succès !', 'success');
    
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
},
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