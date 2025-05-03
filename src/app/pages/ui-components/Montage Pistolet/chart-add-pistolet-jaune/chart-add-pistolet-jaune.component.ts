import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels,
  ApexYAxis, ApexTitleSubtitle, ApexStroke, ApexTooltip, ApexMarkers, ApexFill, ApexAnnotations, ApexLegend,
  NgApexchartsModule
} from 'ng-apexcharts';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { Observable, of } from 'rxjs';
import { GeneralService } from 'src/app/services/Géneral/general.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-add-pistolet-jaune',
  standalone: true,
  imports: [
    ChartModule,
    MatCardModule,
    MatFormFieldModule ,
    MatButtonModule ,
    CommonModule ,
     NgApexchartsModule],
  providers: [],
  templateUrl: './chart-add-pistolet-jaune.component.html',
  styleUrls: ['./chart-add-pistolet-jaune.component.scss']
})
export class ChartAddPistoletJauneComponent  implements OnInit {

   constructor(private pistoletGeneralService: PistoletGeneralService , private router: Router,
               private route: ActivatedRoute , private general :  GeneralService){}
  
  
  seriesDataEtendue: { x: string, y: number }[] = [];
  seriesDataMoyenne: { x: string, y: number }[] = [];
  donneesMoyenne: any[] = []; 
  donneesEtendu: any[] = []; 
  valide: boolean = false;
  idPistolet : number ; 
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
   matriculeAgentQualite : number ; 
   ngOnInit(): void {
   
    this.pistolet = JSON.parse(localStorage.getItem("pistolet") !)  ;   
    this.reponseApi = JSON.parse(localStorage.getItem("reponseApi") !)  ;       
    this.numeroPistolet =  this.pistolet.numeroPistolet ; 
    this.typePistolet = this.pistolet.type ;
    this.categorie =  this.pistolet.categorie ; 
    this.idPdek = this.reponseApi.pdekId ; 
    this.numPage = this.reponseApi.pageNumber ; 

    this.plantUser = localStorage.getItem('plant') !;
    this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    console.log('Numéro de pistolet:',  this.numeroPistolet);
    console.log('Type de pistolet:',  this.typePistolet);
    console.log('id de pdek :',  this.idPdek);
    console.log('numero de page de pdek :',  this.numPage);
    this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;

    this.recupererPistoletByNumeroEtEtat();
    this.pistoletGeneralService.recupererListePistoletsNonValidesAgentQualite() ;
    this.recuepererDernierNumeroDeCycle() ; 
    this.recupererDonneesDeFichierPdekDePageParticulier().subscribe();

}
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
      type: 'category',
      categories: Array.from({ length: 26 }, (_, i) => (i + 1).toString()), 
      tickAmount: 26,
      labels: {
        show: true,
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
        text: 'Numéro Courant',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333'
        }
      }
    },
    yaxis: {
      min: 30,
      max: 50,
      tickAmount: 20,
      labels: {
        show: false
      } ,
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
        { y: 34, y2: 35, fillColor: '#ffff0064', opacity: 0.5 },
        { y: 35, y2: 45, fillColor: '#00c80087', opacity: 0.4 },
        { y: 45, y2: 46, fillColor: '#ffff0064', opacity: 0.5 },
        { y: 30, y2: 34, fillColor: '#ff00006e', opacity: 0.4 },
        { y: 46, y2: 50, fillColor: '#ff00006e', opacity: 0.4 },
  
        // ➕ Lignes supplémentaires
        {
          y: 46,
          borderColor: 'red',
          strokeDashArray: 0,
          label: {
            text: '46',
            position: 'left',
            style: { color: '#fff', background: 'red' }
          }
        },
        {
          y: 45,
          borderColor: 'yellow',
          strokeDashArray: 0,
          label: {
            text: '45',
            position: 'left',
            style: {
              color: '#000',
              background: 'yellow'
            }
          }
        },
        {
          y: 40,
          borderColor: 'gray',
          strokeDashArray: 0,
          label: {
            text: '40',
            position: 'left',
            style: {
              color: '#fff',
              background: 'gray'
            }
          }
        },
        {
          y: 35,
          borderColor: 'yellow',
          strokeDashArray: 0,
          label: {
            text: '35',
            position: 'left',
            style: {
              color: '#000',
              background: 'yellow'
            }
          }
        },
        {
          y: 34,
          borderColor: 'red',
          strokeDashArray: 0,
          label: {
           text: '34',
           position : 'left' ,
            style: {
              color: '#fff',
              background: 'red'
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
        height: 300,
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
      } ,
      xaxis: {
        type: 'category',
        categories: Array.from({ length: 26 }, (_, i) => (i + 1).toString()), // ["1", "2", ..., "26"]
        tickAmount: 26,
        labels: {
          show: true,
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
          text: 'Numéro Courant',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }
        }
      },
      yaxis: {
        min: 0,
        max: 10,
        tickAmount: 10,
        labels: {
          show: false,
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
            y: 3,
            borderColor: 'red',
            strokeDashArray: 0,
            label: {
              position: 'right',
              text: 'Max : 3',
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
        }) ,
        catchError(error => {
          console.error('Erreur lors de la récupération des pistolets', error);
          return of([]);
        })
      );
    }
validerPdekPistolet(): void {
  this.pistoletGeneralService.getPistoletInformations(this.numeroPistolet , this.typePistolet , this.categorie).subscribe({
    next: (data) => {
      this.pistolet = data;
      this.idPistolet = data.id;
      console.log('id de pistolet validé :', this.idPistolet);
      this.pistoletGeneralService.validerPistolet(this.idPistolet, this.matriculeAgentQualite).subscribe({
        next: () => {
          this.pistoletGeneralService.recupererListePistoletsNonValidesAgentQualite() ;
          this.pistoletGeneralService.getNombreNotifications();
          this.general.nbrNotifications--;

          this.valide = true; // ✅ le bouton est maintenant validé

          console.log('Pistolet validé avec succès.');

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
          console.error('Erreur lors de la validation du pistolet :', err);

          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la validation du pistolet.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    },
    error: (err) => {
      console.error('Erreur lors de la récupération du pistolet :', err);
    }
  });
}

recupererPistoletByNumeroEtEtat(): void {
  this.pistoletGeneralService.getPistoletInformations(this.numeroPistolet, this.typePistolet, this.categorie).subscribe({
    next: (data) => {
      console.log('Pistolet récupéré :', data);
      this.pistolet = data;

      const etat = this.recupererEtatPistolet(this.pistolet);
      console.log('État du pistolet :', etat);

      if (etat === 'vert') {
        this.general.nbrNotifications++;

        // Appel ici, après avoir détecté l'état vert
        this.pistoletGeneralService.recupererListePistoletsNonValidesAgentQualite();

        console.log('Notification ajoutée. Total :', this.general.nbrNotifications);
      }
    },
    error: (err) => {
      console.error('Erreur lors de la récupération du pistolet :', err);
    }
  });
}


recupererEtatPistolet(p: Pistolet): string {
  const etat = this.pistoletGeneralService.etatPistolet(p.etendu, p.moyenne, p.type);
  p.activationValider = etat === "vert";
  return etat;
}


naviger(){
  this.router.navigate(['/pdekPistoletJaune']);
}
}