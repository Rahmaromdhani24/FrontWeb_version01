import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';
import { OperateurErreurDTO } from 'src/app/Modeles/OperateurErreurDTO';
import { StatistiquesService } from 'src/app/services/Statistiques/statistiques.service';


@Component({
  selector: 'app-top-employees',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule],
  templateUrl: './top-employees.component.html',
})
export class AppTopEmployeesComponent implements OnInit {
  displayedColumns: string[] = ['nomPrenom' ,'matricule', 'poste', 'machine', 'plant', 'segment', 'typeOperation'/*, 'nombreErreurs'*/];
  dataSource: OperateurErreurDTO[] = [];

  constructor(private service: StatistiquesService) {}

  ngOnInit(): void {
    this.service.getTop5OperateursErreurs().subscribe({
      next: (data) => {
        this.dataSource = data.map(item => ({
          matricule: item.matricule,
          poste: item.poste,
          machine: item.machine,
          plant: item.plant,
          segment: item.segment,
          role: item.role,
          nomPrenom: item.nomPrenom,
          typeOperation: item.typeOperation,
          nombreErreurs: item.nombreErreurs
        }));
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des opérateurs :', err);
      }
    });
  }
}
