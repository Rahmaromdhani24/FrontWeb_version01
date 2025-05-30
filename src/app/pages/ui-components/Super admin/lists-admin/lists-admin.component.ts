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
import { InformationsAdminComponent } from '../informations-admin/informations-admin.component';

@Component({
  selector: 'app-lists-admin',
imports: [
    CommonModule,
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
    MatDialogModule
  ],
  templateUrl: './lists-admin.component.html',
  styleUrl: './lists-admin.component.scss'
})
export class ListsAdminComponent implements OnInit {
  constructor(private service : SuperAdminService , private  router : Router , private dialog: MatDialog ,){}
displayedColumns: string[] = [
    'matricule' ,
    'nom' ,
    'type', 
    'plant',  
    'segment',
    'numeroTelephone' ,
    'action'
  ];
  plants: string[] = [];
  typesAdminOptions: string[] = [
    " Admin_ppo", 
    "Admin_qualité"  ,
    "Admin_production"
  ];

  dataSource: MatTableDataSource<Admin>;
 
  // Filtres actuels
  currentMatriculeFilter: number[] = [];
  currentSegmentFilter: string[] = [];
  currentNumeroTelephoneFilter: number[] = [];
  currentPlantFilter: string[] = [];
  currentTypeFilter: string[] = [];
   currentNomFilter: string[] = [];
    currentPrenomFilter: string[] = [];
  searchFilter: string = '';
  planAction: PlanActionDTO  | null = null ;
  admins : Admin[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit() {
    this.recupererListAdmin();
    this.loadPlants();
}

loadPlants() {
  this.service.getPlants().subscribe({
    next: (data) => this.plants = data,
    error: (err) => console.error('Erreur API plants', err)
  });
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.searchFilter = filterValue.trim();
  this.applyAllFilters();
}


  applyMatriculeFilter(currentMatriculeFilter: number[]) {
    this.currentMatriculeFilter = currentMatriculeFilter;
    this.applyAllFilters();
  }

  applySegmentFilter(selectedSegments: string[]) {
    this.currentSegmentFilter = selectedSegments;
    this.applyAllFilters();
  }

  applyNumeroTelephoneFilter(currentNumeroTelephoneFilter: number[]) {
    this.currentNumeroTelephoneFilter = currentNumeroTelephoneFilter;
    this.applyAllFilters();
  }

  applyPlantFilter(selectedPlant: string[]) {
    this.currentPlantFilter = selectedPlant;
    this.applyAllFilters();
  }

    applyTypeFilter(selectedOperation: string[]) {
    this.currentTypeFilter = selectedOperation;
    this.applyAllFilters();
  }
  applyAllFilters() {
    this.dataSource.filterPredicate = (data: Admin, filter: string) => {
      // Filtre de recherche texte
const searchMatch = !this.searchFilter ||
  data.matricule?.toString().toLowerCase().includes(this.searchFilter) ||
  data.nom?.toLowerCase().includes(this.searchFilter) ||
  data.prenom?.toLowerCase().includes(this.searchFilter) ||
  data.plant?.toLowerCase().includes(this.searchFilter) ||
  data.typeAdmin?.toLowerCase().includes(this.searchFilter) ||
  data.numeroTelephone?.toString().toLowerCase().includes(this.searchFilter) ||
  data.sexe?.toLowerCase().includes(this.searchFilter) ||
  data.segment?.toString().toLowerCase().includes(this.searchFilter);


      // Filtres des listes déroulantes
      const matriculeMatch = this.currentMatriculeFilter.length === 0 || 
                         this.currentMatriculeFilter.includes(data.matricule);
                
  const plantMatch = this.currentPlantFilter.length === 0 || 
  this.currentPlantFilter.includes(data.plant);

  const typeMatch = this.currentTypeFilter.length === 0 || 
  this.currentTypeFilter.map(op => op.toLowerCase())
    .includes(data.typeAdmin.toLowerCase());

    const nomMatch = this.currentNomFilter.length === 0 || 
  this.currentNomFilter.includes(data.nom);

    const prenomMatch = this.currentPrenomFilter.length === 0 || 
  this.currentPrenomFilter.includes(data.prenom);

      const segmentMatch =
      this.currentSegmentFilter.length === 0 ||
      this.currentSegmentFilter.map(Number).includes(data.segment);
                        
      const numeroTelephoneMatch =
      this.currentNumeroTelephoneFilter.length === 0 ||
      this.currentNumeroTelephoneFilter.map(Number).includes(data.numeroTelephone);

    
      
      return searchMatch && matriculeMatch && segmentMatch && plantMatch && 
           prenomMatch && nomMatch && numeroTelephoneMatch && typeMatch;
    };
    
    this.dataSource.filter = 'trigger';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
recupererListAdmin() {
this.service.getAllAdmins().subscribe({
    next: (data) => {
      this.admins = data;
      this.dataSource = new MatTableDataSource(this.admins);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },
    error: (err) => {
      if (err.status === 401) {
        console.error('Non autorisé. Token expiré ou invalide.');
        // Redirection vers login ici si besoin
      } else {
        console.error('Erreur :', err);
      }
    }
  });
}

formatOperation(label: string): string {
  return label.replace(/_/g, ' ');
}
updateAdmin(row: Admin) {
  this.router.navigate(['/ui-components/updateProfileAdminParSuperAdmin', row.matricule]);
}

viewAdmin(row: Admin) {
  this.service.getUser(row.matricule).subscribe({
    next: (operatorsData) => {
      const operatorsArray = Array.isArray(operatorsData) ? operatorsData : [operatorsData];

      this.dialog.open(InformationsAdminComponent, {
        width: '500px',
        data: {
          operators: operatorsArray
        }
      });

      console.log('les operateurs sont :', operatorsArray);
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des opérateurs :', err);
    }
  });
}

deleteAdmin(row: Admin) {
  const matricule = row.matricule;

  Swal.fire({
    title: 'Confirmation',
    text: 'Êtes-vous sûr de vouloir supprimer cet administrateur ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.deleteUser(+matricule).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: 'L’administrateur a été supprimé avec succès.',
            timer: 2500,
            showConfirmButton: false
          });
          this.recupererListAdmin(); // Mise à jour du tableau
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la suppression.'
          });
          console.error('Erreur lors de la suppression :', err);
        }
      });
    }
  });
}



}

