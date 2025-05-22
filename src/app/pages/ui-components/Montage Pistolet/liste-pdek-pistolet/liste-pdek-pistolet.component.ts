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
import { OperatorDetailsModalComponent } from '../operator-details-modal/operator-details-modal.component';
import { PistoletJauneService } from 'src/app/services/PDF/Pistolet Jaune/pistolet-jaune.service';
import { PlanActionPdfService } from 'src/app/services/PDF/Plan d\'action/plan-action-pdf.service';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { PdekResultat } from 'src/app/Modeles/PdekResultat';
import { PlanActionGeneralService } from 'src/app/services/Plan d\'action/plan-action-general.service';
import { PlanActionDTO } from 'src/app/Modeles/PlanActionDTO';
import { Router } from '@angular/router';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';
interface Operateur {
  id: number;
  nom: string;
}

interface PDEKData {
  id: number;
  typeOperation: string;
  numeroPistolet : number ; 
  typePistolet: string;
  categorie: string;
  plant: string;
  segment: number;
  totalPages: number;
  usersRempliePDEK: string[];
  //status: string;
  planAction: PlanActionDTO | null ; // Accepte soit string soit null
}
@Component({
  selector: 'app-liste-pdek-pistolet',
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
  templateUrl: './liste-pdek-pistolet.component.html',
  styleUrl: './liste-pdek-pistolet.component.scss'
})
export class ListePdekPistoletComponent  implements OnInit {
pdfUrl: string | null = null;
displayedColumns: string[] = [
    'plant',  
    'segment',
    'typePistolet',
    'numeroPistolet',
    'categorie' ,
    'usersRempliePDEK',
    'totalPages' ,
    //'status',
    'planAction' ,
    'action'
  ];

  dataSource: MatTableDataSource<PDEKData>;

  // Options des filtres
  pdeks : PdekResultat[] = [];
  couleurPistolets: string[] = ['Vert', 'Bleu', 'Rouge' ,'Jaune'];
  couleurPistolet: string[] = ['PISTOLET_VERT', 'PISTOLET_BLEU', 'PISTOLET_ROUGE', 'PISTOLET_JAUNE'];



  plant: string[] = ['VW', 'BM'];
  categorie: string[] = ['Mécanique', 'Pneumatique'];

  currentProcessFilter: string[] = [];
  currentSegmentFilter: string[] = [];
  currentNumeroPistoletFilter: string[] = [];
  currentPlantFilter: string[] = [];
  currentStatusFilter: string[] = [];
  searchFilter: string = '';
  planAction: PlanActionDTO  | null = null ;
  plants: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog  , private serviceSuperAdmin: SuperAdminService , 
             private planActionPdfService : PlanActionPdfService , private  pistoletService :PistoletGeneralService
            , private planActionService: PlanActionGeneralService ,private  router : Router) {
  }
  ngOnInit() {
    this.recupererListPdek();
    this.loadPlants();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchFilter = filterValue.trim().toLowerCase();
    this.applyAllFilters();
  }

  applyProcessFilter(selectedProcesses: string[]) {
    this.currentProcessFilter = selectedProcesses;
    this.applyAllFilters();
  }

  applySegmentFilter(selectedSegments: string[]) {
    this.currentSegmentFilter = selectedSegments;
    this.applyAllFilters();
  }

  applyNumeroPistoletFilter(selectedNumeroPistolet: string[]) {
    this.currentNumeroPistoletFilter = selectedNumeroPistolet;
    this.applyAllFilters();
  }

  applyPlantFilter(selectedPlant: string[]) {
    this.currentPlantFilter = selectedPlant;
    this.applyAllFilters();
  }

  applyAllFilters() {
    this.dataSource.filterPredicate = (data: PDEKData, filter: string) => {
      // Filtre de recherche texte
      const searchMatch = !this.searchFilter || 
        //data.usersRempliePDEK.toLowerCase().includes(this.searchFilter) ||
        data.typePistolet.toLowerCase().includes(this.searchFilter) ||
        data.numeroPistolet.toString().toLowerCase().includes(this.searchFilter) ||
        data.categorie.toLowerCase().includes(this.searchFilter) ||
        data.plant.toLowerCase().includes(this.searchFilter) ||
        data.segment.toString().toLowerCase().includes(this.searchFilter) ;
        //data.status.toLowerCase().includes(this.searchFilter);

      // Filtres des listes déroulantes
      const processMatch = this.currentProcessFilter.length === 0 || 
                         this.currentProcessFilter.includes(data.typePistolet);
                
  const plantMatch = this.currentPlantFilter.length === 0 || 
  this.currentPlantFilter.includes(data.plant);

      const segmentMatch =
      this.currentSegmentFilter.length === 0 ||
      this.currentSegmentFilter.map(Number).includes(data.segment);
                        
      const numeroPistoletMatch =
      this.currentNumeroPistoletFilter.length === 0 ||
      this.currentNumeroPistoletFilter.map(Number).includes(data.numeroPistolet);

      //const statusMatch = this.currentStatusFilter.length === 0 || 
                        // this.currentStatusFilter.includes(data.status);
      
      return searchMatch && processMatch && segmentMatch && plantMatch && numeroPistoletMatch;
    };
    
    this.dataSource.filter = 'trigger';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewFilePDEK(row: PDEKData ) {
    if (row.typePistolet === 'PISTOLET_BLEU') {
      console.log("id de pdek est :"+row.id);
      this.router.navigate(['/pdek-pistolet-bleu', row.id]);
    } 
    if (row.typePistolet === 'PISTOLET_JAUNE') {
      console.log("id de pdek est :"+row.id);
      this.router.navigate(['/pdek-pistolet-jaune', row.id]);
    } 
    if (row.typePistolet === 'PISTOLET_ROUGE') {
      console.log("id de pdek est :"+row.id);
      this.router.navigate(['/pdek-pistolet-rouge', row.id]);
    } 
    if (row.typePistolet === 'PISTOLET_VERT') {
      console.log("id de pdek est :"+row.id);
      this.router.navigate(['/pdek-pistolet-vert', row.id]);
    } 
  }
  viewPlanAction(id: number){
    console.log('id de plan action' +id) ; 
    this.planActionPdfService.openPDFInNewWindow(id);
  }
  printRow(row: PDEKData) {
    console.log('Imprimer:', row);
  }
  getStatusClass(status: string | undefined | null): string {
    if (!status) return 'status-inconnu'; // ou retourne une classe par défaut
    switch (status.toLowerCase()) {
      case 'valider':
        return 'status-valider';
      case 'rejeter':
        return 'status-rejeter';
      case 'en cours':
        return 'status-en-cours';
      default:
        return 'status-inconnu'; // si le texte ne correspond à rien
    }
  }
  
/******************************************************************************************/
viewOperatorsDetails(row: PDEKData): void {
  const idPdek = row.id; // ou row.pdekId selon ta structure

  this.pistoletService.getUsersByPdek(idPdek).subscribe({
    next: (operatorsData) => {
      this.dialog.open(OperatorDetailsModalComponent, {
        width: '500px',
        data: {
          operators: operatorsData
        }
      });
      console.error('les operateurs sont :', operatorsData);

    },
    error: (err) => {
      console.error('Erreur lors de la récupération des opérateurs :', err);
    }
  });
}

recupererListPdek() {
  this.pistoletService.getPdekByTypeOperation('Montage_Pistolet').subscribe({
    next: (data) => {
      this.pdeks = data;
      this.pdeks.forEach(pdek => {
      this.planActionService.testerPdekPossedePlanAction(pdek.id).subscribe({
          next: (planAction) => {
            pdek.planAction = planAction; // Ajoute dynamiquement à chaque objet
          },
          error: (err) => {
            console.error(`Erreur pour le PDEK ${pdek.id} :`, err);
            pdek.planAction = null;
          }
        });
      });

      // Mettre à jour la source de données du tableau
      this.dataSource = new MatTableDataSource(this.pdeks);
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

formatPistolet(value: string): string {
  return value.replace('PISTOLET_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}


verifierPlanAction(pdekId: number): void {
  this.planActionService.testerPdekPossedePlanAction(pdekId).subscribe({
    next: (result) => {
      if (result) {
        this.planAction = result;
        console.log('Plan d\'action trouvé :', result);
      } else {
        this.planAction = null;
        console.log('Aucun plan d\'action trouvé');
      }
    },
    error: (err) => {
      console.error('Erreur lors de la vérification :', err);
    }
  });
}

loadPlants() {
  this.serviceSuperAdmin.getPlants().subscribe({
    next: (data) => this.plants = data,
    error: (err) => console.error('Erreur API', err)
  });
}
}
