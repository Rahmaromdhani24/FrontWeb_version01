import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Operateur {
  matricule: string;
  nom: string;
  prenom: string;
  plant: string;
  segment: string;
  poste: string;
  machine: string;
}
@Component({
  selector: 'app-operateurs-pdek',
  standalone: true, // Si vous utilisez des composants standalone
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './operateurs-pdek.component.html',
  styleUrl: './operateurs-pdek.component.scss'
})
export class OperateursPdekComponent {
  operateurs: Operateur[];

  constructor(
    public dialogRef: MatDialogRef<OperateursPdekComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @HostListener('window:resize')
  onWindowResize() {
    this.dialogRef.updateSize('80%', '80%');
  }
}