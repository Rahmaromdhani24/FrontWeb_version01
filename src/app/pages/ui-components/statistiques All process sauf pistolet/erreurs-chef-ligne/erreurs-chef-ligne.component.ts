import { Component, ViewChild, OnInit } from "@angular/core";
import { StatProcessus } from "src/app/Modeles/StatProcessus";
import { StatistiquesService } from "src/app/services/Statistiques/statistiques.service";
import { MatTabsModule } from '@angular/material/tabs';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexPlotOptions,
  ApexFill,
  ApexResponsive,
  NgApexchartsModule,
  ApexYAxis,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexMarkers
} from 'ng-apexcharts';
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

export type ChartOptions = {
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
};

@Component({
  selector: 'app-erreurs-chef-ligne',
 imports: [
    CommonModule,
    NgApexchartsModule,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './erreurs-chef-ligne.component.html',
  styleUrl: './erreurs-chef-ligne.component.scss'
})
export class ErreursChefLigneComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
    constructor(private service: StatistiquesService) {}
  
  ngOnInit(): void {
    this.loadChartData();
  }
  
  loadChartData(): void {
    let observable;
    const plant = localStorage.getItem('plant') || '';
    const segment = Number(localStorage.getItem('segment'));
    const typeOperation = localStorage.getItem('operation');
    switch (typeOperation) {
      case 'Soudure':
        observable = this.service.getStatsSoudure(plant, segment);
        break;
      case 'Torsadage':
        observable = this.service.getStatsTorsadage(plant, segment);
        break;
      case 'Sertissage_IDC':
        observable = this.service.getStatsSertissageIDC(plant, segment);
        break;
      case 'Sertissage_Normal':
        observable = this.service.getStatsSertissageNormal(plant, segment);
        break;
      default:
        console.warn('Type d\'opération non reconnu');
        return;
    }
  
    observable.subscribe(data => {
      this.chartOptions = this.buildChartOptions(data);
    });
  }
  
  buildChartOptions(data: StatProcessus[]): Partial<ChartOptions> {
    const categories = data.map(d => `PDEK de Section : ${d.sectionFil} (${d.machine})`);
    const nombrePdekSeries = data.map(d => d.nombrePdek);
    const erreursSeries = data.map(d => d.nombreErreurs);
  
    return {
      series: [
        { name: "Nombre PDEK", data: nombrePdekSeries },
        { name: "Nombre Erreurs", data: erreursSeries }
      ],
      chart: {
        type: "bar",
        height: 450
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%"
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'] // Couleur du texte (noir)
        },
        offsetY: -10, // Décale le texte vers le haut
        formatter: function (val: number) {
          return val.toString();
        }
      },      
      xaxis: { categories },
   
    };
  }
}