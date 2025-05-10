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
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { MatButtonModule } from '@angular/material/button';
import { ContenuPagePdekDTO } from 'src/app/Modeles/ContenuPagePdekDTO';
import { PdekService } from 'src/app/services/PDEK service/pdek.service';
import { forkJoin } from 'rxjs';
import { Soudure } from 'src/app/Modeles/Soudure';
import { TorsadageService } from 'src/app/services/Agent Qualite Operation Torsadage/torsadage.service';
import { Torsadage } from 'src/app/Modeles/Torsadage';

@Component({
  selector: 'app-pdek-torsadage',
 imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
  templateUrl: './pdek-torsadage.component.html',
  styleUrl: './pdek-torsadage.component.scss'
})
export class PdekTorsadageComponent implements OnInit {
pages: {
    pageNum: number;
    torsadages: Torsadage[];
    chartOptionsMoyenne: any;
    chartOptionsEtendue: any;
  }[] = [];
  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService , private pistoletGeneralService: PistoletGeneralService  , 
              private router : Router  , private route: ActivatedRoute , 
              private torsadageService : TorsadageService ){}
  
  seriesDataEtendue: { x: string, y: number }[] = [];
   seriesDataMoyenne: { x: string, y: number }[] = [];
   rows = Array.from({ length: 25 }, (_, i) => i + 1);
   showLoader : boolean = true; 
   twentyFive: number[] = Array.from({ length: 25 }, (_, i) => i + 1);
   numCourants : any  =  [1 ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
   anneePDEK : number = 0 ;
   numeroCourant : number ; 
   plantUser : string ; 
   segmentUser : number  ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   torsadages: Torsadage[] = [] ; 
   torsadagesParPage: Map<number, Torsadage[]> = new Map();
   specificationMesure: number = 0; 
   roleUser  = localStorage.getItem('role') || '';


   ngOnInit(): void {
    this.pdekId = +this.route.snapshot.paramMap.get('id')!;
    this.chargerToutesLesPages();
    const pdekTorsadageJson = localStorage.getItem('pdekTorsadage');
  
   /* if (pdekTorsadageJson) {
      const pdekTorsadage= JSON.parse(pdekTorsadageJson);    
       this.specificationMesure = this.extraireValeurNumerique(pdekTorsadage.specificationMesure);
       console.log("specificiation mesure :"+  this.specificationMesure) ; 
    }*/
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
} 

// Méthode pour obtenir les options du graphique
getChartOptionsMoyenne(data: { x: string, y: number | null }[]): any {
  const pas = this.specificationMesure;

  const zoneMin = (pas - 2) - 1;
  const zoneMax = (pas + 2) + 1;

  const rougeBasStart = zoneMin;
  const rougeBasEnd = pas - 2;

  const jauneBasStart = rougeBasEnd;
  const jauneBasEnd = jauneBasStart + 0.8;

  const vertStart = jauneBasEnd;
  const vertEnd = (pas + 2) - 0.8;

  const jauneHautStart = vertEnd;
  const jauneHautEnd = jauneHautStart + 0.8;

  const rougeHautStart = jauneHautEnd;
  const rougeHautEnd = zoneMax;

  return {
    series: [
      {
        name: 'Moyenne',
        data
      }
    ],
    chart: {
      type: 'line',
      height: 400,
      background: 'transparent',
      animations: { enabled: false },
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
      min: zoneMin,
      max: zoneMax,
      tickAmount: 6,
      labels: {
        show: true,
        formatter: (val: number) => `${val}`
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
      enabled: true,
      x: {
        formatter: (val: number) => `Numéro Courant: ${val}`
      },
      y: {
        formatter: (val: number) => `${val}`
      }
    },
    annotations: {
      yaxis: [
        {
          y: rougeBasStart,
          y2: rougeBasEnd,
          fillColor: '#ff00006e',
          opacity: 0.4,
          borderColor: '#ff0000',
          label: {
            text: `Zone Rouge (${rougeBasEnd})`,
            style: {
              background: '#ff0000',
              color: '#fff'
            }
          }
        },
        {
          y: jauneBasStart,
          y2: jauneBasEnd,
          fillColor: '#ffff0064',
          opacity: 0.5,
          borderColor: '#ffff00',
          label: {
            text: `Zone Vert ( ${jauneBasEnd.toFixed(2)})`,
            style: {
              background: '#00c800',
              color: '#fff'
            }
          }
        },
        {
          y: vertStart,
          y2: vertEnd,
          fillColor: '#00c80087',
          opacity: 0.4,
          borderColor: '#00c800',
          label: {
            text: `Zone Verte ( ${vertEnd.toFixed(2)})`,
            style: {
              background: '#00c800',
              color: '#fff'
            }
          }
        },
        {
          y: jauneHautStart,
          y2: jauneHautEnd,
          fillColor: '#ffff0064',
          opacity: 0.5,
          borderColor: '#ffff00',
          label: {
            text: `Zone Rouge ( ${jauneHautEnd.toFixed(2)})`,
            style: {
              background: '#ff00006e',
              color: '#fff'
            }
          }
        },
        {
          y: rougeHautStart,
          y2: rougeHautEnd,
          fillColor: '#ff00006e',
          opacity: 0.4,
          borderColor: '#ff0000',
          label: {
            //text: `Zone Rouge (${rougeHautStart} à ${rougeHautEnd})`,
            style: {
              background: '#ff0000',
              color: '#fff'
            }
          }
        },
        {
          y: pas,
          borderColor: 'black',
          label: {
            text: `Pas: ${pas}`,
            style: {
              background: '#000',
              color: '#fff'
            }
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
    getChartOptionsEtendue(data: { x: string, y: number | null }[]): any {
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
          max: 2.7 ,
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
          enabled: true,
          x: {
            formatter: (val: number) => `Numéro Courant: ${val}`
          },
          y: {
            formatter: (val: number) => `${val}`
          }
        },
        annotations: {
          yaxis: [
            {
              y: 2.4,
              borderColor: 'red',
              label: {
                style: {
                  color: '#fff',
                  background: 'red'
                },
                text: `Étendue Max: ${2.4}`
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
        const torsadages = page.contenu;

       /* const dataMoyenne = torsadages.map((p: any) => ({
          x: p.numeroCycle,
          y: p.moyenne
        }));
*/
this.seriesDataMoyenne = torsadages.map((p: any) => ({
  x: p.numeroCycle.toString(), // 👈 Important ! doit correspondre à category type string
  y: p.moyenne
}));        

const dataRemplie = Array.from({ length: 25 }, (_, i) => {
  const x = (i + 1).toString();
  const point = this.seriesDataMoyenne.find(p => p.x === x);
  return {
    x,
    y: point ? point.y : null
  };
});
       /* const dataEtendue = torsadages.map((p: any) => ({
          x: p.numeroCycle,
          y: Number(p.etendu)
        }));
        console.log("data etendu :"+  dataEtendue) ; */

        this.seriesDataEtendue = torsadages.map((p: any)=> ({
          x: p.numeroCycle.toString(),
          y: Number(p.etendu) 
        }));
      
        const dataRemplie2 = Array.from({ length: 25 }, (_, i) => {
          const x = (i + 1).toString();
          const point = this.seriesDataEtendue.find(p => p.x === x);
          return {
            x,
            y: point ? point.y : null
          };
        });
        const pdekTorsadageJson = localStorage.getItem('pdekTorsadage') || '{}';
        const pdekTorsadage= JSON.parse(pdekTorsadageJson);    
        this.specificationMesure = this.extraireValeurNumerique(pdekTorsadage.sectionFil);
        console.log("specificiation mesure :"+  this.specificationMesure) ; 
    
        return {
          pageNum: page.numeroPage,
          torsadages,
          chartOptionsMoyenne: this.getChartOptionsMoyenne(dataRemplie),
          chartOptionsEtendue: this.getChartOptionsEtendue(dataRemplie2) // ✅ Appelle ici
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




  getTorsadageParNumCourant(num: number): Torsadage | undefined {
    return this.torsadages.find(p => p.numeroCycle === num); }

    getValeurX(page: any, row: number, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      if (!torsadage) return null;
      const echs = [torsadage.ech1, torsadage.ech2, torsadage.ech3, torsadage.ech4, torsadage.ech5];
      return echs[row] ?? null;
    }
    

    getMoyenne(page: any, col: number): string | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.moyenne : null;
    }
    
    
    getEtendu(page: any, col: number): string | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.etendu : null;
    }
    
    getNom(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.matricule : null;
    }
    
    getValeurBoutDebutC1(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.longueurBoutDebutCdeC1 : null;
    }

    getValeurBoutDebutC2(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.longueurBoutDebutCdeC2 : null;
    }

    getValeurBoutFinC1(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.longueurBoutFinCdeC1 : null;
    }

    getValeurBoutFinC2(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.longueurBoutFinCdeC2 : null;
    }
    getDecalageMaxDebutC1(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.decalageMaxDebutCdec1 : null;
    }
    getDecalageMaxDebutC2(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.decalageMaxDebutCdec2 : null;
    }
    getDecalageMaxFinC1(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.decalageMaxFinCdec1 : null;
    }
    getDecalageMaxFinC2(page: any, col: number): number | null {
      const torsadage = page.torsadages?.[col];
      return torsadage ? torsadage.decalageMaxFinCdec2 : null;
    }
    getDateSansAnnee(page: any, col: number): string | null {
      const torsadage = page.torsadages?.[col];
      if (!torsadage || !torsadage.date) return null;
    
      const date = new Date(torsadage.date);
      const jour = date.getDate().toString().padStart(2, '0');
      const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    
      return `${jour}-${mois}`;
    }   
  
  getCodeControle(page: any, col: number): string | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.code : null;
  }
  getMatriculeAgentQualite(page: any, col: number): string | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.matriculeAgentQualite : null;
  }
  getNumMachine(): string {
    const pdekTorsadageJson = localStorage.getItem('pdekTorsadage');
    if (pdekTorsadageJson) {
      const pdekTorsadage = JSON.parse(pdekTorsadageJson);
      return pdekTorsadage.numMachine;
    }
    return '';
  }
  
  getAnnee(page: any, col: number): number | null {
    const torsadage = page.torsadages?.[col];
    if (!torsadage || !torsadage.date) return null;
  
    const date = new Date(torsadage.date);
    return date.getFullYear();
  }
  getTorsadageByIndex(page: any, index: number): Torsadage | null {
    const torsadages = this.torsadagesParPage.get(page);
    return torsadages && torsadages.length > index ? torsadages[index] : null;
  }
  
  onValiderTorsadage(id: number) {
     this.torsadageService.validerTorsadage(id, this.matriculeAgentQualite).subscribe({
                     next: () => {
                       console.log('Pdek Torsadage validé avec succès');
                       this.pistoletsValides.add(id); // Marquer ce pistolet comme validé
                 
                       Swal.fire({
                         title: 'Confirmation !',
                         text: 'Pdek Torsadage validé avec succès.',
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

  getSpecificationMesure(page: any, col: number): string | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.sectionFil : null;
  }
  getLongueurFinalDebutCde(page: any, col: number): string | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.longueurFinalDebutCde : null;
  }
  getLongueurFinalFinCde(page: any, col: number): string | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.longueurFinalFinCde : null;
  }
  getMatriculeOperateur(page: any, col: number): number | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.userTorsadage : null;
  }
  getQuantiteAtteint(page: any, col: number): number | null {
    const torsadage = page.torsadages?.[col];
    return torsadage ? torsadage.quantiteAtteint : null;
  }
 /*  naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/ui-components/listePdekTousProcess']);
  }
*/
naviger() {
  localStorage.removeItem('reponseApi');
  localStorage.removeItem('pdekTorsadage');
  // Trick pour forcer reload
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/ui-components/listePdekTousProcess']);
  });
}
  extraireValeurNumerique(spec: string): number {
    const match = spec.match(/[\d.]+/); // Capture les nombres (entiers ou décimaux)
    return match ? parseFloat(match[0]) : 0;
  }
  
  
}