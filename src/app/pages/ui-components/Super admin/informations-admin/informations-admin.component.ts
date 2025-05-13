import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Modeles/User';
import { Admin } from 'src/app/Modeles/Admin';
@Component({
  selector: 'app-informations-admin',
  imports: [ CommonModule,
       MatListModule,
       MatDialogModule,
       MatDividerModule,
       MatButtonModule],
  templateUrl: './informations-admin.component.html',
  styleUrl: './informations-admin.component.scss'
})
export class InformationsAdminComponent {


  constructor(
    public dialogRef: MatDialogRef<InformationsAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operators: Admin[] }
  ) {}

  formatOperation(label: string): string {
  return label.replace(/_/g, ' ');
}
}