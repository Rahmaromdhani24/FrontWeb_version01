import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  selector: 'app-pdek-pistolet-vert',
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
  templateUrl: './pdek-pistolet-vert.component.html',
  styleUrl: './pdek-pistolet-vert.component.scss'
})
export class PdekPistoletVertComponent implements OnInit ,AfterViewInit  {

   constructor(private pistoletGeneralService: PistoletGeneralService  , private router : Router ){}
   matriculeAgentQualite : number ;
   seriesDataEtendue: { x: string, y: number }[] = [];
   seriesDataMoyenne: { x: string, y: number }[] = [];
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
    this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;
   
    this.recupererDonneesDeFichierPdekDePageParticulier().subscribe(); // Ajoutez un délai pour tester
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
      data: []
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
      type: 'category',
      categories: Array.from({ length: 26 }, (_, i) => (i + 1).toString()), // ["1", "2", ..., "26"]
      tickAmount: 26,
      labels: {
        show: false,
        style: {
          colors: '#333',
          fontSize: '12px',
          fontFamily: 'Arial'
        }
      },
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
        color: '#333'
      },
      title: {
       // text: 'Numéro Courant',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333'
        }
      }
    },
    yaxis: {
      min: 70,     // Plage minimum
      max: 130,    // Plage maximum
      tickAmount: 6,  // Nombre d'intervalles souhaité (ajuste selon tes besoins)
      labels: {
        show: false,
        formatter: (val: number) => {
          // Ajoute tes valeurs spécifiques ici
          const valuesToShow = [80, 88, 100, 112, 120];
          return valuesToShow.includes(Math.round(val)) ? `${val}` : '';
        }
      },
      forceNiceScale: true // Permet d'optimiser les ticks
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
      x: {
        formatter: (val: number) => `Numéro Courant: ${val}`
      },
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
        // 🌈 Bandes colorées
        { y: 80, y2: 88, fillColor: '#ffff0064', opacity: 0.5 },
        { y: 88, y2: 112, fillColor: '#00c80087', opacity: 0.4 },
        { y: 112, y2: 120, fillColor: '#ffff0064', opacity: 0.5 },
        { y: 70, y2: 80, fillColor: '#ff00006e', opacity: 0.4 },
        { y: 120, y2: 130, fillColor: '#ff00006e', opacity: 0.4 },
  
        // ➕ Lignes (SEULEMENT)
        {
          y: 80,
          borderColor: 'red',
           strokeDashArray: 0,
           label: {
             text: '80',
             position: 'left',
             style: { color: '#fff', background: 'red' }
           }
        },
        {
          y: 88,
          borderColor: 'yellow',
          strokeDashArray: 0,
          label: {
            text: '88',
            position: 'left',
            style: { color: '#000', background: 'yellow' }
          }
        },
        {
          y: 100,
          borderColor: 'gray',
          strokeDashArray: 0
        },
        {
          y: 112,
          borderColor: 'yellow',
          strokeDashArray: 0,
          label: {
            text: '112',
            position: 'left',
            style: { color: '#000', background: 'yellow' }
          }
        } ,
        {
          y: 120,
          borderColor: 'red',
          strokeDashArray: 0,
          label: {
            text: '120',
            position: 'left',
            style: { color: '#fff', background: 'red' }
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
        type: 'category',
        categories: Array.from({ length: 26 }, (_, i) => (i + 1).toString()), // ["1", "2", ..., "26"]
        tickAmount: 26,
        labels: {
          show: false,
          style: {
            colors: '#333',
            fontSize: '12px',
            fontFamily: 'Arial'
          }
        },
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: '#333'
        },
        title: {
         // text: 'Numéro Courant',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }
        }
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
       } ,    
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
             y: 12,
             borderColor: 'red',
                strokeDashArray: 0,
                label: {
                  position: 'right',
                  text: 'Max : 12',
                  style: { color: '#fff', background: 'red' }
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
          x: p.numCourant.toString(), // 👈 Important ! doit correspondre à category type string
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

        this.chartOptionsMoyenne.series = [{
          name: 'Moyenne',
          data: dataRemplie ,
        }];
                // Met à jour le graphique sans animation
   

        this.seriesDataEtendue = data.map(p => ({
          x: p.numCourant.toString(),
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

        this.chartOptionsEtendue.series = [{
          name: 'Etendu',
          data: dataRemplie2 ,
        }];

   
        if (data.length > 0) {
          this.numeroCourant = data[data.length - 1].numCourant;
        }
      
        console.log('Séries Moyenne :', this.seriesDataMoyenne);
        console.log('Séries Etendu :', this.seriesDataEtendue);
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
   
  getCoupePropre(numCourant: number): string | null {
    const pistolet = this.pistolets.find(p => p.numCourant === numCourant);
    return pistolet ? pistolet.coupePropre : null;}

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
  onValiderPistoletVert(id: number) {
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


  naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/dashboard']);
  }
 }