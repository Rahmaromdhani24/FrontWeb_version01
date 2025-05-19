import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Modeles/User';
import { Admin } from 'src/app/Modeles/Admin';
import { Users } from 'src/app/Modeles/Users';
@Component({
  selector: 'app-informations-user',
  imports: [ CommonModule,
       MatListModule,
       MatDialogModule,
       MatDividerModule,
       MatButtonModule],
  templateUrl: './informations-user.component.html',
  styleUrl: './informations-user.component.scss'
})
export class InformationsUserComponent {

  constructor(
    public dialogRef: MatDialogRef<InformationsUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operators: Users[] }
  ) {}

 /* formatOperation(label: string): string {
  return label.replace(/_/g, ' ');
}*/

formatOperation(operation?: string): string {
  if (!operation) {
    return '-';
  }
  switch (operation) {
    case 'SERTISSAGE':
      return 'Sertissage';
    case 'SERTISSAGE_IDC':
      return 'Sertissage IDC';
    case 'SOUDURE':
      return 'Soudure';
       case 'Montage_Pistolet':
      return 'Montage Pistolet';
    case 'TORSADAGE':
      return 'Torsadage';
    default:
      return operation;
  }
}
}