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
import { SertissageIDC } from 'src/app/Modeles/SertissageIDC';
import { SertissageIDCService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-idc.service';
@Component({
  selector: 'app-pdek-sertissage-idcsimple',
 imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
   templateUrl: './pdek-sertissage-idcsimple.component.html',
  styleUrl: './pdek-sertissage-idcsimple.component.scss'
})
export class PdekSertissageIDCSimpleComponent  implements OnInit {
  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService , private service: SertissageIDCService  , 
              private router : Router  , private route: ActivatedRoute  ){}

  seriesDataHauteurCote1:  { x: number, y1: number , y2:number, y3:number,  y4:number   }[] = [];
  seriesDataHauteurCote2:  { x: number, y1: number , y2:number, y3:number,  y4:number   }[] = [];
  seriesDataTractionCote1: { x: number, y1: number , y2:number, y3:number,  y4:number   }[] = [];
  seriesDataTractionCote2: { x: number, y1: number , y2:number, y3:number,  y4:number   }[] = [];
   rows = Array.from({ length: 25 }, (_, i) => i + 1);
   showLoader : boolean = true; 
   eight: number[] = Array.from({ length: 8 }, (_, i) => i + 1);
   numCourants : any  =  [1 ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
   anneePDEK : number = 0 ;
   numeroCourant : number ; 
   plantUser : string ; 
   segmentUser : number  ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   sertissages: SertissageIDC[] = [] ; 
   sertissagesParPage: Map<number, SertissageIDC[]> = new Map();
   four = [0, 1, 2, 3];
   numPage : number ;
   reponseApi : any ; 
   machine : string =''
   annee  : string =''
   role : string =''
   sectionFil: string =''
   idPdek: number 
   ngOnInit(): void {
    this.pdekId = +this.route.snapshot.paramMap.get('id')!;

    const pdekSertissageJson = localStorage.getItem('pdekSertissageIDC');
    if (pdekSertissageJson) {
    const pdekSertissage = JSON.parse(pdekSertissageJson);
    this.sectionFil = pdekSertissage.sectionFil;
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
    this.machine = pdekSertissage.numeroMachine
    const date = new Date(pdekSertissage.date);
    this.annee=  date.getFullYear()+"";
    } 

    const pdekSertissageJson1 = localStorage.getItem('torsadage');
    if (pdekSertissageJson1) {
    const pdekSertissage = JSON.parse(pdekSertissageJson1);
    this.sectionFil = pdekSertissage.sectionFil;
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
    this.machine = pdekSertissage.numeroMachine
    const date = new Date(pdekSertissage.date);
    this.annee=  date.getFullYear()+"";
    } 
    this.recupererDonneesDeFichierPdekDePageParticulier().subscribe();

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
public chartCote1Hauteur: {
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
    name: 'Coté 1',
    data: []
  }],
  chart: {
    type: 'line',
    height: 200,
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: false }
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
    min: 10.80,
    max: 11.05,
    labels: {
      show: false,
      formatter: (val: number) => {
        const formatted = Number(val.toFixed(2));
        return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
      },
      style: {
        fontSize: '12px',
        colors: '#000'
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
      formatter: (val: number) => `${val.toFixed(2)}`
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
      { y: 10.80, y2: 10.85, fillColor: '#ff00006e', opacity: 0.4 },
      { y: 10.85, y2: 10.88, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 10.88, y2: 10.97, fillColor: '#00c80087', opacity: 0.4 },
      { y: 10.97, y2: 11.00, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 11.00, y2: 11.05, fillColor: '#ff00006e', opacity: 0.4 },
      {
        y: 10.85,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '10.85',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 10.88,
        borderColor: 'gray',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '10.88',
          style: { color: '#fff', background: 'gray' }
        }
      },
      {
        y: 10.97,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '10.97',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 11.00,
        borderColor: 'red',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '11.00',
          style: { color: '#fff', background: 'red' }
        }
      }
    ]
  }
};

getChartCote1Hauteur(data: { x: number; y1: number; y2: number; y3: number ; y4: number }[]) {
  const moyenneData = data.map(p => ({
    x: p.x,
    y: ((p.y1 ?? 0) + (p.y2 ?? 0) + (p.y3 ?? 0)+ (p.y4 ?? 0)) / [p.y1, p.y2, p.y3 , p.y4].filter(v => v !== null && v !== undefined).length
  }));

  return {
    ...this.chartCote1Hauteur,
    series: [{
      name: 'Coté 1',
      data: moyenneData
    }]
  };
}
/************************* traction c1 ************************************/
public chartCote1Traction: {
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
    name: 'Coté 2',
    data: []
  }],
  chart: {
    type: 'line',
    height: 200,
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: false }
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
    min: 40,
    max: 110,
    labels: {
      show: false,
      formatter: (val: number) => {
        const formatted = Number(val.toFixed(2));
        return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
      },
      style: {
        fontSize: '12px',
        colors: '#000'
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
      formatter: (val: number) => `${val.toFixed(2)}`
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
      { y: 40, y2: 50, fillColor: '#ff00006e', opacity: 0.4 },
      { y: 50, y2: 60, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 60 ,y2:110, fillColor: '#00c80087', opacity: 0.4 },
    
      {
        y: 50,
        borderColor: 'red',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '50',
          style: { color: '#000', background: 'red' }
        }
      },
      {
        y: 60,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '60',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 110,
        borderColor: 'green',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '110',
          style: { color: '#fff', background: 'green' }
        }
      }
    ]
  }
};

getChartCote1Traction(data: { x: number; y1: number; y2: number; y3: number ; y4: number }[]) {
  const moyenneData = data.map(p => ({
    x: p.x,
    y: ((p.y1 ?? 0) + (p.y2 ?? 0) + (p.y3 ?? 0)+ (p.y4 ?? 0)) / [p.y1, p.y2, p.y3 , p.y4].filter(v => v !== null && v !== undefined).length
  }));

  return {
    ...this.chartCote1Traction,
    series: [{
      name: 'Coté 1',
      data: moyenneData
    }]
  };
}
/******************************* Cote 2 ************************************/
public chartCote2Hauteur: {
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
    name: 'Coté 2',
    data: []
  }],
  chart: {
    type: 'line',
    height: 200,
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: false }
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
    min: 10.80,
    max: 11.05,
    labels: {
      show: false,
      formatter: (val: number) => {
        const formatted = Number(val.toFixed(2));
        return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
      },
      style: {
        fontSize: '12px',
        colors: '#000'
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
      formatter: (val: number) => `${val.toFixed(2)}`
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
      { y: 10.80, y2: 10.85, fillColor: '#ff00006e', opacity: 0.4 },
      { y: 10.85, y2: 10.88, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 10.88, y2: 10.97, fillColor: '#00c80087', opacity: 0.4 },
      { y: 10.97, y2: 11.00, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 11.00, y2: 11.05, fillColor: '#ff00006e', opacity: 0.4 },
      {
        y: 10.85,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '10.85',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 10.88,
        borderColor: 'gray',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '10.88',
          style: { color: '#fff', background: 'gray' }
        }
      },
      {
        y: 10.97,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '10.97',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 11.00,
        borderColor: 'red',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '11.00',
          style: { color: '#fff', background: 'red' }
        }
      }
    ]
  }
};

getChartCote2Hauteur(data: { x: number; y1: number; y2: number; y3: number ; y4: number}[]) {
  const moyenneData = data.map(p => ({
    x: p.x,
    y: ((p.y1 ?? 0) + (p.y2 ?? 0) + (p.y3 ?? 0)+ (p.y4 ?? 0)) / [p.y1, p.y2, p.y3].filter(v => v !== null && v !== undefined).length
  }));

  return {
    ...this.chartCote2Hauteur,
    series: [{
      name: 'Coté 2',
      data: moyenneData
    }]
  };
}

/************************* Cote c2 traction*******************************/
public chartCote2Traction: {
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
    name: 'Coté 2',
    data: []
  }],
  chart: {
    type: 'line',
    height: 200,
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: false }
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
    min: 40,
    max: 110,
    labels: {
      show: false,
      formatter: (val: number) => {
        const formatted = Number(val.toFixed(2));
        return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
      },
      style: {
        fontSize: '12px',
        colors: '#000'
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
      formatter: (val: number) => `${val.toFixed(2)}`
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
      { y: 40, y2: 50, fillColor: '#ff00006e', opacity: 0.4 },
      { y: 50, y2: 60, fillColor: '#ffff0064', opacity: 0.5 },
      { y: 60 ,y2:110, fillColor: '#00c80087', opacity: 0.4 },
    
      {
        y: 50,
        borderColor: 'red',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '50',
          style: { color: '#000', background: 'red' }
        }
      },
      {
        y: 60,
        borderColor: 'yellow',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '60',
          style: { color: '#000', background: 'yellow' }
        }
      },
      {
        y: 110,
        borderColor: 'green',
        strokeDashArray: 0,
        label: {
          position: 'left',
          text: '110',
          style: { color: '#fff', background: 'green' }
        }
      }
    ]
  }
};

getChartCote2Traction(data: { x: number; y1: number; y2: number; y3: number ; y4: number}[]) {
  const moyenneData = data.map(p => ({
    x: p.x,
    y: ((p.y1 ?? 0) + (p.y2 ?? 0) + (p.y3 ?? 0)+ (p.y4 ?? 0)) / [p.y1, p.y2, p.y3].filter(v => v !== null && v !== undefined).length
  }));

  return {
    ...this.chartCote2Traction,
    series: [{
      name: 'Coté 2',
      data: moyenneData
    }]
  };
}

 /*********************** Chart d'Étendue R *******************************/


getValeurC1(numCourant: number, row: number): number | null {
  const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
  if (!sertissage) return null;

  const echs = [
    sertissage.hauteurSertissageC1Ech1,
    sertissage.hauteurSertissageC1Ech2,
    sertissage.hauteurSertissageC1Ech3,
    sertissage.hauteurSertissageC1EchFin
  ];

  return echs[row] ?? null;
}


getValeurC2(numCourant: number, row: number): number | null {
  const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
  if (!sertissage) return null;

  const echs = [
    sertissage.hauteurSertissageC2Ech1,
    sertissage.hauteurSertissageC2Ech2,
    sertissage.hauteurSertissageC2Ech3,
    sertissage.hauteurSertissageC2EchFin
  ];

  return echs[row] ?? null;
}

    
    getTractionC1(numCourant: number, row: number): number | null {
      const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
      if (!sertissage) return null;
      const echs = [sertissage.forceTractionC1Ech1,
                   sertissage.forceTractionC1Ech2,
                   sertissage.forceTractionC1Ech3, 
                   sertissage.forceTractionC1EchFin];
      return echs[row] ?? null;
    }
    

    getTractionC2(numCourant: number, row: number): number | null {
      const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
      if (!sertissage) return null;
      const echs = [sertissage.forceTractionC2Ech1,
                   sertissage.forceTractionC2Ech2,
                   sertissage.forceTractionC2Ech3, 
                   sertissage.forceTractionC2EchFin];
      return echs[row] ?? null;
    }
    
    
    
    getNom(numCourant: number): number | null {
      const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
      return sertissage ? sertissage.userSertissageIDC : null;
    }
    
  
    getDate(numCourant: number): string | null {
      const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
      return sertissage ? sertissage.date : null;
    }   
    getDecision(numCourant: number): number | null {
      const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
      return sertissage ? sertissage.decision : null;}
  
      getRempliePlanAction(numCourant: number): number | null {
        const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
        return sertissage ? sertissage.rempliePlanAction : null;}

  getCodeControle(numCourant: number): string | null {
      const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
      return sertissage ? sertissage.code : null; }
      
 /* getMatriculeAgentQualite(numCourant: number): string | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.matriculeAgentQualite : null;; }
   
  }*/
  
  getAnnee(numCourant: number): number | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    if (!sertissage || !sertissage.date) return null;
  
    const date = new Date(sertissage.date);
    return date.getFullYear();
  }

  
  onValiderSertissage(id: number) {
     this.service.validerSertissageIDC(id, this.matriculeAgentQualite).subscribe({
                     next: () => {
                       console.log('Pdek Sertissage  validé avec succès');
                       this.pistoletsValides.add(id); // Marquer ce pistolet comme validé
                 
                       Swal.fire({
                         title: 'Confirmation !',
                         text: 'Pdek Sertissage validé avec succès.',
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

  getCode(numCourant: number): string | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.code : null;
  }
 
  getProduit(numCourant: number): string | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.produit : null;
  }
  getSerieProduit(numCourant: number): string | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.serieProduit : null;
  }
  getQuantiteCycle(numCourant: number): number | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.quantiteCycle : null;
  }
  getNumMachine(numCourant: number): string | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.numeroMachine : null;
  }
  getOperateur(numCourant: number): number | null {
    const sertissage = this.sertissages.find(p => p.numCycle === numCourant);
    return sertissage ? sertissage.userSertissageIDC : null;
  }
recupererDonneesDeFichierPdekDePageParticulier(): Observable<SertissageIDC[]> {
  return this.service.getSertissagesParPdekEtPage(this.idPdek, this.numPage).pipe(
    tap((data: SertissageIDC[]) => {
      this.sertissages = data;

      this.seriesDataHauteurCote1 = data.map(p => ({
        x: p.numCycle,
        y1: p.hauteurSertissageC1Ech1,
        y2: p.hauteurSertissageC1Ech2,
        y3: p.hauteurSertissageC1Ech3,
        y4: p.hauteurSertissageC1EchFin,
      }));

      this.seriesDataHauteurCote2 = data.map(p => ({
        x: p.numCycle,
        y1: p.hauteurSertissageC2Ech1,
        y2: p.hauteurSertissageC2Ech2,
        y3: p.hauteurSertissageC2Ech3,
        y4: p.hauteurSertissageC2EchFin,
      }));

      this.seriesDataTractionCote1 = data.map(p => ({
        x: p.numCycle,
        y1: p.forceTractionC1Ech1,
        y2: p.forceTractionC1Ech2,
        y3: p.forceTractionC1Ech3,
        y4: p.forceTractionC1EchFin,
      }));

      this.seriesDataTractionCote2 = data.map(p => ({
        x: p.numCycle,
        y1: p.forceTractionC1Ech1,
        y2: p.forceTractionC2Ech2,
        y3: p.forceTractionC2Ech3,
        y4: p.forceTractionC2EchFin,
      }));
      if (data.length > 0) {
        this.numeroCourant = data[data.length - 1].numCycle;
      }
    // **On ré-affecte** l’objet complet d’options du chart
    this.chartCote1Hauteur = {
      series: [
        {
          name: 'Ech1',
          data: this.seriesDataHauteurCote1.map(p => ({ x: p.x, y: p.y1 }))
        },
        {
          name: 'Ech2',
          data: this.seriesDataHauteurCote1.map(p => ({ x: p.x, y: p.y2 }))
        },
        {
          name: 'Ech3',
          data: this.seriesDataHauteurCote1.map(p => ({ x: p.x, y: p.y3 }))
        },
        {
          name: 'Fin',
          data: this.seriesDataHauteurCote1.map(p => ({ x: p.x, y: p.y4 }))
        }
      ],
      chart: {
        type: 'line',
        height: 200,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: false }
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
        min: 10.80,
        max: 11.05,
        labels: {
          show: false,
          formatter: (val: number) => {
            const formatted = Number(val.toFixed(2));
            return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
          },
          style: {
            fontSize: '12px',
            colors: '#000'
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
          formatter: (val: number) => `${val.toFixed(2)}`
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
          { y: 10.80, y2: 10.85, fillColor: '#ff00006e', opacity: 0.4 },
          { y: 10.85, y2: 10.88, fillColor: '#ffff0064', opacity: 0.5 },
          { y: 10.88, y2: 10.97, fillColor: '#00c80087', opacity: 0.4 },
          { y: 10.97, y2: 11.00, fillColor: '#ffff0064', opacity: 0.5 },
          { y: 11.00, y2: 11.05, fillColor: '#ff00006e', opacity: 0.4 },
          {
            y: 10.85,
            borderColor: 'yellow',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '10.85',
              style: { color: '#000', background: 'yellow' }
            }
          },
          {
            y: 10.88,
            borderColor: 'gray',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '10.88',
              style: { color: '#fff', background: 'gray' }
            }
          },
          {
            y: 10.97,
            borderColor: 'yellow',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '10.97',
              style: { color: '#000', background: 'yellow' }
            }
          },
          {
            y: 11.00,
            borderColor: 'red',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '11.00',
              style: { color: '#fff', background: 'red' }
            }
          }
        ]
      }
    };
    /******************************************************************************************/
    this.chartCote1Traction = {
      series: [
        {
          name: 'Ech1',
          data: this.seriesDataTractionCote1.map(p => ({ x: p.x, y: p.y1 }))
        },
        {
          name: 'Ech2',
          data: this.seriesDataTractionCote1.map(p => ({ x: p.x, y: p.y2 }))
        },
        {
          name: 'Ech3',
          data: this.seriesDataTractionCote1.map(p => ({ x: p.x, y: p.y3 }))
        },
        {
          name: 'Fin',
          data: this.seriesDataTractionCote1.map(p => ({ x: p.x, y: p.y4 }))
        }
      ],
      chart: {
        type: 'line',
        height: 200,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: false }
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
        min: 40,
        max: 110,
        labels: {
          show: false,
          formatter: (val: number) => {
            const formatted = Number(val.toFixed(2));
            return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
          },
          style: {
            fontSize: '12px',
            colors: '#000'
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
          formatter: (val: number) => `${val.toFixed(2)}`
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
          { y: 40, y2: 50, fillColor: '#ff00006e', opacity: 0.4 },
          { y: 50, y2: 60, fillColor: '#ffff0064', opacity: 0.5 },
          { y: 60 ,y2:110, fillColor: '#00c80087', opacity: 0.4 },
        
          {
            y: 50,
            borderColor: 'red',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '50',
              style: { color: '#000', background: 'red' }
            }
          },
          {
            y: 60,
            borderColor: 'yellow',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '60',
              style: { color: '#000', background: 'yellow' }
            }
          },
          {
            y: 110,
            borderColor: 'green',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '110',
              style: { color: '#fff', background: 'green' }
            }
          }
        ]
      }
    };
    /*****************************************************************************************/
    this.chartCote2Hauteur = {
      series: [
        {
          name: 'Ech1',
          data: this.seriesDataHauteurCote2.map(p => ({ x: p.x, y: p.y1 }))
        },
        {
          name: 'Ech2',
          data: this.seriesDataHauteurCote2.map(p => ({ x: p.x, y: p.y2 }))
        },
        {
          name: 'Ech3',
          data: this.seriesDataHauteurCote2.map(p => ({ x: p.x, y: p.y3 }))
        },
        {
          name: 'Fin',
          data: this.seriesDataHauteurCote2.map(p => ({ x: p.x, y: p.y4 }))
        }
      ],
      chart: {
        type: 'line',
        height: 200,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: false }
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
        min: 40,
        max: 110,
        labels: {
          show: false,
          formatter: (val: number) => {
            const formatted = Number(val.toFixed(2));
            return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
          },
          style: {
            fontSize: '12px',
            colors: '#000'
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
          formatter: (val: number) => `${val.toFixed(2)}`
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
          { y: 40, y2: 50, fillColor: '#ff00006e', opacity: 0.4 },
          { y: 50, y2: 60, fillColor: '#ffff0064', opacity: 0.5 },
          { y: 60 ,y2:110, fillColor: '#00c80087', opacity: 0.4 },
        
          {
            y: 50,
            borderColor: 'red',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '50',
              style: { color: '#000', background: 'red' }
            }
          },
          {
            y: 60,
            borderColor: 'yellow',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '60',
              style: { color: '#000', background: 'yellow' }
            }
          },
          {
            y: 110,
            borderColor: 'green',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '110',
              style: { color: '#fff', background: 'green' }
            }
          }
        ]
      }
    };
    /******************************************************************************************/
    this.chartCote2Traction = {
      series: [
        {
          name: 'Ech1',
          data: this.seriesDataTractionCote2.map(p => ({ x: p.x, y: p.y1 }))
        },
        {
          name: 'Ech2',
          data: this.seriesDataTractionCote2.map(p => ({ x: p.x, y: p.y2 }))
        },
        {
          name: 'Ech3',
          data: this.seriesDataTractionCote2.map(p => ({ x: p.x, y: p.y3 }))
        },
        {
          name: 'Fin',
          data: this.seriesDataTractionCote2.map(p => ({ x: p.x, y: p.y4 }))
        }
      ],
      chart: {
        type: 'line',
        height: 200,
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: false }
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
        min: 10.80,
        max: 11.05,
        labels: {
          show: false,
          formatter: (val: number) => {
            const formatted = Number(val.toFixed(2));
            return [10.85, 10.88, 10.97, 11.00].includes(formatted) ? formatted.toFixed(2) : '';
          },
          style: {
            fontSize: '12px',
            colors: '#000'
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
          formatter: (val: number) => `${val.toFixed(2)}`
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
          { y: 10.80, y2: 10.85, fillColor: '#ff00006e', opacity: 0.4 },
          { y: 10.85, y2: 10.88, fillColor: '#ffff0064', opacity: 0.5 },
          { y: 10.88, y2: 10.97, fillColor: '#00c80087', opacity: 0.4 },
          { y: 10.97, y2: 11.00, fillColor: '#ffff0064', opacity: 0.5 },
          { y: 11.00, y2: 11.05, fillColor: '#ff00006e', opacity: 0.4 },
          {
            y: 10.85,
            borderColor: 'yellow',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '10.85',
              style: { color: '#000', background: 'yellow' }
            }
          },
          {
            y: 10.88,
            borderColor: 'gray',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '10.88',
              style: { color: '#fff', background: 'gray' }
            }
          },
          {
            y: 10.97,
            borderColor: 'yellow',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '10.97',
              style: { color: '#000', background: 'yellow' }
            }
          },
          {
            y: 11.00,
            borderColor: 'red',
            strokeDashArray: 0,
            label: {
              position: 'left',
              text: '11.00',
              style: { color: '#fff', background: 'red' }
            }
          }
        ]
      }
    };
    /*****************************************************************************************/
    }),
    catchError(error => {
      console.error('Erreur lors de la récupération des soudures', error);
      return of([]);
    })
  );
}

   naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/ui-components/listePdekTousProcess']);
  }  

}
