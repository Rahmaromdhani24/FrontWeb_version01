
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

@Component({
  selector: 'app-list-projets',
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
    MatDialogModule ,
    TablerIconsModule
  ],
  templateUrl: './list-projets.component.html',
  styleUrl: './list-projets.component.scss'
})
export class ListProjetsComponent implements OnInit {
  constructor(private service : ProjetService, private  router : Router  , private serviceAdmin : SuperAdminService ){}
displayedColumns: string[] = [
    'nom' ,
    'plant',  
    'nbr',
    'dateCreation',
    'action'
  ];
  plants: string[] = [];
 
  dataSource: MatTableDataSource<Projet>;
 
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
  projets : Projet[] = [];
  currentPosteFilter: string[] = [];
  currentMachineFilter: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit() {
    this.recupererListProjet();
    this.loadPlants();
}

loadPlants() {
  this.serviceAdmin.getPlants().subscribe({
    next: (data) => this.plants = data,
    error: (err) => console.error('Erreur API plants', err)
  });
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.searchFilter = filterValue.trim();
  this.applyAllFilters();
}


  applyPlantFilter(selectedPlant: string[]) {
    this.currentPlantFilter = selectedPlant;
    this.applyAllFilters();
  }




  applyAllFilters() {
    this.dataSource.filterPredicate = (data: Projet, filter: string) => {
      // Filtre de recherche texte
  const searchMatch = !this.searchFilter ||
  data.nom?.toLowerCase().includes(this.searchFilter) ||
  data.plant?.toLowerCase().includes(this.searchFilter) ;
     
  const plantMatch = this.currentPlantFilter.length === 0 || 
  this.currentPlantFilter.includes(data.plant);

    const nomMatch = this.currentNomFilter.length === 0 || 
  this.currentNomFilter.includes(data.nom);

      
      return searchMatch &&  plantMatch &&  nomMatch ;
    };
    
    this.dataSource.filter = 'trigger';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
recupererListProjet() {
this.service.getAllProjets().subscribe({
    next: (data) => {
      this.projets = data;
      this.dataSource = new MatTableDataSource(this.projets);
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
updateProjet(row: Projet) {
  this.router.navigate(['/ui-components/updateProjet/', row.id]);
}


deleteProjet(row: Projet) {
  const id = row.id || 0 ;

  Swal.fire({
    title: 'Confirmation',
    text: 'Êtes-vous sûr de vouloir supprimer cet projet ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.deleteProjet(+id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: 'Projet a été supprimé avec succès.',
            timer: 2500,
            showConfirmButton: false
          });
          this.recupererListProjet(); // Mise à jour du tableau
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
navigerAdd(){
  this.router.navigate(['/ui-components/addProjet']);
}

}


