import { Component, OnInit, ViewChild } from '@angular/core';
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

export interface trafficdistributionChart {
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
  selector: 'app-effectif-operateurs',
  imports: [MaterialModule, TablerIconsModule, MatButtonModule, NgApexchartsModule],
  templateUrl: './effectif-operateurs.component.html',
  styleUrl: './effectif-operateurs.component.scss',

})
export class AppEffectifOperateursComponent {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public trafficdistributionChart!: Partial<trafficdistributionChart> | any;
  hommes: number = 0;
  femmes: number = 0;
  total: number = 0;
  pourcentageAugmentation: number = 0;

  constructor(public statsService: StatistiquesService) { 
  this.statsService.fetchAllStats();
  this.statsService.hommes$.subscribe(hommes => { this.hommes = hommes; });
  this.statsService.femmes$.subscribe(femmes => { this.femmes = femmes;});
  this.statsService.total$.subscribe(total => {this.total = total;});
  this.statsService.pourcentageAugmentation$.subscribe(pourcentage => { this.pourcentageAugmentation = pourcentage;});

 // private tryInitializeChart(): void {
    if (this.hommes && 
       this.femmes && 
       this.total) {
       this.trafficdistributionChart = {
        series: [ this.femmes, this.hommes],
        labels: [ 'Femmes', 'Hommes'],
        chart: {
          type: 'donut',
          fontFamily: "inherit",
          foreColor: '#adb0bb',
          toolbar: {
            show: false,
          },
          height: 160,
        },
        colors: [ '#fb977d', '#0085db'],
        plotOptions: {
          pie: {
            donut: {
              size: '80%',
              background: 'none',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '12px',
                  offsetY: 5,
                },
                value: {
                  show: false,
                  color: '#98aab4',
                },
              },
            },
          },
        },
        stroke: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 991,
            options: {
              chart: {
                width: 120,
              },
            },
          },
        ],
        tooltip: {
          enabled: false,
        },
      };
    }
  }
  }

