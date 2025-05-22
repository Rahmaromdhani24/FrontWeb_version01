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
import { PistoletJauneService } from 'src/app/services/PDF/Pistolet Jaune/pistolet-jaune.service';
import { PlanActionPdfService } from 'src/app/services/PDF/Plan d\'action/plan-action-pdf.service';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { PlanActionGeneralService } from 'src/app/services/Plan d\'action/plan-action-general.service';
import { PlanActionDTO } from 'src/app/Modeles/PlanActionDTO';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PDEK } from 'src/app/Modeles/Pdek';
import { OperatorDetailsModalComponent } from '../../Montage Pistolet/operator-details-modal/operator-details-modal.component';
import { SoudureService } from 'src/app/services/Agent Qualité Operation Soudure/soudure.service';
import { TorsadageService } from 'src/app/services/Agent Qualite Operation Torsadage/torsadage.service';
import { SertissageIDCService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-idc.service';
import { SertissageNormalService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-normal.service';
import { PdekService } from 'src/app/services/PDEK service/pdek.service';
import { PdekAvecPlans } from 'src/app/Modeles/PdekAvecPlans';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';

@Component({
  selector: 'app-lists-pdek-tous-process',
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
  templateUrl: './lists-pdek-tous-process.component.html',
  styleUrl: './lists-pdek-tous-process.component.scss'
})
export class ListsPdekTousProcessComponent  implements OnInit {
pdfUrl: string | null = null;
displayedColumns: string[] = [
    'plant',  
    'segment',
    'process',
    'numPoste',
    'machine' ,
    'sectionFil',
    'usersRempliePDEK',
    'totalPages' ,
    'planAction' ,
    'action'
  ];

  dataSource: MatTableDataSource<PdekAvecPlans>;

  // Options des filtres
  pdeks : PdekAvecPlans[] = [];
  processTypes: string[] = ['Torsadage', 'Sertissage normal', 'Sertissage idc' ,'Soudure'];
  plants: string[] = [];  // Filtres actuels
  currentProcessFilter: string[] = [];
  currentSegmentFilter: string[] = [];
  currentNumeroPistoletFilter: string[] = [];
  currentPlantFilter: string[] = [];
  currentStatusFilter: string[] = [];
  searchFilter: string = '';
  planAction: PlanActionDTO  | null = null ;
  operationUser  = localStorage.getItem('operation') || '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog ,private  router : Router , 
              private planActionPdfService : PlanActionPdfService ,
              private  pistoletService :PistoletGeneralService ,
              private planActionService: PlanActionGeneralService ,
              private serviceSoudure : SoudureService ,
              private serviceTorsadage : TorsadageService , 
              private serviceSertissageIDC : SertissageIDCService , 
              private serviceSertissage : SertissageNormalService , 
              private pdekService : PdekService ,
             private serviceSuperAdmin: SuperAdminService) {
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
    this.dataSource.filterPredicate = (data: PdekAvecPlans, filter: string) => {
      const searchText = this.searchFilter?.toLowerCase() || '';
  
      // 🔍 Recherche texte sur plusieurs champs
      const searchMatch = !this.searchFilter || [
        data.typeOperation,
        data.sectionFil,
        data.numMachine,
        data.plant,
        data.segment,
        data.numeroOutils,
        data.numeroContacts,
        data.dateCreation,
        data.LGD,
        data.posGradant
      ]
      .map(val => val?.toString().toLowerCase())
      .some(field => field?.includes(searchText));
  
      // ⬇️ Filtres multiples par valeur
      const processMatch = this.currentProcessFilter.length === 0 || 
        this.currentProcessFilter.includes(data.typeOperation);
  
      const plantMatch = this.currentPlantFilter.length === 0 || 
        this.currentPlantFilter.includes(data.plant);
  
      const segmentMatch = this.currentSegmentFilter.length === 0 ||
        this.currentSegmentFilter.map(Number).includes(data.segment);

  
      return searchMatch && processMatch && plantMatch && segmentMatch ;
    };
  
    // Déclenche le filtre
    this.dataSource.filter = 'trigger';
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  

  viewFilePDEK(row: PDEK) {
    if (row.typeOperation === 'Soudure') {
      console.log("id de pdek est :"+row.id);
      localStorage.setItem('pdekSoudure', JSON.stringify(row));
      this.router.navigate(['/pdeks-soudure', row.id]);
    } 
   if (row.typeOperation === 'Torsadage') {
      console.log("id de pdek est :"+row.id);
      localStorage.setItem('pdekTorsadage', JSON.stringify(row));
      this.router.navigate(['/pdeks-torsadage', row.id]);
    }
    if (row.typeOperation === 'Sertissage_IDC') {
      console.log("id de pdek est :"+row.id);
      localStorage.setItem('pdekSertissageIDC', JSON.stringify(row));
      this.router.navigate(['/pdeks-sertissageIDC', row.id]);
    }
    if (row.typeOperation === 'Sertissage_Normal') {
      console.log("id de pdek est :"+row.id);
      localStorage.setItem('pdekSertissage', JSON.stringify(row));
      this.router.navigate(['/pdeks-sertissage', row.id]);
    }
  }
  viewPlanAction(row: PdekAvecPlans){
    console.log('plan action de pdek selectionner: ' + JSON.stringify(row));
    const planActionId = row.plans[0]?.id;
    console.log('id de plan action : ' + planActionId);
  this.planActionPdfService.openPDFInNewWindow(planActionId);
  }
  printRow(row: PDEK) {
    window.print();
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
viewOperatorsDetails(row: PDEK): void {
  const idPdek = row.id; // ou row.pdekId selon ta structure
 if(row.typeOperation==='Soudure'){
  this.serviceSoudure.getUsersByPdek(idPdek).subscribe({
    next: (operatorsData) => {
     this.dialog.open(OperatorDetailsModalComponent , {
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
if(row.typeOperation==='Torsadage'){
  this.serviceTorsadage.getUsersByPdek(idPdek).subscribe({
    next: (operatorsData) => {
     this.dialog.open(OperatorDetailsModalComponent , {
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
if(row.typeOperation==='Sertissage_Normal'){
  this.serviceSertissage.getUsersByPdek(idPdek).subscribe({
    next: (operatorsData) => {
     this.dialog.open(OperatorDetailsModalComponent , {
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
if(row.typeOperation==='Sertissage_IDC'){
  this.serviceSertissageIDC.getUsersByPdek(idPdek).subscribe({
    next: (operatorsData) => {
     this.dialog.open(OperatorDetailsModalComponent , {
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
}



/*recupererListPdek() {
  const types = ['Soudure', 'Torsadage', 'Sertissage_IDC', 'Sertissage_Normal'];
  this.pdeks = []; // vide au début
  this.dataSource = new MatTableDataSource(this.pdeks);

  from(types).pipe(
    mergeMap(type => this.pdekService.getPdeksEnServiceAvecPlans(type))
  ).subscribe({
    next: (pdeksParType) => {
      this.pdeks = [...this.pdeks, ...pdeksParType];
      this.dataSource.data = this.pdeks;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },
    error: (err) => {
      console.error('Erreur lors du chargement des PDEKs :', err);
    }
  });
}*/
recupererListPdek() {
  const allTypes = ['Soudure', 'Torsadage', 'Sertissage_IDC', 'Sertissage_Normal'];
  const operation = this.operationUser?.trim();
  // Choix du/des type(s) à charger
  const types = (operation && operation !== 'undefined') ? [operation] : allTypes;
  this.pdeks = [];
  this.dataSource = new MatTableDataSource(this.pdeks);
  from(types).pipe(
    mergeMap(type => this.pdekService.getPdeksEnServiceAvecPlans(type))
  ).subscribe({
    next: (pdeksParType) => {
      this.pdeks = [...this.pdeks, ...pdeksParType];
      this.dataSource.data = this.pdeks;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },
    error: (err) => {
      console.error('Erreur lors du chargement des PDEKs :', err);
    }
  });
}


formatOperation(value: string): string {
  if (!value) return '';
  
  return value
    .replace(/_/g, ' ')                       // remplace les underscores par des espaces
    .split(' ')                               // divise en mots
    .map(word => {
      if (word.toUpperCase() === word) {
        return word.charAt(0) + word.slice(1).toLowerCase(); // IDc -> Idc
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // ex: soudure -> Soudure
    })
    .join(' ');
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
