import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexYAxis, ApexLegend, ApexXAxis, ApexTooltip, ApexTheme, ApexGrid, ApexPlotOptions, ApexFill } from 'ng-apexcharts';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
export type ChartOptions = {
  series: ApexAxisChartSeries[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-stat-super-admin',
  templateUrl: './stat-super-admin.component.html',
  styleUrls: ['./stat-super-admin.component.scss'] ,
   imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,  // Si vous utilisez des icônes
    // autres imports
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class StatSuperAdminComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public areaChartOptions: Partial<ChartOptions> | any;

  constructor(private service: SuperAdminService) {
    const typeAdmins = ['Admin_ppo', 'Admin_qualité', 'Admin_production'];
    const seriesData: ApexAxisChartSeries = [];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    let loaded = 0;

    typeAdmins.forEach(type => {
      this.service.getUserCountByTypeAdmin(type).subscribe((data: Map<string, number[]>) => {
        console.log(`Données reçues pour ${type}:`, data);

        if (data instanceof Map) {
          const seriesItem = {
            name: type,
            data: months.map(month => {
              const monthData = data.get(month);
              return monthData && monthData.length > 0 ? monthData[0] : 0;
            }),
          };
          seriesData.push(seriesItem);
        } else {
          console.error(`Données inattendues pour ${type}:`, data);
        }

        loaded++;
        if (loaded === typeAdmins.length) {
        this.areaChartOptions = {
  series: seriesData,
  chart: {
    fontFamily: 'inherit',
    foreColor: '#a1aab2',
    height: 350,
    type: 'area',
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  markers: { size: 3 },
  stroke: { curve: 'smooth', width: 2 },
  colors: ['#398bf7', '#06d79c', '#f672a7'],
  legend: { show: true },
  grid: {
    show: true,
    strokeDashArray: 0,
    borderColor: 'rgba(0,0,0,0.1)',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  xaxis: {
    type: 'category',
    categories: months,
  },
  tooltip: { theme: 'dark' },
  plotOptions: { // Exemple de configuration de plotOptions si nécessaire
    area: {
      borderRadius: 8
    }
  }
};

        }
      });
    });
  }
}
