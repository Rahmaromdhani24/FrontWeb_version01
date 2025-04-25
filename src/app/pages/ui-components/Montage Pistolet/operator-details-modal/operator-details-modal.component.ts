import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Modeles/User';

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
  


  constructor(
    public dialogRef: MatDialogRef<OperatorDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operators: User[] }
  ) {}
}