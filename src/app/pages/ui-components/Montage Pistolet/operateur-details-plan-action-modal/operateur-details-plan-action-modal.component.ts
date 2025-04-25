import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Modeles/User';

@Component({
  selector: 'app-operateur-details-plan-action-modal',
  imports: [
     CommonModule,
     MatListModule,
     MatDialogModule,
     MatDividerModule,
     MatButtonModule
   ],
  templateUrl: './operateur-details-plan-action-modal.component.html',
  styleUrl: './operateur-details-plan-action-modal.component.scss'
})
export class OperateurDetailsPlanActionModalComponent {


  constructor(
    public dialogRef: MatDialogRef<OperateurDetailsPlanActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operators: User[] }
  ) {}
}
