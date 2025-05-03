import { Component, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { StatistiquesService } from 'src/app/services/Statistiques/statistiques.service';
import { StatistiquesPistoletService } from 'src/app/services/Statistiques/statistiques-pistolet.service';

export interface productsalesChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-erreurs-process',
  imports: [MaterialModule, TablerIconsModule, MatButtonModule, NgApexchartsModule],
  templateUrl: './erreurs-process.component.html',
  styleUrl: './erreurs-process.component.scss',

})
export class AppErreursProcessComponent {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public productsalesChart!: Partial<productsalesChart> | any;
  erreurs: number = 0;
  pourcentageErreurs : number =0 ; 
 
  constructor(private statsService: StatistiquesService , private servicePistolet : StatistiquesPistoletService) { 
    const role = localStorage.getItem('role');
    const operation = localStorage.getItem('operation');

if((role ==='AGENT_QUALITE' ||role ==='CHEF_DE_LIGNE')  && (operation==='undefined' ||
  operation==='Sertissage_IDC' || operation==='Sertissage_Normal' 
   || operation==='Soudure'|| operation==='Torsadage')){
    this.statsService.fetchAllStatsErreursProcess() ; 
    this.statsService.erreurs$.subscribe(erreurs => { this.erreurs = erreurs; });
    this.statsService.pourcentageErreurs$.subscribe(pourcentageErreurs => { this.pourcentageErreurs = pourcentageErreurs; });
}
if((role ==='AGENT_QUALITE_PISTOLET'  ||role ==='TECHNICIEN') && (operation==='Montage_Pistolet' )){
  this.servicePistolet.fetchAllStatsErreursProcessPistolet() ; 
  this.servicePistolet.erreurs$.subscribe(erreurs => { this.erreurs = erreurs; });
  this.servicePistolet.pourcentageErreurs$.subscribe(pourcentageErreurs => { this.pourcentageErreurs = pourcentageErreurs; });
}
      this.productsalesChart = {
        series: [
          {
            name: '',
            color: 'rgb(0, 133, 219)', // ← couleur de la ligne
            data: [25, 66, 20, 40, 12, 58, 20],
          },
        ],
        chart: {
          type: 'area',
          fontFamily: "inherit",
          foreColor: 'rgb(0, 133, 219)',
          toolbar: {
            show: false,
          },
          height: 60,
          sparkline: {
            enabled: true,
          },
          group: 'sparklines',
        },
        stroke: {
          curve: 'smooth',
          width: 2,
          colors: ['rgb(0, 133, 219)'] // ← couleur de la ligne
        },
        fill: {
          colors: ['rgb(0, 133, 219)'], // ← couleur de fond
          type: 'solid',
          opacity: 0.05,
        },
        markers: {
          size: 0,
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false,
          },
        },
      };
    }
          
}
