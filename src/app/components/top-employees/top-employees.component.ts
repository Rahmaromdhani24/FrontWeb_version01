import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';
import { OperateurErreurDTO } from 'src/app/Modeles/OperateurErreurDTO';
import { StatistiquesService } from 'src/app/services/Statistiques/statistiques.service';
import { StatistiquesPistoletService } from 'src/app/services/Statistiques/statistiques-pistolet.service';
import { OperateurErreurPistolet } from 'src/app/Modeles/OperateurErreurPistolet';


@Component({
  selector: 'app-top-employees',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule],
  templateUrl: './top-employees.component.html',
})
export class AppTopEmployeesComponent implements OnInit {
  displayedColumns: string[] = ['nomPrenom' ,'matricule', 'poste', 'machine', 'plant', 'segment', 'typeOperation'];
  dataSource: OperateurErreurDTO[] = [];
  dataSourcePistolet: OperateurErreurPistolet[] = [];
  displayedColumnsPistolet: string[] = ['nomPrenom' ,'matricule', 'plant', 'typePistolet' , 'categoriePistolet', 'nombreErreurs'];
  test : string ='' ; 
  constructor(private service: StatistiquesService ,
              private servicePistolet : StatistiquesPistoletService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const operation = localStorage.getItem('operation');

 if ((role === 'AGENT_QUALITE' || role === 'CHEF_DE_LIGNE') &&
  (operation === 'undefined' || operation === 'Sertissage_IDC' ||
   operation === 'Sertissage_Normal' || operation === 'Soudure' ||
   operation === 'Torsadage')) {
  
  this.test = 'allProcess';
  
  this.service.getTop5OperateursErreurs().subscribe({
    next: (data) => {
      const top5 = data
        .sort((a, b) => b.nombreErreurs - a.nombreErreurs)
        .slice(0, 5)
        .map(item => ({
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

      this.dataSource = top5;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des opérateurs :', err);
    }
  });
}
 if (role === 'AGENT_QUALITE_PISTOLET' || role === 'TECHNICIEN') {
  this.test = 'pistolet';
  this.servicePistolet.getTop5OperateursPistoletsErreurs().subscribe({
    next: (data) => {
      // Trier les données par nombre d'erreurs décroissant, puis prendre les 5 premiers
      const top5 = data
        .sort((a, b) => b.nombreErreurs - a.nombreErreurs)
        .slice(0, 5)
        .map(item => ({
          matricule: item.matricule,
          plant: item.plant,
          segment: item.segment,
          nomPrenom: item.nomPrenom,
          typePistolet: item.typePistolet,
          categoriePistolet: item.categoriePistolet,
          nombreErreurs: item.nombreErreurs
        }));

      this.dataSourcePistolet = top5;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des opérateurs :', err);
    }
  });
}
  }
  formatAttribut(input: string): string {
    return input.toLowerCase().replace(/_/g, ' ');
  }
}
