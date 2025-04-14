import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-plan-action',
  imports: [
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    ],
  templateUrl: './add-plan-action.component.html',
  styleUrl: './add-plan-action.component.scss'
})
export class AddPlanActionComponent {

  constructor(private router: Router) {}

  cancelForm(){
    this.router.navigate(['/ui-components/listePlanAction'])
  }
}
