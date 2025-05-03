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
  selector: 'app-erreurs-par-process',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './erreurs-par-process.component.html',
  styleUrls: ['./erreurs-par-process.component.scss'],
})
export class ErreursParProcessComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptionsPdek: Partial<ChartOptions> | any;
  public chartOptionsErreurs?: Partial<ChartOptions> | any;
  constructor(private service: StatistiquesService) {}

  ngOnInit(): void {
    const plant = localStorage.getItem('plant') || '';
    this.service.getStatsParProcessus(plant).subscribe((data: StatProcessus[]) => {
      const processusList = Array.from(new Set(data.map(d => d.processus)));
      const sectionList   = Array.from(new Set(data.map(d => d.sectionFil)));
  
      // Pré-calcul des machines uniques par section
      const machinesParSection = new Map<string, string>();
      sectionList.forEach(section => {
        const machines = Array.from(
          new Set(
            data
              .filter(d => d.sectionFil === section)
              .map(d => d.machine)
              .filter(m => !!m)
          )
        );
        machinesParSection.set(section, machines.join(', ') || 'Non défini');
      });
  
      const seriesCombined: ApexAxisChartSeries = [];
  
      sectionList.forEach(section => {
        // La chaîne de machines pour cette section
        const machinesStr = machinesParSection.get(section)!;  // ex: "m-245, m-249"
  
        // On met la machine(s) directement dans le nom de la série
        const seriePdek = {
          name: `PDEK de section${section} (${machinesStr})`,
          data: [] as any[]
        };
        const serieErr = {
          name: `Erreurs PDEK de section${section} (${machinesStr})`,
          data: [] as any[]
        };
  
        processusList.forEach(proc => {
          const filtred = data.filter(d => d.processus === proc && d.sectionFil === section);
          const sumPdek = filtred.reduce((s, d) => s + (d.nombrePdek    ?? 0), 0);
          const sumErr  = filtred.reduce((s, d) => s + (d.nombreErreurs ?? 0), 0);
          const machinesPoint = Array.from(new Set(filtred.map(d => d.machine).filter(m => !!m)))
                                     .join(', ') || 'Non défini';
  
          // On stocke aussi la machine(s) par point pour le tooltip + dataLabels
          seriePdek.data.push({ x: proc, y: sumPdek, machines: machinesPoint });
          serieErr .data.push({ x: proc, y: sumErr,  machines: machinesPoint });
        });
  
        seriesCombined.push(seriePdek, serieErr);
      });
  
      this.chartOptionsPdek = {
        series: seriesCombined,
        chart: {
          type: 'bar', height: 450, stacked: true,
          toolbar: { show: true }, zoom: { enabled: true }
        },
        plotOptions: { bar: { horizontal: false, columnWidth: '60%' } },
        dataLabels: {
          enabled: true,
          formatter: (val: number, opts: any): string => {
            const pt = (opts.w.config.series[opts.seriesIndex].data as any[])[opts.dataPointIndex];
            return `${val}`;
          }
        },
        xaxis: { type: 'category' },
        yaxis: { title: { text: 'Nombre de PDEK / Erreurs' } },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          offsetY: 10
        },
        fill: { opacity: 1 },
        tooltip: {
          enabled: true,
          custom: ({ seriesIndex, dataPointIndex, w }: any) => {
            const name  = w.globals.seriesNames[seriesIndex];
            const point = (w.config.series[seriesIndex].data as any[])[dataPointIndex];
            return `
              <div style="padding:8px;">
                <strong>${name}</strong><br/>
                Processus : ${point.x}<br/>
                Machine(s) : ${point.machines}<br/>
                Valeur : ${point.y}
              </div>
            `;
          }
        }
      };
    });
  }
    
}