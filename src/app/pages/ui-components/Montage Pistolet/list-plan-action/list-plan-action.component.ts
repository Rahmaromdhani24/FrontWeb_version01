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
import { Router } from '@angular/router';
import { PlanActionGeneralService } from 'src/app/services/Plan d\'action/plan-action-general.service';
import { PlanActionDTO } from 'src/app/Modeles/PlanActionDTO';
import { PdekService } from 'src/app/services/PDEK service/pdek.service';
import { forkJoin, map } from 'rxjs';
import { GeneralService } from 'src/app/services/Géneral/general.service';
import { User } from 'src/app/Modeles/User';
import { OperateurDetailsPlanActionModalComponent } from '../operateur-details-plan-action-modal/operateur-details-plan-action-modal.component';
import { PlanActionPdfService } from 'src/app/services/PDF/Plan d\'action/plan-action-pdf.service';
import { PdekResultat } from 'src/app/Modeles/PdekResultat';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';

interface Operateur {
  id: number;
  nom: string;
}


@Component({
  selector: 'app-list-plan-action',
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
  templateUrl: './list-plan-action.component.html',
  styleUrl: './list-plan-action.component.scss'
})
export class ListPlanActionComponent  implements OnInit {
  currentUserRole: string | null= localStorage.getItem('role'); 
displayedColumns: string[] = [
    'plant',  
    'segment',
    'typePistolet',
    'numeroPistolet',
    'categorie' ,
    'usersRempliePDEK',
    'dateCreation',
    'creerPar',
    'action'
  ];

  dataSource: MatTableDataSource<PlanActionDTO>;

  // Options des filtres
  processTypes: string[] = ['Torsadage', 'Sertissage', 'Sertissage IDC' ,'Soudure' ,'Pistolet'];
  couleurPistolet: string[] = ['PISTOLET_VERT', 'PISTOLET_BLEU', 'PISTOLET_ROUGE', 'PISTOLET_JAUNE'];
  categories: string[] = ['PISTOLET', 'MACHINE'];
  currentProcessFilter: string[] = [];
  currentSegmentFilter: string[] = [];
  currentStatusFilter: string[] = [];
  currentNumeroPistoletFilter: string[] = [];
  searchFilter: string = '';
  plans : PlanActionDTO[]; // 
  currentPlantFilter: string[] = [];
  plants: string[] = [];

  userAddPlanAction : User ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private router: Router , private dialog: MatDialog  , private serviceSuperAdmin: SuperAdminService , 
              private planActionService: PlanActionGeneralService ,
              private planActionPdfService : PlanActionPdfService ,
              private pdekService : PdekService , private authService: GeneralService) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.recupereListPlanAction();
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
  applyPlantFilter(selectedPlant: string[]) {
    this.currentPlantFilter = selectedPlant;
    this.applyAllFilters();
  }
  applyStatusFilter(selectedStatuses: string[]) {
    this.currentStatusFilter = selectedStatuses;
    this.applyAllFilters();
  }

  applyAllFilters() {
    const normalizedSearch = this.searchFilter?.toLowerCase() ?? '';
  
    this.dataSource.filterPredicate = (data: PlanActionDTO, filter: string) => {
      // Fonction pour normaliser les champs texte
      const normalize = (val: any) => (val ? val.toString().toLowerCase() : '');
  
      // Recherche texte libre (sur tous les attributs principaux)
      const searchMatch = !normalizedSearch || [
        normalize(data.pistolet.typePistolet),
        normalize(data.pistolet.numeroPistolet),
        normalize(data.pistolet.categorie),
        normalize(data.pistolet.plant),
        normalize(data.pistolet.segment),
        normalize(data.dateCreation),
        normalize(data.userAddPlanAction?.prenom),
        normalize(data.userAddPlanAction?.nom)
      ].some(val => val.includes(normalizedSearch));
  
      // Filtres multi-critères
      const processMatch = this.currentProcessFilter.length === 0 ||
        this.currentProcessFilter.includes(data.pistolet.typePistolet);
  
      const plantMatch = this.currentPlantFilter.length === 0 ||
        this.currentPlantFilter.includes(data.pistolet.plant);
  
      const segmentMatch = this.currentSegmentFilter.length === 0 ||
        this.currentSegmentFilter.map(Number).includes(data.pistolet.segment);
  
      const numeroPistoletMatch = this.currentNumeroPistoletFilter.length === 0 ||
        this.currentNumeroPistoletFilter.map(Number).includes(data.pistolet.numeroPistolet);
  
      return searchMatch && processMatch && segmentMatch && plantMatch && numeroPistoletMatch;
    };
  
    // Déclencher le filtre (peu importe la valeur)
    this.dataSource.filter = Math.random().toString();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  viewDetails(row: PlanActionDTO) {
    console.log('Voir détails:', row);
  }

  printRow(row: PlanActionDTO) {
    console.log('Imprimer:', row);
  }
  getStatusClass(status: string): string {
    // Convertit le statut en format de classe CSS valide
    const statusClass = status.toLowerCase().replace(/ /g, '-').replace('é', 'e');
    return `status-${statusClass}`;
  }

/******************************************************************************************/
viewOperatorsDetails(row: PlanActionDTO): void {
  const idPlanAction = row.id;
  console.log('id de plan action est :'+idPlanAction) ; 
  this.planActionService.getUsersByPlanActionId(idPlanAction).subscribe({
    next: (operatorsData) => {
      this.dialog.open(OperateurDetailsPlanActionModalComponent , {
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

navigateToAddPlanActionPage(){
  this.router.navigate(['/ui-components/addPlanAction']);
}
/*isChefDeLigne(): boolean {
 // return this.currentUserRole === 'CHEF_DE_LIGNE';
   return this.currentUserRole === 'AGENT_QUALITE';
}*/
recupereListPlanAction() {
  this.planActionService.getPlansByTypeOperation("Montage_Pistolet").subscribe({
    next: (data) => {
      const requests = data.map(plan => {
        const pdek$ = this.pdekService.getPdekById(plan.pdekId);
        const user$ = this.authService.getUser(plan.matriculeUser);

        return forkJoin([pdek$, user$]).pipe(
          map(([pdek, user]) => {
            plan.pistolet = pdek;
            plan.userAddPlanAction = user;
            return plan;
          })
        );
      });

      forkJoin(requests).subscribe({
        next: (plansAvecInfos) => {
          this.plans = plansAvecInfos;
          this.dataSource = new MatTableDataSource(this.plans);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des infos PDEK ou User :", err);
        }
      });
    },
    error: (err) => {
      console.error("Erreur lors de la récupération des plans :", err);
    }
  });
}

formatPistolet(value: string): string {
  return value.replace('PISTOLET_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}
recupererInformations(matricule: number): Promise<void> {
  return new Promise((resolve, reject) => {
    this.authService.getUser(matricule).subscribe({
      next: (user) => {
        this.userAddPlanAction = user;
        
      },
      error: (err) => {
        console.error('S7i7aaaa !!!!!');
        reject(err);
      }
    });
  });
}


viewFilePDEK(row: PlanActionDTO)  {
 if (row.pistolet.typePistolet === 'PISTOLET_BLEU') {
    console.log("id de pdek est :"+row.pdekId);
    this.router.navigate(['/pdek-pistolet-bleu', row.pdekId]);
  } 
  if (row.pistolet.typePistolet === 'PISTOLET_JAUNE') {
    console.log("id de pdek est :"+row.pdekId);
    this.router.navigate(['/pdek-pistolet-jaune', row.pdekId]);
  } 
  if (row.pistolet.typePistolet === 'PISTOLET_ROUGE') {
    console.log("id de pdek est :"+row.pdekId);
    this.router.navigate(['/pdek-pistolet-rouge', row.pdekId]);
  } 
  if (row.pistolet.typePistolet === 'PISTOLET_VERT') {
    console.log("id de pdek est :"+row.pdekId);
    this.router.navigate(['/pdek-pistolet-vert', row.pdekId]);
  } 
}
viewPlanAction(id: number){
  console.log('id de plan action' +id) ; 
  this.planActionPdfService.openPDFInNewWindow(id);
}
loadPlants() {
  this.serviceSuperAdmin.getPlants().subscribe({
    next: (data) => this.plants = data,
    error: (err) => console.error('Erreur API', err)
  });
}
}