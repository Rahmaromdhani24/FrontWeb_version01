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
interface Operateur {
  id: number;
  nom: string;
}

interface PDEKData {
  id: number;
  typeOperation: string;
  typePistolet: string;
  categorie: string;
  plant: string;
  segment: number;
  totalPages: number;
  usersRempliePDEK: string[];
  status: string;
  planAction: string | null; // Accepte soit string soit null
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
    'categorie' ,
    'usersRempliePDEK',
    'totalPages' ,
    'status',
    'planAction'
  ];

  dataSource: MatTableDataSource<PDEKData>;

  // Options des filtres
  pdeks : PdekResultat[] = [];
  couleurPistolets: string[] = ['Vert', 'Bleu', 'Rouge' ,'Jaune'];
  couleurPistolet: string[] = ['PISTOLET_VERT', 'PISTOLET_BLEU', 'PISTOLET_ROUGE', 'PISTOLET_JAUNE'];



  plant: string[] = ['VW', 'BM'];
  categorie: string[] = ['Mécanique', 'Pneumatique'];
  segment: number[] = [10, 15, 44, 38, 27, 92]; // tu mets les valeurs que tu veux
  machines: string[] = ['D306', 'D295'];
  totalPages: number[] = [1, 2];
// Dans votre composant.ts
statuses: string[] = ['en cours', 'Valider', 'Rejeter'];
  // Filtres actuels
  currentProcessFilter: string[] = [];
  currentSegmentFilter: string[] = [];
  currentPlantFilter: string[] = [];
  currentStatusFilter: string[] = [];
  searchFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog , private pistoletJauneService: PistoletJauneService
            , private planActionPdfService : PlanActionPdfService , private  pistoletService :PistoletGeneralService) {
  }
  ngOnInit() {
    this.recupererListPdek();
  }


 /* generateDemoData(count: number): PDEKData[] {
    const data: PDEKData[] = [];
    const operateurs: Operateur[] = [
      { id: 1, nom: 'Équipe Alpha' },
      { id: 2, nom: 'Équipe Beta' },
      { id: 3, nom: 'Équipe Gamma' }
    ];
  
    for (let i = 1; i <= count; i++) {
      data.push({
        plant: this.plant[Math.floor(Math.random() * this.plant.length)],
        segment : this.segment[Math.floor(Math.random() * this.segment.length)],
        typePistolet: this.couleurPistolet[Math.floor(Math.random() * this.couleurPistolet.length)],
        categorie: this.categorie[Math.floor(Math.random() * this.categorie.length)],
        usersRempliePDEK: operateurs[Math.floor(Math.random() * operateurs.length)],
        totalPage: this.totalPages[Math.floor(Math.random() * this.totalPages.length)],
        status: this.statuses[Math.floor(Math.random() * this.statuses.length)],
        planAction: Math.random() > 0.5 ? `Plan-${i}` : null // Correct avec l'interface mise à jour
      });
    }
    return data;
  }
*/
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
    this.dataSource.filterPredicate = (data: PDEKData, filter: string) => {
      // Filtre de recherche texte
      const searchMatch = !this.searchFilter || 
        //data.usersRempliePDEK.toLowerCase().includes(this.searchFilter) ||
        data.typePistolet.toLowerCase().includes(this.searchFilter) ||
        data.categorie.toLowerCase().includes(this.searchFilter) ||
        data.plant.toLowerCase().includes(this.searchFilter) ||
        data.segment.toString().toLowerCase().includes(this.searchFilter) ||
        data.status.toLowerCase().includes(this.searchFilter);

      // Filtres des listes déroulantes
      const processMatch = this.currentProcessFilter.length === 0 || 
                         this.currentProcessFilter.includes(data.typePistolet);
                
  const plantMatch = this.currentPlantFilter.length === 0 || 
  this.currentPlantFilter.includes(data.plant);

      const segmentMatch =
      this.currentSegmentFilter.length === 0 ||
      this.currentSegmentFilter.map(Number).includes(data.segment);
                        
      const statusMatch = this.currentStatusFilter.length === 0 || 
                         this.currentStatusFilter.includes(data.status);
      
      return searchMatch && processMatch && segmentMatch && plantMatch && statusMatch;
    };
    
    this.dataSource.filter = 'trigger';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewFilePDEK(row: PDEKData) {
      this.pistoletJauneService.openPDFInNewWindow();
  }
  viewPlanAction(){
    this.planActionPdfService.openPDFInNewWindow();

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
viewOperatorsDetails(row: PDEKData) {
  // Données factices pour la démo - à remplacer par vos vraies données
  const operatorsData = [
    {
      matricule: 'EMP123',
      nom: 'Jean Dupont',
      plant: 'Plant A',
      segments: ['Segment 1', 'Segment 2']
    },
    {
      matricule: 'EMP456',
      nom: 'Marie Martin',
      plant: 'Plant B',
      segments: ['Segment 3']
    }
  ];

  this.dialog.open(OperatorDetailsModalComponent, {
    width: '500px',
    data: {
      operators: operatorsData
    }
  });
}
recupererListPdek() {
  this.pistoletService.getPdekByTypeOperation('Montage_Pistolet').subscribe({
    next: (data) => {
      this.pdeks = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;


      // Ici c’est sûr que paginator & sort sont disponibles
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },
    error: (err) => {
      if (err.status === 401) {
        console.error('Non autorisé. Token expiré ou invalide.');
        // rediriger vers login
      } else {
        console.error('Erreur :', err);
      }
    }
  });
}
formatPistolet(value: string): string {
  return value.replace('PISTOLET_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

}
