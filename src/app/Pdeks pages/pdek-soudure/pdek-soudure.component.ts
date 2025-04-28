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
import { Soudure } from 'src/app/Modeles/Soudure';
import { SoudureService } from 'src/app/services/Agent Qualité Operation Soudure/soudure.service';

@Component({
  selector: 'app-pdek-soudure',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
  templateUrl: './pdek-soudure.component.html',
  styleUrl: './pdek-soudure.component.scss'
})
export class PdekSoudureComponent {
pages: {
    pageNum: number;
    soudures: Soudure[];
    chartOptionsMoyenne: any;
    chartOptionsEtendue: any;
  }[] = [];
  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService , private pistoletGeneralService: PistoletGeneralService  , 
              private router : Router  , private route: ActivatedRoute , 
              private soudureService : SoudureService ){}
  
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
   plantUser : string ; 
   segmentUser : number  ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   soudures: Soudure[] = [] ; 
   souduresParPage: Map<number, Soudure[]> = new Map();
   etenduMax: number = 0; 
   moyenneMin: number = 0; 
   moyenneMax: number = 0; 
   pelageMin: number = 0; 

   ngOnInit(): void {
    this.pdekId = +this.route.snapshot.paramMap.get('id')!;
    const pdekSoudureJson = localStorage.getItem('pdekSoudure');
  
    if (pdekSoudureJson) {
      const pdekSoudure = JSON.parse(pdekSoudureJson);    
      const sectionFil = this.extraireValeurNumeriqueSectionFil(pdekSoudure.sectionFil);
  
      this.chargerEtenduMax(sectionFil); // 👈 Appelle modifiée avec la suite ci-dessous
      this.chargerMoyenneMax(sectionFil);
      this.chargerMoyenneMin(sectionFil);
      this.chargerPelageMin(sectionFil);
    }
    this.checkAndUpdateGraph() ;
    this.plantUser = localStorage.getItem('plant')!;
    this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    this.matriculeAgentQualite = +localStorage.getItem('matricule')!;
  }
  

  hideLoader(): void { this.showLoader = false;  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 6000); // Délai de 5 secondes (ajustez selon vos besoins)
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
} = {
  series: [{
    name: 'Moyenne',
    data: [] // Rempli dynamiquement
  }],
  chart: {
    type: 'line',
    height: 250,
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
    min: this.pelageMin - 4, // Dynamique en fonction de pelageMin
    max: this.moyenneMax + 2, // Dynamique en fonction de moyenneMax
    tickAmount: 20,
    labels: {
      show: true,
      formatter: (val: number) => val % 2 === 0 && val !== 0 ? `${val}` : ''
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
    strokeColors: '#fff',
    strokeWidth: 1,
    colors: ['#333']
  },
  tooltip: {
    enabled: true
  },
  annotations: {
    yaxis: [
      // Zone rouge (Pelage Min - 4 à Pelage Min)
      {
        y: this.pelageMin - 4,
        y2: this.pelageMin,
        fillColor: '#ff00006e',
        opacity: 0.4
      },
      // Zone jaune (Pelage Min à Moyenne Min)
      {
        y: this.pelageMin,
        y2: this.moyenneMin,
        fillColor: '#ffff0064',
        opacity: 0.5
      },
      // Zone verte (Moyenne Min à Moyenne Max)
      {
        y: this.moyenneMin,
        y2: this.moyenneMax,
        fillColor: '#00c80087',
        opacity: 0.4
      }
    ]
  }
};

// Méthode pour obtenir les options du graphique
getChartOptionsMoyenne(data: { x: number; y: number }[]) {
  return { 
    series: [{
      name: 'Moyenne',
      data
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
      min: this.pelageMin - 4, // Dynamique en fonction de pelageMin
      max: this.moyenneMax + 2, // Dynamique en fonction de moyenneMax
      tickAmount: 20,
      labels: {
        show: true,
        formatter: (val: number) => val % 2 === 0 && val !== 0 ? `${val}` : ''
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
      strokeColors: '#fff',
      strokeWidth: 1,
      colors: ['#333']
    },
    tooltip: {
      enabled: true
    },
    annotations: {
      yaxis: [
        // Zone rouge (Pelage Min - 4 à Pelage Min)
        {
          y: this.pelageMin - 4,
          y2: this.pelageMin,
          fillColor: '#ff00006e',
          opacity: 0.4
        },
        // Zone jaune (Pelage Min à Moyenne Min)
        {
          y: this.pelageMin,
          y2: this.moyenneMin,
          fillColor: '#ffff0064',
          opacity: 0.5
        },
        // Zone verte (Moyenne Min à Moyenne Max)
        {
          y: this.moyenneMin,
          y2: this.moyenneMax,
          fillColor: '#00c80087',
          opacity: 0.4
        },
        // Lignes pour Pelage Min, Moyenne Min, et Moyenne Max
        {
          y: this.pelageMin,
          borderColor: 'yellow',
          label: {
            style: {
              color: '#000',
              background: 'yellow'
            },
            text: `Pelage Min: ${this.pelageMin}`
          }
        },
        {
          y: this.moyenneMin,
          borderColor: 'gray',
          label: {
            style: {
              color: '#fff',
              background: 'gray'
            },
            text: `Moyenne Min: ${this.moyenneMin}`
          }
        },
        {
          y: this.moyenneMax,
          borderColor: 'green',
          label: {
            style: {
              color: '#fff',
              background: 'green'
            },
            text: `Moyenne Max: ${this.moyenneMax}`
          }
        } ,
        {
          y: this.pelageMin,
          borderColor: 'red',
          label: {
            style: {
              color: '#fff',
              background: 'red'
            },
          
          }
        } ,
        {
          y: this.moyenneMin,
          borderColor: 'yellow',
          label: {
            style: {
              color: '#fff',
              background: 'yellow'
            },
          
          }
        }
      ]
    }
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
    } 
    getChartOptionsEtendue(data: { x: number; y: number }[]) {
      return {
        series: [{
          name: 'Étendue',
          data
        }],
        chart: {
          type: 'line',
          height: 250,
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
          min: 0,
          max: this.etenduMax , // ✅ sécurité au cas où non chargé
          tickAmount: 20,
          labels: {
            show: true,
            formatter: (val: number) => val % 2 === 0 && val !== 0 ? `${val}` : ''
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
          strokeColors: '#fff',
          strokeWidth: 1,
          colors: ['#333']
        },
        tooltip: {
          enabled: true
        },
        annotations: {
          yaxis: [
            {
              y: this.etenduMax,
              borderColor: 'red',
              label: {
                style: {
                  color: '#fff',
                  background: 'red'
                },
                text: `Étendue Max: ${this.etenduMax}`
              }
            }
          ]
        }
      };
    }
    
 /*********************** Chart d'Étendue R *******************************/

 chargerToutesLesPages(): void {
  this.pdekService.getContenuParPage(this.pdekId).subscribe({
    next: (contenuPages) => {
      console.log('Contenu récupéré du backend :', contenuPages);

      this.pages = contenuPages.map((page: any) => {
        const soudures = page.contenu;

        const dataMoyenne = soudures.map((p: any) => ({
          x: p.numeroCycle,
          y: p.moyenne
        }));

        const dataEtendue = soudures.map((p: any) => ({
          x: p.numeroCycle,
          y: Number(p.etendu)
        }));

        return {
          pageNum: page.numeroPage,
          soudures,
          chartOptionsMoyenne: this.getChartOptionsMoyenne(dataMoyenne),
          chartOptionsEtendue: this.getChartOptionsEtendue(dataEtendue) // ✅ Appelle ici
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




  getPistoletParNumCourant(num: number): Soudure | undefined {
    return this.soudures.find(p => p.numeroCycle === num); }

    getValeurX(page: any, row: number, col: number): number | null {
      const soudure = page.soudures?.[col];
      if (!soudure) return null;
      const echs = [soudure.ech1, soudure.ech2, soudure.ech3, soudure.ech4, soudure.ech5];
      return echs[row] ?? null;
    }
    

    getMoyenne(page: any, col: number): string | null {
      const soudure = page.soudures?.[col];
      return soudure ? soudure.moyenne : null;
    }
    
    
    getEtendu(page: any, col: number): string | null {
      const soudure = page.soudures?.[col];
      return soudure ? soudure.etendu : null;
    }
    
    getNom(page: any, col: number): number | null {
      const soudure = page.soudures?.[col];
      return soudure ? soudure.matricule : null;
    }
    
  
    getDateSansAnnee(page: any, col: number): string | null {
      const soudure = page.soudures?.[col];
      if (!soudure || !soudure.date) return null;
    
      const date = new Date(soudure.date);
      const jour = date.getDate().toString().padStart(2, '0');
      const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    
      return `${jour}-${mois}`;
    }   
  
  getCodeControle(page: any, col: number): string | null {
    const soudure = page.soudures?.[col];
    return soudure ? soudure.code : null;
  }
  getMatriculeAgentQualite(page: any, col: number): string | null {
    const soudure = page.soudures?.[col];
    return soudure ? soudure.matriculeAgentQualite : null;
  }
  getNumMachine(): string {
    const pdekSoudureJson = localStorage.getItem('pdekSoudure');
    if (pdekSoudureJson) {
      const pdekSoudure = JSON.parse(pdekSoudureJson);
      return pdekSoudure.numMachine;
    }
    return '';
  }
  
  getAnnee(page: any, col: number): number | null {
    const soudure = page.soudures?.[col];
    if (!soudure || !soudure.date) return null;
  
    const date = new Date(soudure.date);
    return date.getFullYear();
  }
  getSoudureByIndex(page: any, index: number): Soudure | null {
    const soudures = this.souduresParPage.get(page);
    return soudures && soudures.length > index ? soudures[index] : null;
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
 
 
  getPilage(page: any, col: number): string | null {
    const soudure = page.soudures?.[col];
    return soudure ? soudure.pliage : null;
  }

  getDistanceBC(page: any, col: number): string | null {
    const soudure = page.soudures?.[col];
    return soudure ? soudure.distanceBC : null;
  }

  getTraction(page: any, col: number): string | null {
    const soudure = page.soudures?.[col];
    return soudure ? soudure.traction : null;
  }
  getSectionFil(page: any, col: number): string | null {
    const soudure = page.soudures?.[col];
    return soudure ? soudure.sectionFil : null;
  }
   naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/ui-components/listePdekTousProcess']);
  }

  chargerEtenduMax(sectionFil: string): void {
    this.soudureService.getEtenduMax(sectionFil).subscribe({
      next: (val: number) => {
        this.etenduMax = val;
        console.log('Étendu Max:', val);
        this.chargerToutesLesPages(); // 👈 appel ici après récupération
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’étendu max:', err);
      }
    });
  }
  

// Méthodes pour récupérer les valeurs
chargerMoyenneMin(sectionFil: string): void {
  this.soudureService.getMoyenneMin(sectionFil).subscribe({
    next: (val: number) => {
      this.moyenneMin = val;
      console.log('Moyenne Min:', val);
      this.checkAndUpdateGraph(); // Assurez-vous que tout est chargé avant de mettre à jour
    },
    error: (err) => {
      console.error('Erreur lors du chargement de la moyenne min:', err);
    }
  });
}

chargerMoyenneMax(sectionFil: string): void {
  this.soudureService.getMoyenneMax(sectionFil).subscribe({
    next: (val: number) => {
      this.moyenneMax = val;
      console.log('Moyenne Max:', val);
      this.checkAndUpdateGraph(); // Assurez-vous que tout est chargé avant de mettre à jour
    },
    error: (err) => {
      console.error('Erreur lors du chargement de la moyenne max:', err);
    }
  });
}

chargerPelageMin(sectionFil: string): void {
  this.soudureService.getPelageValeur(sectionFil).subscribe({
    next: (val: number) => {
      this.pelageMin = val;
      console.log('Pelage Min', val);
      this.checkAndUpdateGraph(); // Assurez-vous que tout est chargé avant de mettre à jour
    },
    error: (err) => {
      console.error('Erreur lors du chargement du pelage min:', err);
    }
  });
}
  /*extraireValeurNumeriqueSectionFil(sectionFil: string): number {
    const valeurStr = sectionFil.trim().split(' ')[0];
    return parseFloat(valeurStr);
  }*/
    extraireValeurNumeriqueSectionFil(sectionFil: string): string {
      if (!sectionFil) {
        return "0.00";
      }
      const match = sectionFil.match(/[0-9]+(\.[0-9]+)?/);
      const value = match ? parseFloat(match[0]) : 0;
      return value.toFixed(2); // forcer 2 chiffres après la virgule sous forme de string
    }
  checkAndUpdateGraph() {
    if (this.pelageMin && this.moyenneMin && this.moyenneMax) {
      this.chargerToutesLesPages(); // Met à jour le graphique uniquement après que toutes les valeurs sont disponibles
    }
 }
}