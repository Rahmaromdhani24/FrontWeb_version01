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
  selector: 'app-pdek-torsadage-simple',
 imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
  templateUrl: './pdek-torsadage-simple.component.html',
  styleUrl: './pdek-torsadage-simple.component.scss'
})
export class PdekTorsadageSimpleComponent implements OnInit {

  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService   , 
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
   torsadagesValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   torsadages: Torsadage[] = [] ; 
   torsadagesParPage: Map<number, Torsadage[]> = new Map();
   specificationMesure: number = 0; 
   idPdek : number ;
   numPage : number ;
   reponseApi : any ; 
   machine : string =''
   annee  : string =''
   role : string =''
   ngOnInit(): void {
    this.reponseApi = JSON.parse(localStorage.getItem("reponseApi")!);
    this.role= localStorage.getItem('role') || '';


    const pdekTorsadageJson = localStorage.getItem('pdekTorsadage');
    if (pdekTorsadageJson) {
    const pdekTorsadage = JSON.parse(pdekTorsadageJson);
    this.specificationMesure = this.extraireValeurNumerique(pdekTorsadage.sectionFil);
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
    this.machine = pdekTorsadage.numeroMachine
    const date = new Date(pdekTorsadage.date);
    this.annee=  date.getFullYear()+"";
    } 

    const pdekTorsadageJson1 = localStorage.getItem('torsadage');
    if (pdekTorsadageJson1) {
    const pdekTorsadage = JSON.parse(pdekTorsadageJson1);
    this.specificationMesure = this.extraireValeurNumerique(pdekTorsadage.specificationMesure);
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
    this.machine = pdekTorsadage.numeroMachine
    const date = new Date(pdekTorsadage.date);
    this.annee=  date.getFullYear()+"";
    } 
    this.recupererDonneesDeFichierPdekDePageParticulier().subscribe();
    console.log('test valeur x' +this.getValeurX(4, 1))
    this.plantUser = localStorage.getItem('plant')!;
    this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    this.matriculeAgentQualite= parseInt(localStorage.getItem('matricule') ?? '0');
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
    series: [
      {
        name: 'Moyenne',
        data: [] // Rempli dynamiquement
      }
    ],
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
      min: (this.specificationMesure - 2) - 1,
      max: (this.specificationMesure + 2) + 1,
      tickAmount: 6,
      labels: {
        show: false,
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
      size: 6,
      shape: 'circle',
      strokeColors: '#fff',
      strokeWidth: 2,
      colors: ['#000']
    },
    tooltip: {
      enabled: true
    },
    annotations: {
      yaxis: [
        {
          y: (this.specificationMesure - 2) - 1,
          y2: (this.specificationMesure - 2),
          fillColor: '#ff00006e',
          opacity: 0.4,
          borderColor: '#ff0000',
          label: {
            text: `Zone Rouge (${(this.specificationMesure - 2)})`,
            style: {
              background: '#ff0000',
              color: '#fff'
            }
          }
        },
        {
          y: (this.specificationMesure - 2),
          y2: (this.specificationMesure - 2) + 0.8 ,
          fillColor: '#ffff0064',
          opacity: 0.5,
          borderColor: '#ffff00',
          label: {
            text: `Zone Vert ( ${((this.specificationMesure - 2) + 0.8)})`,
            style: {
              background: '#00c800',
              color: '#fff'
            }
          }
        },
        {
          y: ((this.specificationMesure - 2) + 0.8),
          y2: ((this.specificationMesure + 2) - 0.8),
          fillColor: '#00c80087',
          opacity: 0.4,
          borderColor: '#00c800',
          label: {
            text: `Zone Verte ( ${((this.specificationMesure + 2) -  0.8)})`,
            style: {
              background: '#00c800',
              color: '#fff'
            }
          }
        },
        {
          y: ((this.specificationMesure + 2) - 0.8),
          y2: (this.specificationMesure + 2),
          fillColor: '#ffff0064',
          opacity: 0.5,
          borderColor: '#ffff00',
          label: {
            text: `Zone Rouge ( ${(this.specificationMesure + 2)})`,
            style: {
              background: '#ff00006e',
              color: '#fff'
            }
          }
        },
        {
          y: (this.specificationMesure + 2),
          y2: (this.specificationMesure + 2)+1,
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
          y: (this.specificationMesure),
          borderColor: 'black',
          label: {
            text: `Pas: ${this.specificationMesure}`,
            style: {
              background: '#000',
              color: '#fff'
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
          enabled: true
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
    
    
 /*********************** Chart d'Étendue R *******************************/
recupererDonneesDeFichierPdekDePageParticulier(): Observable<Torsadage[]> {
  return this.torsadageService.getTorsadagesParPdekEtPage(this.idPdek, this.numPage).pipe(
    tap((data: Torsadage[]) => {
      this.torsadages = data;

      const pdekTorsadageJson = localStorage.getItem('pdekTorsadage');
      if (pdekTorsadageJson) {
      const pdekTorsadage= JSON.parse(pdekTorsadageJson);    
      this.specificationMesure = this.extraireValeurNumerique(pdekTorsadage.sectionFil);
      console.log("specificiation mesure :"+  this.specificationMesure) ; 
      }
      const pdekTorsadageJson1 = localStorage.getItem('torsadage');
      if (pdekTorsadageJson1) {
      const pdekTorsadage = JSON.parse(pdekTorsadageJson1);
      this.specificationMesure = this.extraireValeurNumerique(pdekTorsadage.specificationMesure);
      this.idPdek = this.reponseApi.pdekId;
      this.numPage = this.reponseApi.pageNumber;
      } 

      /*this.seriesDataMoyenne = data.map(p => ({
        x: p.numeroCycle,
        y: p.moyenne
      }));*/
      this.seriesDataMoyenne = data.map((p: any) => ({
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
   
    /*  this.seriesDataEtendue = data.map(p => ({
        x: p.numeroCycle,
        y: Number(p.etendu)
      }));*/
      this.seriesDataEtendue = data.map((p: any)=> ({
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
      if (data.length > 0) {
        this.numeroCourant = data[data.length - 1].numeroCycle;
      }
    // **On ré-affecte** l’objet complet d’options du chart
    this.chartOptionsMoyenne = {
      series: [{
        name: 'Moyenne',
        data: dataRemplie
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
        toolbar: { show: false } ,
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
        min: (this.specificationMesure - 2) - 1,
        max: (this.specificationMesure + 2) + 1,
        tickAmount: 6,
        labels: {
          show: false,
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
            y: (this.specificationMesure - 2) - 1,
            y2: (this.specificationMesure - 2),
            fillColor: '#ff00006e',
            opacity: 0.4,
            borderColor: '#ff0000',
            label: {
              text: `Zone Rouge (${(this.specificationMesure - 2)})`,
              style: {
                background: '#ff0000',
                color: '#fff'
              }
            }
          },
          {
            y: (this.specificationMesure - 2),
            y2: (this.specificationMesure - 2) + 0.8 ,
            fillColor: '#ffff0064',
            opacity: 0.5,
            borderColor: '#ffff00',
            label: {
              text: `Zone Vert ( ${((this.specificationMesure - 2) + 0.8)})`,
              style: {
                background: '#00c800',
                color: '#fff'
              }
            }
          },
          {
            y: ((this.specificationMesure - 2) + 0.8),
            y2: ((this.specificationMesure + 2) - 0.8),
            fillColor: '#00c80087',
            opacity: 0.4,
            borderColor: '#00c800',
            label: {
              text: `Zone Verte ( ${((this.specificationMesure + 2) -  0.8)})`,
              style: {
                background: '#00c800',
                color: '#fff'
              }
            }
          },
          {
            y: ((this.specificationMesure + 2) - 0.8),
            y2: (this.specificationMesure + 2),
            fillColor: '#ffff0064',
            opacity: 0.5,
            borderColor: '#ffff00',
            label: {
              text: `Zone Rouge ( ${(this.specificationMesure + 2)})`,
              style: {
                background: '#ff00006e',
                color: '#fff'
              }
            }
          },
          {
            y: (this.specificationMesure + 2),
            y2: (this.specificationMesure + 2)+1,
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
            y: (this.specificationMesure),
            borderColor: 'black',
            label: {
              text: `Pas: ${this.specificationMesure}`,
              style: {
                background: '#000',
                color: '#fff'
              }
            }
          }
        ]
      }
    };
    this.chartOptionsEtendue = {
      series: [{
        name: 'Étendue',
        data: dataRemplie2
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
        toolbar: { show: false } ,
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
   
    }),
    catchError(error => {
      console.error('Erreur lors de la récupération des soudures', error);
      return of([]);
    })
  );
}


 getDecision(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.decision : null;}
  
      getRempliePlanAction(numCourant: number): number | null {
        const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
        return torsadage ? torsadage.rempliePlanAction : null;}
     
  getTorsadageParNumCourant(num: number): Torsadage | undefined {
    return this.torsadages.find(p => p.numeroCycle === num); }


            getValeurX(rowIndex: number, numCourant: number): string | null {
              const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
              if (!torsadage) return null;
            
              const key = `ech${rowIndex + 1}` as keyof Torsadage;
              const value = torsadage[key];
            
              return typeof value === 'string' ? value : null;
            }
            
              

    getMoyenne(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.moyenne : null;}

    
    getEtendu(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.etendu : null;}

    
    getNom(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.userTorsadage : null;}

    getValeurBoutDebutC1(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.longueurBoutDebutCdeC1 : null;}

    getValeurBoutDebutC2(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.longueurBoutDebutCdeC2 : null;}
  
    getValeurBoutFinC1(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.longueurBoutFinCdeC1 : null;}
  

    getValeurBoutFinC2(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.longueurBoutFinCdeC2 : null;}

    getDecalageMaxDebutC1(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.decalageMaxDebutCdec1 : null;}

  
    getDecalageMaxDebutC2(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.decalageMaxDebutCdec2 : null;}

      getRange(n: number): number[] {
        return new Array(n).fill(0).map((_, i) => i);
      }
      
    getDecalageMaxFinC1(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.decalageMaxFinCdec1 : null;}

    getDecalageMaxFinC2(numCourant: number): number | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      return torsadage ? torsadage.decalageMaxFinCdec2 : null;}

  
    getDateSansAnnee(numCourant: number): string | null {
      const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
      if (!torsadage || !torsadage.date) return null;
    
      const date = new Date(torsadage.date);
      const jour = date.getDate().toString().padStart(2, '0');
      const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    
      return `${jour}-${mois}`;
    }   
  
  getCodeControle(numCourant: number): string | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.code : null;
  }
  getMatriculeAgentQualite(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.matriculeAgentQualite : null;
  }
 
  
  getAnnee(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    if (!torsadage || !torsadage.date) return null;
  
    const date = new Date(torsadage.date);
    return date.getFullYear();
  }

  
  onValiderTorsadage(id: number) {
     this.torsadageService.validerTorsadage(id, this.matriculeAgentQualite).subscribe({
                     next: () => {
                       console.log('Pdek Torsadage validé avec succès');
                       this.torsadagesValides.add(id); // Marquer ce pistolet comme validé
                 
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

  getSpecificationMesure(numCourant: number): string | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.sectionFil : null;
  }
  getLongueurFinalDebutCde(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.longueurFinalDebutCde : null;
  }
  getLongueurFinalFinCde(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.longueurFinalFinCde : null;
  }
  getMatriculeOperateur(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.userTorsadage : null;
  }
  getQuantiteAtteint(numCourant: number): number | null {
    const torsadage = this.torsadages.find(p => p.numeroCycle === numCourant);
    return torsadage ? torsadage.quantiteAtteint : null;
  }
  /* naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/dashboard']);
  }*/

  extraireValeurNumerique(spec: string): number {
    const match = spec.match(/[\d.]+/); // Capture les nombres (entiers ou décimaux)
    return match ? parseFloat(match[0]) : 0;
  }
  naviger() {
    localStorage.removeItem('reponseApi');
    localStorage.removeItem('pdekTorsadage');
    localStorage.removeItem('torsadage');
    // Trick pour forcer reload
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
  
}