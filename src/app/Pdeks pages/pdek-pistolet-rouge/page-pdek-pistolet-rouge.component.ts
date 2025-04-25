import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels,
  ApexYAxis, ApexTitleSubtitle, ApexStroke, ApexTooltip, ApexMarkers, ApexFill, ApexAnnotations, ApexLegend
} from 'ng-apexcharts';
import { Observable, of } from 'rxjs';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { MatButtonModule } from '@angular/material/button';
import { ContenuPagePdekDTO } from 'src/app/Modeles/ContenuPagePdekDTO';
import { PdekService } from 'src/app/services/PDEK service/pdek.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-page-pdek-pistolet-rouge',
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
  templateUrl: './page-pdek-pistolet-rouge.component.html',
  styleUrl: './page-pdek-pistolet-rouge.component.scss'
})
export class PagePdekPistoletRougeComponent implements OnInit ,AfterViewInit  {
  pages: {
    pageNum: number;
    pistolets: Pistolet[];
    chartOptionsMoyenne: any;
    chartOptionsEtendue: any;
  }[] = [];
  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService , private pistoletGeneralService: PistoletGeneralService  , 
              private router : Router  , private route: ActivatedRoute ){}
  
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
  // idPdek : number ;
   //numPage : number ;
  // categorie : string ;
   plantUser : string ; 
   segmentUser : number  ; 
   pistolets: Pistolet[] = [];
   //pistolet : Pistolet ; 
   //reponseApi : any ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   ngOnInit(): void {
    this.pdekId = +this.route.snapshot.paramMap.get('id')!;
    this.chargerToutesLesPages(); // 👈 appel ici
    
    this.plantUser = localStorage.getItem('plant')!;
    this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    this.matriculeAgentQualite = +localStorage.getItem('matricule')!;
  
    //this.pistolet = JSON.parse(localStorage.getItem("pistolet")!);
    //this.reponseApi = JSON.parse(localStorage.getItem("reponseApi")!);
   //this.numeroPistolet = this.pistolet.numeroPistolet;
    //this.typePistolet = this.pistolet.type;
   // this.categorie = this.pistolet.categorie;
   // this.idPdek = this.reponseApi.pdekId;
    //this.numPage = this.reponseApi.pageNumber;
  
    this.plantUser = localStorage.getItem('plant')!;
    this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;
   
  }; 
  hideLoader(): void { this.showLoader = false;  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 5000); // Délai de 3 secondes (ajustez selon vos besoins)
  }
/***************************** Chart moyenne X *****************************************/
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
getChartOptionsMoyenne(data: { x: number; y: number }[]) {
  return { ...this.chartOptionsMoyenne,
    series: [{
      name: 'Moyenne',
      data
    }]
  };
}

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
  getChartOptionsEtendue(data: { x: number; y: number }[]) {
    return {
      ...this.chartOptionsEtendue,
      series: [{
        name: 'Étendue',
        data
      }]
    };
  }
 /*********************** Chart d'Étendue R *******************************/

 chargerToutesLesPages(): void {
  this.pdekService.getContenuParPage(this.pdekId).subscribe({
    next: (contenuPages) => {
      // Traitement direct des données de contenuPages
      console.log('Contenu récupéré du backend :', contenuPages);
      this.pages = contenuPages.map((page: any) => {
        const pistolets = page.contenu;

        const dataMoyenne = pistolets.map((p: any) => ({
          x: p.numCourant,
          y: p.moyenne
        }));

        const dataEtendue = pistolets.map((p: any) => ({
          x: p.numCourant,
          y: Number(p.etendu)
        }));

        return {
          pageNum: page.numeroPage,
          pistolets,
          chartOptionsMoyenne: this.getChartOptionsMoyenne(dataMoyenne),
          chartOptionsEtendue: this.getChartOptionsEtendue(dataEtendue)
        };
      });
      console.log('Pages traitées avec graphiques :', this.pages);
      this.showLoader = false;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des pages du PDEK', err);
      this.showLoader = false;
    }
  });
}


  getPistoletParNumCourant(num: number): Pistolet | undefined {
    return this.pistolets.find(p => p.numCourant === num);}

    getValeurX(page: any, row: number, col: number): number | null {
      const pistolet = page.pistolets?.[col];
      if (!pistolet) return null;
      const echs = [pistolet.ech1, pistolet.ech2, pistolet.ech3, pistolet.ech4, pistolet.ech5];
      return echs[row] ?? null;
    }
    

    getMoyenne(page: any, col: number): string | null {
      const pistolet = page.pistolets?.[col];
      return pistolet ? pistolet.moyenne : null;
    }
    
    
    getEtendu(page: any, col: number): string | null {
      const pistolet = page.pistolets?.[col];
      return pistolet ? pistolet.etendu : null;
    }
    
    getNom(page: any, col: number): number | null {
      const pistolet = page.pistolets?.[col];
      return pistolet ? pistolet.matricule : null;
    }
    
  
    getDateSansAnnee(page: any, col: number): string | null {
      const pistolet = page.pistolets?.[col];
      if (!pistolet || !pistolet.dateCreation) return null;
    
      const date = new Date(pistolet.dateCreation);
      const jour = date.getDate().toString().padStart(2, '0');
      const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    
      return `${jour}-${mois}`;
    }   
  
  getCodeRepartition(page: any, col: number): string | null {
    const pistolet = page.pistolets?.[col];
    return pistolet ? pistolet.codeRepartiton : null;
  }
  getAnnee(page: any, col: number): number | null {
    const pistolet = page.pistolets?.[col];
    if (!pistolet || !pistolet.dateCreation) return null;
  
    const date = new Date(pistolet.dateCreation);
    return date.getFullYear();
  }
  
  onValiderPistolet(id: number) {
     this.pistoletGeneralService.validerPistolet(id, this.matriculeAgentQualite).subscribe({
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
  getCoupePropre(page: any, col: number): string | null {
    const pistolet = page.pistolets?.[col];
    return pistolet ? pistolet.coupePropre : null;
  }
  
  getNumeroPistolet(page: any): number | null {
    return page.pistolets?.[0]?.numeroPistolet ?? null; // On prend le premier pistolet
  }
  
   naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/ui-components/listePdekPistolet']);
  }
 }