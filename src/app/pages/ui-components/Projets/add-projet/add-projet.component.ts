
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlanActionDTO } from 'src/app/Modeles/PlanActionDTO';
import { Router } from '@angular/router';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';
import { Admin } from 'src/app/Modeles/Admin';
import Swal from 'sweetalert2';
import { InformationsAdminComponent } from '../../Super admin/informations-admin/informations-admin.component';
import { AdminServiceService } from 'src/app/services/Admin/admin-service.service';
import { Operateur } from 'src/app/Modeles/Operateur';
import { ProjetService } from 'src/app/services/Admin/projet.service';
import { Projet } from 'src/app/Modeles/Projet';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-projet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    TablerIconsModule
  ],
  templateUrl: './add-projet.component.html',
  styleUrl: './add-projet.component.scss'
})
export class AddProjetComponent implements OnInit {
projetForm: FormGroup;
plants: string[] = [];
constructor(private service: ProjetService , private fb: FormBuilder , 
            private superAdmin : SuperAdminService , private router : Router) {}
  projet = { 
    nom: '',
    plant: '',

  };
ngOnInit(): void {
  this.loadPlants();
    this.projetForm = this.fb.group({
    
      nom: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s’\-]+$/)]] , 
      plant: ['', Validators.required],


    });
}


  onSubmit() {
   
    if (this.projetForm.invalid) {
      this.projetForm.markAllAsTouched();
       Swal.fire({
            title: 'Champs manquants',
            text: 'Veuillez remplir tous les champs obligatoires.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
    }

    const formData = this.projetForm.value;
    console.log('Formulaire soumis :', formData);
     // Création de l'objet Admin avec mapping des champs
const projet: Projet = {
  nom: formData.nom,
  plant: formData.plant,
  dateCreation: new Date().toISOString().split('T')[0] // format yyyy-MM-dd
};


  console.log('projet prêt à être envoyé :', projet);

  // Exemple d'appel au service
  this.service.createProjet(projet).subscribe({
next: () => {
  Swal.fire('Succès', 'Projet ajouté avec succès !', 'success');

  // Réinitialisation complète
  this.projetForm.reset(); // Réinitialise les valeurs

  // Supprimer les erreurs et les états touchés
  Object.keys(this.projetForm.controls).forEach(key => {
    const control = this.projetForm.get(key);
    control?.setErrors(null);       // Supprimer les erreurs
    control?.markAsPristine();      // Marquer comme vierge
    control?.markAsUntouched();     // Marquer comme non touché
    control?.updateValueAndValidity(); // Recalculer la validité
  });
  this.router.navigate(['/ui-components/listProjets'])
}

,
  error: (err) => {
    console.error('Erreur lors de l\'ajout', err);
      // Autres erreurs
      Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout.', 'error');
    
  }
});
  }

  loadPlants() {
  this.superAdmin.getPlants().subscribe({
    next: (data) => this.plants = data,
    error: (err) => console.error('Erreur API', err)
  });
}
}
