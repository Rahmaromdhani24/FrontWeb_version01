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
  selector: 'app-pdek-sertissage-idc',
 imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
  templateUrl: './pdek-sertissage-idc.component.html',
  styleUrl: './pdek-sertissage-idc.component.scss'
})
export class PdekSertissageIDCComponent  implements OnInit {
  pages: {
    pageNum: number;
    sertissages: SertissageIDC[]; // sans 's'
    chartCote1Hauteur : any;
    chartCote2Hauteur : any;
    chartCote1Traction : any;
    chartCote2Traction : any;
  }[] = [];
  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService , private service: SertissageIDCService  , 
              private router : Router  , private route: ActivatedRoute  ){}
  
   rows = Array.from({ length: 25 }, (_, i) => i + 1);
   showLoader : boolean = true; 
   eight: number[] = Array.from({ length: 8 }, (_, i) => i + 1);
   numCourants : any  =  [1 ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
   anneePDEK : number = 0 ;
   numeroCourant : number ; 
   plantUser : string ; 
   segmentUser : string  ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   sertissages: SertissageIDC[] = [] ; 
   sertissagesParPage: Map<number, SertissageIDC[]> = new Map();
   four = [0, 1, 2, 3];
   role : string =''

   ngOnInit(): void {
    this.role= localStorage.getItem('role') || '';
    this.pdekId = +this.route.snapshot.paramMap.get('id')!;
    this.chargerToutesLesPages();
    const pdekSertissageIDCJson = localStorage.getItem('pdekSertissageIDC') || '{}';
     const pdekSertissageIDC = JSON.parse(pdekSertissageIDCJson);
    this.plantUser = localStorage.getItem('plant')!;
    this.segmentUser = pdekSertissageIDC.segment;
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
    max: 32,
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

getChartCote1Hauteur(data: { x: number; y1: number; y2: number; y3: number; y4: number }[]) {
  // Générer toutes les combinaisons x-échantillon de 1-1 à 8-4
  const allCategories: string[] = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      allCategories.push(`${i}-${j}`);
    }
  }

  // Créer un map des données disponibles
  const dataMap = new Map<string, number>();
  data.forEach(p => {
    if (p.y1 != null) dataMap.set(`${p.x}-1`, p.y1);
    if (p.y2 != null) dataMap.set(`${p.x}-2`, p.y2);
    if (p.y3 != null) dataMap.set(`${p.x}-3`, p.y3);
    if (p.y4 != null) dataMap.set(`${p.x}-4`, p.y4);
  });

  // Remplir la série en respectant les 32 points (valeur ou null)
  const flatData = allCategories.map(cat => ({
    x: cat,
    y: dataMap.has(cat) ? dataMap.get(cat)! : null
  }));

  return {
    ...this.chartCote1Hauteur,
    series: [{
      name: 'Coté 1',
      data: flatData
    }],
    xaxis: {
      type: 'category',
      categories: allCategories,
      labels: {
        rotate: -45,
        style: { fontSize: '10px' }
      },
     /* title: {
        text: 'Cycle - Échantillon'
      }*/
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: (val: string) => {
          const [cycle, ech] = val.split('-');
          return `Cycle: ${cycle} - Échantillon: ${ech}`;
        }
      },
      y: {
        formatter: (val: number | null) =>
          val != null ? `${val.toFixed(2)} mm` : 'Pas de donnée'
      }
    }
  };
}

getChartCote2Hauteur(data: { x: number; y1: number; y2: number; y3: number; y4: number }[]) {
  // Générer toutes les combinaisons x-échantillon de 1-1 à 8-4
  const allCategories: string[] = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      allCategories.push(`${i}-${j}`);
    }
  }

  // Créer un map des données disponibles
  const dataMap = new Map<string, number>();
  data.forEach(p => {
    if (p.y1 != null) dataMap.set(`${p.x}-1`, p.y1);
    if (p.y2 != null) dataMap.set(`${p.x}-2`, p.y2);
    if (p.y3 != null) dataMap.set(`${p.x}-3`, p.y3);
    if (p.y4 != null) dataMap.set(`${p.x}-4`, p.y4);
  });

  // Remplir la série en respectant les 32 points (valeur ou null)
  const flatData = allCategories.map(cat => ({
    x: cat,
    y: dataMap.has(cat) ? dataMap.get(cat)! : null
  }));

  return {
    ...this.chartCote1Hauteur,
    series: [{
      name: 'Coté 1',
      data: flatData
    }],
    xaxis: {
      type: 'category',
      categories: allCategories,
      labels: {
        rotate: -45,
        style: { fontSize: '10px' }
      },
     /* title: {
        text: 'Cycle - Échantillon'
      }*/
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: (val: string) => {
          const [cycle, ech] = val.split('-');
          return `Cycle: ${cycle} - Échantillon: ${ech}`;
        }
      },
      y: {
        formatter: (val: number | null) =>
          val != null ? `${val.toFixed(2)} mm` : 'Pas de donnée'
      }
    }
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

getChartCote1Traction(data: { x: number; y1: number; y2: number; y3: number; y4: number }[]) {
  // Générer toutes les combinaisons x-échantillon de 1-1 à 8-4 (32 points)
  const allCategories: string[] = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      allCategories.push(`${i}-${j}`);
    }
  }

  // Créer un map des données disponibles
  const dataMap = new Map<string, number>();
  data.forEach(p => {
    if (p.y1 != null) dataMap.set(`${p.x}-1`, p.y1);
    if (p.y2 != null) dataMap.set(`${p.x}-2`, p.y2);
    if (p.y3 != null) dataMap.set(`${p.x}-3`, p.y3);
    if (p.y4 != null) dataMap.set(`${p.x}-4`, p.y4);
  });

  // Remplir la série avec les points valides et null si pas de données
  const flatData = allCategories.map(cat => ({
    x: cat,
    y: dataMap.has(cat) ? dataMap.get(cat)! : null
  }));

  return {
    ...this.chartCote1Traction,
    series: [{
      name: 'Coté 2',
      data: flatData
    }],
    xaxis: {
      type: 'category',
      categories: allCategories,
      labels: {
        rotate: -45,
        style: { fontSize: '10px' }
      },
     /* title: {
        text: 'Cycle - Échantillon'
      }*/
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: (val: string) => {
          const [cycle, ech] = val.split('-');
          return `Cycle: ${cycle} - Échantillon: ${ech}`;
        }
      },
      y: {
        formatter: (val: number | null) =>
          val != null ? `${val.toFixed(2)}` : 'Pas de donnée'
      }
    }
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

getChartCote2Traction(data: { x: number; y1: number; y2: number; y3: number; y4: number }[]) {
  // Générer toutes les combinaisons x-échantillon de 1-1 à 8-4 (32 points)
  const allCategories: string[] = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      allCategories.push(`${i}-${j}`);
    }
  }

  // Créer un map des données disponibles
  const dataMap = new Map<string, number>();
  data.forEach(p => {
    if (p.y1 != null) dataMap.set(`${p.x}-1`, p.y1);
    if (p.y2 != null) dataMap.set(`${p.x}-2`, p.y2);
    if (p.y3 != null) dataMap.set(`${p.x}-3`, p.y3);
    if (p.y4 != null) dataMap.set(`${p.x}-4`, p.y4);
  });

  // Remplir la série avec les points valides et null si pas de données
  const flatData = allCategories.map(cat => ({
    x: cat,
    y: dataMap.has(cat) ? dataMap.get(cat)! : null
  }));

  return {
    ...this.chartCote1Traction,
    series: [{
      name: 'Coté 2',
      data: flatData
    }],
    xaxis: {
      type: 'category',
      categories: allCategories,
      labels: {
        rotate: -45,
        style: { fontSize: '10px' }
      },
    /*  title: {
        text: 'Cycle - Échantillon'
      }*/
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: (val: string) => {
          const [cycle, ech] = val.split('-');
          return `Cycle: ${cycle} - Échantillon: ${ech}`;
        }
      },
      y: {
        formatter: (val: number | null) =>
          val != null ? `${val.toFixed(2)}` : 'Pas de donnée'
      }
    }
  };
}


 /*********************** Chart d'Étendue R *******************************/

 chargerToutesLesPages(): void {
  this.pdekService.getContenuParPage(this.pdekId).subscribe({
    next: (contenuPages) => {

      console.log('Contenu récupéré du backend :', contenuPages);

      this.pages = contenuPages.map((page: any) => {
        const sertissages = page.contenu;

        const dataCote1 = sertissages.map((p: any) => ({
          x: p.numCycle,
          y1: p.hauteurSertissageC1Ech1 ,
          y2: p.hauteurSertissageC1Ech2 ,
          y3: p.hauteurSertissageC1Ech3 ,
          y4: p.hauteurSertissageC1EchFin
        })); 
   
        const dataCote2 = sertissages.map((p: any) => ({
          x: p.numCycle,
          y1: p.hauteurSertissageC2Ech1 ,
          y2: p.hauteurSertissageC2Ech2 ,
          y3: p.hauteurSertissageC2Ech3 ,
          y4: p.hauteurSertissageC2EchFin
        })); 
        const tractionCote1 = sertissages.map((p: any) => ({
          x: p.numCycle,
          y1: p.forceTractionC1Ech1 ,
          y2: p.forceTractionC1Ech2 ,
          y3: p.forceTractionC1Ech3 ,
          y4: p.forceTractionC1EchFin
        })); 
   
        const tractionCote2 = sertissages.map((p: any) => ({
          x: p.numCycle,
          y1: p.forceTractionC2Ech1 ,
          y2: p.forceTractionC2Ech2 ,
          y3: p.forceTractionC2Ech3 ,
          y4: p.forceTractionC2EchFin
        })); 
        return {
          pageNum: page.numeroPage,
          sertissages ,
          chartCote1Hauteur: this.getChartCote1Hauteur(dataCote1),
          chartCote2Hauteur: this.getChartCote2Hauteur(dataCote2) ,
          chartCote1Traction: this.getChartCote1Traction(tractionCote1),
          chartCote2Traction: this.getChartCote2Traction(tractionCote2)
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




    getValeurC1(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.hauteurSertissageC1Ech1,
                   sertissage.hauteurSertissageC1Ech2,
                   sertissage.hauteurSertissageC1Ech3, 
                   sertissage.hauteurSertissageC1EchFin];
      return echs[row] ?? null;
    }
    

    getValeurC2(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.hauteurSertissageC2Ech1,
                   sertissage.hauteurSertissageC2Ech2,
                   sertissage.hauteurSertissageC2Ech3, 
                   sertissage.hauteurSertissageC2EchFin];
      return echs[row] ?? null;
    }
    
    getTractionC1(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.forceTractionC1Ech1,
                   sertissage.forceTractionC1Ech2,
                   sertissage.forceTractionC1Ech3, 
                   sertissage.forceTractionC1EchFin];
      return echs[row] ?? null;
    }
    

    getTractionC2(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.forceTractionC2Ech1,
                   sertissage.forceTractionC2Ech2,
                   sertissage.forceTractionC2Ech3, 
                   sertissage.forceTractionC2EchFin];
      return echs[row] ?? null;
    }
    
    
    
    getNom(page: any, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      return sertissage ? sertissage.matricule : null;
    }
    
  
    getDate(page: any, col: number): string | null {
      const sertissage = page.sertissages?.[col];
      return sertissage ? sertissage.date : null;
    }   
  
  getCodeControle(page: any, col: number): string | null {
    const sertissageIDC = page.sertissagesIDC?.[col];
    return sertissageIDC ? sertissageIDC.code : null;
  }
  getMatriculeAgentQualite(page: any, col: number): string | null {
    const sertissage = page.sertissage?.[col];
    return sertissage ? sertissage.matriculeAgentQualite : null;
  }
  
  getAnnee(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
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

  getCode(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.code : null;
  }
 
  getProduit(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.produit : null;
  }
  getSerieProduit(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.serieProduit : null;
  }
  getQuantiteCycle(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.quantiteCycle : null;
  }
  getNumMachine(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.numeroMachine : null;
  }
  getOperateur(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.userSertissageIDC : null;
  }
   getQM(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.matriculeAgentQualite : null;
  }


 /*  naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/ui-components/listePdekTousProcess']);
  }  */
    naviger() {
      localStorage.removeItem('reponseApi');
      localStorage.removeItem('pdekSertissageIDC');
      // Trick pour forcer reload
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/ui-components/listePdekTousProcess']);
      });
    }
      imprimerPDEK(element: HTMLElement) {
  const printContents = element.innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  // Optionnel : recharge la page pour revenir à l'état initial
 location.reload();
}
}