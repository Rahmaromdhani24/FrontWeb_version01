import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Operateur } from 'src/app/Modeles/Operateur';
@Component({
  selector: 'app-informations-operateur',
  imports: [ CommonModule,
       MatListModule,
       MatDialogModule,
       MatDividerModule,
       MatButtonModule],
  templateUrl: './informations-operateur.component.html',
  styleUrl: './informations-operateur.component.scss'
})
export class InformationsOperateurComponent {

  constructor(
    public dialogRef: MatDialogRef<InformationsOperateurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operators: Operateur[] }
  ) {}

  formatOperation(label: string): string {
  return label.replace(/_/g, ' ');
}
}
