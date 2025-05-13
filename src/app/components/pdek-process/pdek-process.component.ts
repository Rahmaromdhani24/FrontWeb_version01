import { Component, OnInit, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

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
import { StatPistolet } from 'src/app/Modeles/StatPistolet';



export interface profitExpanceChart {
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
  selector: 'app-pdek-process',
  imports: [MaterialModule, TablerIconsModule, MatButtonModule, NgApexchartsModule],
  templateUrl: './pdek-process.component.html',
})
export class AppPdekProcessComponent  implements OnInit{

  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public profitExpanceChart!: Partial<profitExpanceChart> | any;
  role : string ='' ;
  constructor(
    private statsService: StatistiquesService,
    private servicePistolet: StatistiquesPistoletService,
    private cdr: ChangeDetectorRef // Injection du ChangeDetectorRef
  ) {
    this.profitExpanceChart = {
      series: [], // sera défini dans ngOnInit
      chart: {
        type: 'bar',
        height: 390,
        offsetY: 10,
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 4,
          endingShape: 'rounded',
        },
      },
      xaxis: {
        type: 'category',
        categories: [],
      },
      yaxis: {
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      fill: {
        opacity: 1,
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['transparent'],
      },
      tooltip: { theme: 'light' },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role')|| '';
    this.role = role ; 
    const operation = localStorage.getItem('operation');
    
    if ((role === 'AGENT_QUALITE' || role === 'CHEF_DE_LIGNE') &&
        (operation === 'undefined' || operation === 'Sertissage_IDC' ||
         operation === 'Sertissage_Normal' || operation === 'Soudure' ||
         operation === 'Torsadage')) {

      this.profitExpanceChart.xaxis = {
        ...this.profitExpanceChart.xaxis,
        categories: ['Soudure', 'Torsadage', 'Sertissage', 'Sertissage IDC'],
      };

      forkJoin({
        pdek: this.statsService.getPdekCountByType(),
        plans: this.statsService.getPlanActionCountByType(),
      }).subscribe(({ pdek, plans }) => {
        const pdekData = [
          pdek['Soudure'] ?? 0,
          pdek['Torsadage'] ?? 0,
          pdek['Sertissage_Normal'] ?? 0,
          pdek['Sertissage_IDC'] ?? 0,
        ];

        const plansData = [
          plans['Soudure'] ?? 0,
          plans['Torsadage'] ?? 0,
          plans['Sertissage_Normal'] ?? 0,
          plans['Sertissage_IDC'] ?? 0,
        ];

        this.profitExpanceChart.series = [
          { name: 'Nombre PDEKs', data: pdekData, color: '#0085db' },
          { name: 'Nombre Plans Actions', data: plansData, color: '#fb977d' },
        ];

        // Appel à detectChanges() pour forcer la détection des changements et mettre à jour la vue
        this.cdr.detectChanges();
      });
    }

    if ( (role === 'AGENT_QUALITE_PISTOLET' || role === 'TECHNICIEN')) {
      this.servicePistolet.getChartDataForPistolet().subscribe(({ series, categories }) => {
        this.profitExpanceChart.series = series;
        this.profitExpanceChart.xaxis = {
          ...this.profitExpanceChart.xaxis,
          categories
        };
        this.cdr.detectChanges();
      });
    }
  }

getCurrentYear(): number {
  return new Date().getFullYear();
}

}
