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
import { GeneralService } from 'src/app/services/Géneral/general.service';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';

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
  selector: 'app-nbr-pdek-sans-plan-action-pistolet',
  imports: [MaterialModule, TablerIconsModule, MatButtonModule, NgApexchartsModule],
  templateUrl: './nbr-pdek-sans-plan-action-pistolet.component.html',
  styleUrl: './nbr-pdek-sans-plan-action-pistolet.component.scss'
})
export class NbrPdekSansPlanActionPistoletComponent {
 @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public productsalesChart!: Partial<productsalesChart> | any;
  total: number = 0;
  pourcentageAugmentation: number = 0;
  constructor(public statsService: PistoletGeneralService) { 
  this.statsService.getNombreNotificationsTechniciens().subscribe(totalNotif => {
  this.total = totalNotif;
});
 // private tryInitializeChart(): void {
       this.productsalesChart = {
           series: [
             {
               name: '',
               color: 'rgb(245, 103, 47)', // ← couleur de la ligne
               data: [25, 66, 20, 40, 12, 58, 20],
             },
           ],
           chart: {
             type: 'area',
             fontFamily: "inherit",
             foreColor: 'rgb(245, 103, 47)',
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
             colors: ['rgb(245, 103, 47)'] // ← couleur de la ligne
           },
           fill: {
             colors: ['rgb(245, 103, 47)'], // ← couleur de fond
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


