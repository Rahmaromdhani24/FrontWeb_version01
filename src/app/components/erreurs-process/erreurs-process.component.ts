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

  erreurs: number = 0;
  pourcentageErreurs : number =0 ; 
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public productsalesChart!: Partial<productsalesChart> | any;

 

  ngOnInit(): void {
    forkJoin({
      erreurs: this.statsService.getNombresErreursCetteSemaine(),
      pourcentage: this.statsService.getPourcentagesErreursCetteSemaine()
    }).subscribe(result => {
      this.erreurs = result.erreurs;
      this.pourcentageErreurs = result.pourcentage;
    });
  }

  constructor(private statsService: StatistiquesService) { 
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
