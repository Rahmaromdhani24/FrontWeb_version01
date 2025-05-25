import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';
import { SoudureService } from 'src/app/services/Agent Qualité Operation Soudure/soudure.service';
import { Soudure } from 'src/app/Modeles/Soudure';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-pdek-soudure-simple',
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
  templateUrl: './pdek-soudure-simple.component.html',
  styleUrl: './pdek-soudure-simple.component.scss'
})
export class PdekSoudureSimpleComponent implements OnInit ,AfterViewInit  {
  window = window;
   constructor(private serviceSoudure: SoudureService  , private router : Router ){}
   matriculeAgentQualite : number ;
   seriesDataEtendue: { x: string, y: number }[] = [];
   seriesDataMoyenne: { x: string, y: number }[] = [];
   rows = Array.from({ length: 25 }, (_, i) => i + 1);
   showLoader : boolean = true; 
   twentyFive: number[] = Array.from({ length: 25 }, (_, i) => i + 1); // Le tableau original
   numCourants : any  =  [1 ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
   anneePDEK : number = 0 ;
   numeroCourant : number ; 
   typePistolet : string ; 
   idPdek : number ;
   numPage : number ;
   categorie : string ;
   plantUser : string ; 
   segmentUser : number  ; 
   soudures: Soudure[] = [];
   reponseApi : any ; 
   souduresValides: Set<number> = new Set();  // Pour stocker les IDs validés
   etenduMax: number = 0; 
   moyenneMin: number = 0; 
   moyenneMax: number = 0; 
   pelageMin: number = 0; 
   soudure : Soudure ;
   sectionFil : string ='' ; 
   numeroMachine : string=''
   ngOnInit(): void {
    this.reponseApi = JSON.parse(localStorage.getItem("reponseApi")!);
  
    const pdekSoudureJson = localStorage.getItem("soudure"); 
    if (pdekSoudureJson) {
      const pdekSoudure = JSON.parse(pdekSoudureJson);
      this.sectionFil = pdekSoudure.sectionFil ; 
      console.log('section fil depuis pdek :' + this.sectionFil)
      this.numeroMachine = pdekSoudure.numeroMachine ; 
      const sectionFil = this.extraireValeurNumeriqueSectionFil(pdekSoudure.sectionFil);

      this.chargerEtenduMax(sectionFil);
      this.chargerMoyenneMax(sectionFil);
      this.chargerMoyenneMin(sectionFil);
      this.chargerPelageMin(sectionFil);
   }
  
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
    this.recupererDonneesDeFichierPdekDePageParticulier().subscribe();
  
    this.plantUser = localStorage.getItem('plant')!;
   // this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    this.matriculeAgentQualite= parseInt(localStorage.getItem('matricule') ?? '0');
  
  }
  
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
} = {
  series: [{
    name: 'Moyenne',
    data: [] // Rempli dynamiquement
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
      show: false,
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
  getRange(n: number): number[] {
    return new Array(n).fill(0).map((_, i) => i);
  }
  recupererDonneesDeFichierPdekDePageParticulier(): Observable<Soudure[]> {
    return this.serviceSoudure.getSouduresParPdekEtPage(this.idPdek, this.numPage).pipe(
      tap((data: Soudure[]) => {
        this.soudures = data;
        console.log('soudures récupérés :', data);
         this.segmentUser =  this.soudures[0].segment;
        this.seriesDataMoyenne = data.map(p => ({
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
     
        this.seriesDataEtendue = data.map(p => ({
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
  
        // 💥 Mettre à jour les options APRÈS réception des données
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
        } ;
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
              show: false,
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
        console.log('Séries Moyenne :', this.seriesDataMoyenne);
        console.log('Séries Étendue :', this.seriesDataEtendue);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des soudures', error);
        return of([]);
      })
    );
  }
  
  
  getSoudureParNumCourant(num: number): Soudure | undefined {
    return this.soudures.find(p => p.numeroCycle === num);}

   
  getValeurX(rowIndex: number, numCourant: number): number | null {
        const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
        if (!soudure) return null;
          
            const key = `ech${rowIndex + 1}` as keyof Soudure;
            const value = soudure[key];
          
            return typeof value === 'number' ? value : null;
          }
        
       
   getMoyenne(numCourant: number): number | null {
    const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
    return soudure ? soudure.moyenne : null;}
        
         
   getEtendu(numCourant: number): number | null {
    const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
    return soudure ? soudure.moyenne : null;}

         
   getNom(numCourant: number): number | null {
    const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
    return soudure ? soudure.userSoudure : null;}

    
    getDateSansAnnee(numCourant: number): string | null {
      const soudure = this.getSoudureParNumCourant(numCourant);
      if (!soudure || !soudure.date) return null;
    
      const date = new Date(soudure.date);
      const jour = date.getDate().toString().padStart(2, '0');
      const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    
      return `${jour}-${mois}`;
    }
       
      
      getCodeControle(numCourant: number): string | null {
        const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
        return soudure ? soudure.code : null;}
    
        getMatriculeAgentQualite(numCourant: number): number | null {
          const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
          return soudure ? soudure.matriculeAgentQualite : null;}
   
      
      getAnnee(): number | null {
        const soudure = this.soudures[0] ;
        if (!soudure || !soudure.date) return null;
      
        const date = new Date(soudure.date);
        return date.getFullYear();
      }

  
  
     getNumMachine(numCourant: number): string | null {
      const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
      return soudure ? soudure.numeroMachine : null;}
  

      validerSoudure(id: number): void {
        this.serviceSoudure.validerSoudure(id, this.matriculeAgentQualite).subscribe({
          next: () => {
            console.log('Pdek validé avec succès');
            this.souduresValides.add(id);
      
            // mettre à jour matricule dans la liste
            const soudure = this.soudures.find(p => p.id === id);
            if (soudure) {
              soudure.matriculeAgentQualite = this.matriculeAgentQualite; // IMPORTANT : MAJ du matricule
            }
      
            Swal.fire({
              title: 'Confirmation !',
              text: 'Pdek validé avec succès.',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                confirmButton: 'custom-confirm-button'
              }
            }).then(() => {
              console.log('Alert fermé et page mise à jour');
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
          
      
    
     getPilage(numCourant: number): string | null {
      const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
      return soudure ? soudure.pliage : null;}
    
    getDecisionSoudure(numCourant: number): number | null {
      const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
      return soudure ? soudure.decision : null;}
  
      getRempliePlanAction(numCourant: number): number | null {
        const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
        return soudure ? soudure.rempliePlanAction : null;}
     
     getDistanceBC(numCourant: number): string | null {
      const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
      return soudure ? soudure.distanceBC : null;}
   
     getTraction(numCourant: number): string | null {
      const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
      return soudure ? soudure.traction : null;}

     getSectionFil(numCourant: number): string | null {
      const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
      return soudure ? soudure.sectionFil : null;}
   
      getQuantiteAtteinte(numCourant: number): number | null {
        const soudure = this.soudures.find(p => p.numeroCycle === numCourant);
        return soudure ? soudure.quantiteAtteint : null;}
     
   
     chargerEtenduMax(sectionFil: string): void {
       this.serviceSoudure.getEtenduMax(sectionFil).subscribe({
         next: (val: number) => {
           this.etenduMax = val;
           console.log('Étendu Max:', val);
           this.recupererDonneesDeFichierPdekDePageParticulier(); // 👈 appel ici après récupération
         },
         error: (err) => {
           console.error('Erreur lors du chargement de l’étendu max:', err);
         }
       });
     }
     
   
   // Méthodes pour récupérer les valeurs
   chargerMoyenneMin(sectionFil: string): void {
     this.serviceSoudure.getMoyenneMin(sectionFil).subscribe({
       next: (val: number) => {
         this.moyenneMin = val;
         console.log('Moyenne Min:', val);
         this.recupererDonneesDeFichierPdekDePageParticulier(); // 👈 appel ici après récupération

        // this.checkAndUpdateGraph(); // Assurez-vous que tout est chargé avant de mettre à jour
       },
       error: (err) => {
         console.error('Erreur lors du chargement de la moyenne min:', err);
       }
     });
   }
   
   chargerMoyenneMax(sectionFil: string): void {
     this.serviceSoudure.getMoyenneMax(sectionFil).subscribe({
       next: (val: number) => {
         this.moyenneMax = val;
         console.log('Moyenne Max:', val);
         this.recupererDonneesDeFichierPdekDePageParticulier(); // 👈 appel ici après récupération

        // this.checkAndUpdateGraph(); // Assurez-vous que tout est chargé avant de mettre à jour
       },
       error: (err) => {
         console.error('Erreur lors du chargement de la moyenne max:', err);
       }
     });
   }
   
   chargerPelageMin(sectionFil: string): void {
     this.serviceSoudure.getPelageValeur(sectionFil).subscribe({
       next: (val: number) => {
         this.pelageMin = val;
         console.log('Pelage Min', val);
         this.recupererDonneesDeFichierPdekDePageParticulier(); // 👈 appel ici après récupération
       },
       error: (err) => {
         console.error('Erreur lors du chargement du pelage min:', err);
       }
     });
   }

   extraireValeurNumeriqueSectionFil(sectionFil: string): string {
    if (!sectionFil) {
      return "0.00";
    }
    const match = sectionFil.match(/[0-9]+(\.[0-9]+)?/);
    const value = match ? parseFloat(match[0]) : 0;
    return value.toFixed(2); // forcer 2 chiffres après la virgule sous forme de string
  }
  
  
  
  /*naviger(){
    localStorage.removeItem('reponseApi')
    localStorage.removeItem('soudure')
    this.router.navigate(['/dashboard']);
  }*/
    naviger() {
      localStorage.removeItem('reponseApi');
      localStorage.removeItem('soudure');
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    }
    @HostListener('window:beforeprint', [])
onBeforePrint() {
  ApexCharts.exec('chartMoyenne', 'updateOptions', {
    chart: { width: 800, height: 200 }
  });

  ApexCharts.exec('chartEtendue', 'updateOptions', {
    chart: { width: 800, height: 200 }
  });
}
imprimerPDEK() {
const printContents = document.querySelector('.pdf-container')?.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents || '';
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); // Recharge la page pour retrouver l’état initia
}


 }