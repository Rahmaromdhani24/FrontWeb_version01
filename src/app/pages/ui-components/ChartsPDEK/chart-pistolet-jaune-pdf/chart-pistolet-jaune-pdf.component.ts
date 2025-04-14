import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels,
  ApexYAxis, ApexTitleSubtitle, ApexStroke, ApexTooltip, ApexMarkers, ApexFill, ApexAnnotations, ApexLegend
} from 'ng-apexcharts';
@Component({
  selector: 'app-chart-pistolet-jaune-pdf',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule
  ],
  providers: [],
  templateUrl: './chart-pistolet-jaune-pdf.component.html',
  styleUrl: './chart-pistolet-jaune-pdf.component.scss'
})
export class ChartPistoletJaunePDFComponent {
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
      data: [45, 40, 46, 39, 42, 45, 42, 49, 41, 39, 42, 45, 42, 49, 41, 42, 49, 41, 45, 40, 46, 39, 42, 45]
    }],
    chart: {
      type: 'line',
      height: 400,
      background: 'transparent'
    },
    xaxis: {
      categories: [
        '2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06',
        '2025-01-07', '2025-01-08', '2025-01-09', '2025-01-10', '2025-01-11', '2025-01-12',
        '2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17', '2025-01-18',
        '2025-01-19', '2025-01-20', '2025-01-21', '2025-01-22', '2025-01-23', '2025-01-24'
      ],
      labels: {
        rotate: -45,
        show: false
      }
    },
    yaxis: {
      min: 30,
      max: 50,
      tickAmount: 10,
      labels: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 5
    },
    tooltip: {
      enabled: true,
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
        {
          y: 34,
          y2: 35,
          borderColor: '#ffff0064',
          fillColor: '#ffff0064',
          opacity: 0.5,
          label: {
            //text: 'Zone Jaune',
            style: {
              color: '#000'
            }
          }
        },
        {
          y: 35,
          y2: 45,
          borderColor: '#00c80087',
          fillColor: '#00c80087',
          opacity: 0.4,
          label: {
           // text: 'Zone Verte',
            style: {
              color: '#000'
            }
          }
        },
        {
          y: 45,
          y2: 46,
          borderColor: '#ffff0064',
          fillColor: '#ffff0064',
          opacity: 0.5,
          label: {
            //text: 'Zone Jaune',
            style: {
              color: '#000'
            }
          }
        },
        {
          y: 30,
          y2: 34,
          borderColor: '#ff00006e',
          fillColor: '#ff00006e',
          opacity: 0.4,
          label: {
            //text: 'Zone Rouge',
            style: {
              color: '#000'
            }
          }
        },
        {
          y: 46,
          y2: 50,
          borderColor: '#ff00006e',
          fillColor: '#ff00006e',
          opacity: 0.4,
          label: {
            //text: 'Zone Rouge',
            style: {
              color: '#000'
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
      data: [
        2.5, 3.1, 4.2, 3.8, 5.0, 6.2, 7.4, 8.1, 7.3, 6.5, 5.7, 4.9,
        4.1, 3.3, 2.5, 3.7, 4.9, 6.1, 7.3, 8.5, 9.2, 8.4, 7.6, 6.8, 6.0
      ]
    }],
    chart: {
      type: 'line',
      height: 250,
      background: 'transparent'
    },
    xaxis: {
      categories: Array.from({ length: 25 }, (_, i) => (i + 1).toString())
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 10
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 5,
      colors: ['#333'],
      strokeColors: '#fff',
      strokeWidth: 1
    },
    tooltip: {
      enabled: true
    },
    annotations: {
      yaxis: [
        {
          y: 3,
          borderColor: 'red',
          label: {
            text: 'Limite',
            style: {
              color: '#fff',
              background: 'red'
            }
          }
        }
      ]
    }
  };
}