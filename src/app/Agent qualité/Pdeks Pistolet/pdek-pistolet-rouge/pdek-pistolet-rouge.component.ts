import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels,
  ApexYAxis, ApexTitleSubtitle, ApexStroke, ApexTooltip, ApexMarkers, ApexFill, ApexAnnotations, ApexLegend
} from 'ng-apexcharts';
import { Observable, of } from 'rxjs';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pdek-pistolet-rouge',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
  providers: [],
  templateUrl: './pdek-pistolet-rouge.component.html',
  styleUrl: './pdek-pistolet-rouge.component.scss'
})
export class PdekPistoletRougeComponent implements OnInit ,AfterViewInit  {

   constructor(private pistoletGeneralService: PistoletGeneralService  , private router : Router ,
    private cdr: ChangeDetectorRef ){}
   seriesDataEtendue: { x: number, y: number }[] = [];
   seriesDataMoyenne: { x: number, y: number }[] = [];
   rows = Array.from({ length: 25 }, (_, i) => i + 1);
   showLoader : boolean = true; 
   twentyFive: number[] = Array.from({ length: 25 }, (_, i) => i + 1);
   numCourants : any  =  [1 ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
   anneePDEK : number = 0 ;
   numeroCourant : number ; 
   numeroPistolet : number ; 
   typePistolet : string ; 
   idPdek : number ;
   numPage : number ;
   categorie : string ;
   plantUser : string ; 
   segmentUser : number  ; 
   pistolets: Pistolet[] = [];
   pistolet : Pistolet ; 
   reponseApi : any ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   pistoletsParNumCourant = new Map<number, Pistolet>();

   ngOnInit(): void {
    this.pistolet = JSON.parse(localStorage.getItem("pistolet")!);
    this.reponseApi = JSON.parse(localStorage.getItem("reponseApi")!);
    this.numeroPistolet = this.pistolet.numeroPistolet;
    this.typePistolet = this.pistolet.type;
    this.categorie = this.pistolet.categorie;
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
  
    this.plantUser = localStorage.getItem('plant')!;
    this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
  
    this.pistoletsValides = new Set<number>();
    
    this.recupererDonneesDeFichierPdekDePageParticulier().subscribe(() => {
      this.pistoletsParNumCourant.clear();
      this.pistolets.forEach(p => {
        this.pistoletsParNumCourant.set(p.numCourant, p);
      });
    });
  }; 
  hideLoader(): void { this.showLoader = false;  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 5000); // Délai de 3 secondes (ajustez selon vos besoins)
  }
/***************************** Chart moyenne X *******************************************/
public chartOptionsMoyenne: {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  annotations: ApexAnnotations;
  fill: ApexFill;
  legend: ApexLegend;
} = {
  series: [{
    name: 'Moyenne',
    data: [] // Dynamique
  }],
  chart: {
    type: 'line',
    height: 400,
    background: 'transparent',
    animations: {
      enabled: false,
      easing: 'linear',
      speed: 1,
      animateGradually: { enabled: false },
      dynamicAnimation: { enabled: false }
    },
    toolbar: { show: false }
  },
  xaxis: {
    type: 'numeric',
    min: 1,
    max: 25,
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false }
  },
  yaxis: {
    min: 110,
    max: 180,
    tickAmount: 2, // Assez pour avoir un tick tous les ~5 points
    labels: {
      show: true,
      formatter: (val: number) => {
        const rounded = Math.round(val);
        return (rounded >= 125 && rounded <= 161 && (rounded - 125) % 3 === 0) ? `${rounded}` : '';
      } ,
      style: {
        colors: '#000',
        fontSize: '12px'
      }
    }
  },
  stroke: {
    curve: 'straight',
    width: 2
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 5,
    strokeWidth: 1,
    strokeColors: '#000',
    colors: ['#000']
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}`
    }
  },
  fill: {
    type: 'solid'
  },
  legend: {
    show: false
  },
  annotations: {
    yaxis: [
      // ✅ Zones colorées
      { y: 125, y2: 131, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 131, y2: 149, fillColor: '#00c80087', opacity: 0.4 },
      { y: 149, y2: 166, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 110, y2: 125, fillColor: '#ff00006e', opacity: 0.4 },
      { y: 166, y2: 180, fillColor: '#ff00006e', opacity: 0.4 },

      // ✅ Lignes colorées
      {
        y: 125,
        borderColor: 'red',
        strokeDashArray: 0,
        label: {
          text: '125',
          position: 'left',
          style: { color: '#fff', background: 'red' }
        }
      },
      {
        y: 166,
        borderColor: 'red',
        strokeDashArray: 0,
        label: {
          text: '166',
          position: 'left',
          style: { color: '#fff', background: 'red' }
        }
      },
      {
        y: 149,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          text: '149',
          position: 'left',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 131,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          text: '131',
          position: 'left',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 140,
        borderColor: 'gray',
        strokeDashArray: 0,
        label: {
          text: '140',
          position: 'left', // 👈 Affiche le label à gauche
          style: {
            color: '#fff',
            background: 'gray'
          }
        }
      }
    ]
  }
};

  /***************************** Chart étendue R *******************************************/
   public chartOptionsEtendue: {
       series: ApexAxisChartSeries;
       chart: ApexChart;
       xaxis: ApexXAxis;
       yaxis: ApexYAxis;
       stroke: ApexStroke;
       dataLabels: ApexDataLabels;
       markers: ApexMarkers;
       tooltip: ApexTooltip;
       annotations: ApexAnnotations;
     } = {
       series: [{
         name: 'Étendue',
         data: []
       }],
       chart: {
         type: 'line',
         height: 250,
         background: 'transparent',
         animations: {
           enabled: false,
           easing: 'linear',
           speed: 1,
           animateGradually: {
             enabled: false
           },
           dynamicAnimation: {
             enabled: false
           }
         },
         toolbar: { show: false }
       }
       ,
       xaxis: {
         type: 'numeric',
         min: 1,
         max:25 ,
         labels: { show: false },
         axisTicks: { show: false },
         axisBorder: { show: false }
       },
       yaxis: {
         min: 0,
         max: 12,
         tickAmount: 12,
         labels: {
           show: true,
           formatter: (val: number) => val % 2 === 0 && val !== 0 ? `${val}` : ''
         }
       },
       stroke: {
         curve: 'straight',
         width: 2 // 👉 aucune ligne
       },
       dataLabels: {
         enabled: false
       },
       markers: {
         size: 5,
         strokeColors: '#fff',
         strokeWidth: 1,
         colors: ['#333']
       }
   ,    
       tooltip: {
         enabled: true ,
         y: {
          formatter: (val: number) => `${val}`
        }
       },
       annotations: {
         yaxis: [
           {
             y: 12,
             borderColor: 'red',
             label: {
               style: {
                 color: '#fff',
                 background: 'red'
               }
             }
           }
         ]
       }
     };
 /*********************** Chart d'Étendue R *******************************/

recuepererDernierNumeroDeCycle(){
  this.pistoletGeneralService.getDernierNumeroCycle(this.typePistolet,  this.numeroPistolet, this.categorie, this.segmentUser, this.plantUser)
  .subscribe({
    next: (numeroCycle) => {
      console.log('Dernier numéro de cycle:', numeroCycle);
      this.numeroCourant = numeroCycle;
    },
    error: (err) => {
      console.error('Erreur récupération du numéro de cycle', err);
    }
  });
  }
 
  recupererDonneesDeFichierPdekDePageParticulier(): Observable<Pistolet[]> {
    return this.pistoletGeneralService.getPistoletsParPdekEtPage(this.idPdek, this.numPage).pipe(
      tap((data: Pistolet[]) => {
        this.pistolets = data;
        console.log('Pistolets récupérés :', data);
      
        this.seriesDataMoyenne = data.map(p => ({
          x: p.numCourant,
          y: p.moyenne
        }));
      
        this.chartOptionsMoyenne.series = [{
          name: 'Moyenne',
          data: this.seriesDataMoyenne ,
        }];
                // Met à jour le graphique sans animation
   

        this.seriesDataEtendue = data.map(p => ({
          x: p.numCourant,
          y: Number(p.etendu) 
        }));
      
        this.chartOptionsEtendue.series = [{
          name: 'Etendu',
          data: this.seriesDataEtendue ,
        }];

   
        if (data.length > 0) {
          this.numeroCourant = data[data.length - 1].numCourant;
        }
      
        console.log('Séries Moyenne :', this.seriesDataMoyenne);
      }) ,
      catchError(error => {
        console.error('Erreur lors de la récupération des pistolets', error);
        return of([]);
      })
    );
  }
  
  getPistoletParNumCourant(num: number): Pistolet | undefined {
    return this.pistolets.find(p => p.numCourant === num);}

    getValeurX(rowIndex: number, numCourant: number): number | null {
      const pistolet = this.pistolets.find(p => p.numCourant === numCourant);
      if (!pistolet) return null;
    
      const key = `ech${rowIndex + 1}` as keyof Pistolet;
      const value = pistolet[key];
    
      return typeof value === 'number' ? value : null;
    }
    
    
   getMoyenne(numCourant: number): number | null {
        const pistolet = this.pistolets.find(p => p.numCourant === numCourant);
        return pistolet ? pistolet.moyenne : null;}
      
   getEtendu(numCourant: number): number | null {
        const pistolet = this.pistolets.find(p => p.numCourant === numCourant);
        return pistolet ? pistolet.etendu : null; }
  
  getNom(numCourant: number): number | null {
    const pistolet = this.getPistoletParNumCourant(numCourant);
    return pistolet ? pistolet.matricule : null;
  }
  
  getDateSansAnnee(numCourant: number): string | null {
    const pistolet = this.getPistoletParNumCourant(numCourant);
    if (!pistolet || !pistolet.dateCreation) return null;
  
    const date = new Date(pistolet.dateCreation);
    const jour = date.getDate().toString().padStart(2, '0');
    const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  
    return `${jour}-${mois}`;
  }
  
  getCodeRepartition(numCourant: number): string | null {
    const pistolet = this.getPistoletParNumCourant(numCourant);
    return pistolet ? pistolet.codeRepartiton : null;
  }
  getAnnee(): number | null {
    if (!this.pistolets || this.pistolets.length === 0) return null;
  
    const pistolet = this.pistolets[0]; // Utiliser le premier pistolet si tu veux une valeur par défaut
    if (!pistolet.dateCreation) return null;
  
    const date = new Date(pistolet.dateCreation);
    return date.getFullYear();
  }
   onValiderPistolet(id: number) {
     this.pistoletGeneralService.validerPistolet(id).subscribe({
       next: () => {
         console.log('Pistolet validé avec succès');
         this.pistoletsValides.add(id); // Marquer ce pistolet comme validé
   
         Swal.fire({
           title: 'Confirmation !',
           text: 'Pistolet validé avec succès.',
           icon: 'success',
           confirmButtonText: 'OK',
           customClass: {
             popup: 'custom-popup',
             title: 'custom-title',
             confirmButton: 'custom-confirm-button'
           }
         });
       },
       error: (err) => {
         console.error('Erreur lors de la validation :', err);
         Swal.fire({
           title: 'Erreur',
           text: 'Erreur lors de la validation',
           icon: 'error',
           confirmButtonText: 'OK'
         });
       }
     });
   }
  
  getCoupePropre(numCourant: number): string | null {
    const pistolet = this.pistolets.find(p => p.numCourant === numCourant);
    return pistolet ? pistolet.coupePropre : null;}

  naviger(){
    this.router.navigate(['/dashboard']);
  }
  debugButton(pistolet: Pistolet) {
    console.log('Bouton détecté pour pistolet :', pistolet.id, 'Décision:', pistolet.decision, 'Validé:', this.pistoletsValides.has(pistolet.id));
  }
  shouldAfficherBouton(pistolet: Pistolet): boolean {
    console.log('Évaluation bouton pour', pistolet.id, {
      decision: pistolet.decision,
      isValide: this.pistoletsValides.has(pistolet.id)
    });
    return pistolet.decision === 0 && !this.pistoletsValides.has(pistolet.id);
  }
  
 }