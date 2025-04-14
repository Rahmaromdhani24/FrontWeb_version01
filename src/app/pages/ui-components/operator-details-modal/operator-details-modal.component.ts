import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface Operator {
  matricule: string;
  nom: string;
  plant: string;
  segments: string[];
}

@Component({
  selector: 'app-operator-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './operator-details-modal.component.html',
  styleUrls: ['./operator-details-modal.component.scss']
})
export class OperatorDetailsModalComponent {
  // Liste statique d'opérateurs
  staticOperators: Operator[] = [
    {
      matricule: 'EMP1001',
      nom: 'Jean Dupont',
      plant: 'Plant A',
      segments: ['Segment 1', 'Segment 2']
    },
    {
      matricule: 'EMP1002',
      nom: 'Marie Martin',
      plant: 'Plant B',
      segments: ['Segment 3']
    },
    {
      matricule: 'EMP1003',
      nom: 'Pierre Bernard',
      plant: 'Plant C',
      segments: ['Segment 1', 'Segment 3']
    },
    {
      matricule: 'EMP1004',
      nom: 'Sophie Petit',
      plant: 'Plant A',
      segments: ['Segment 2']
    },
    {
      matricule: 'EMP1005',
      nom: 'Luc Dubois',
      plant: 'Plant B',
      segments: ['Segment 1', 'Segment 2', 'Segment 3']
    }
  ];

  // Combine les opérateurs reçus et les opérateurs statiques
  get operatorsToDisplay() {
    return this.data?.operators?.length > 0 
      ? this.data.operators 
      : this.staticOperators;
  }

  constructor(
    public dialogRef: MatDialogRef<OperatorDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operators: Operator[] }
  ) {}
}