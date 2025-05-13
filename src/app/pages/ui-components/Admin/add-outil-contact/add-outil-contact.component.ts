import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common'; 
import { TablerIconsModule } from 'angular-tabler-icons';
import { SuperAdminService } from 'src/app/services/Super Admin/super-admin.service';
import Swal from 'sweetalert2';
import { Admin } from 'src/app/Modeles/Admin';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/services/Admin/admin-service.service';
import { Users } from 'src/app/Modeles/Users';
import { OutilContact } from 'src/app/Modeles/OutilContact';

@Component({
  selector: 'app-add-outil-contact',
  imports: [ 
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        CommonModule , 
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        TablerIconsModule],
  templateUrl: './add-outil-contact.component.html',
  styleUrl: './add-outil-contact.component.scss'
})
export class AddOutilContactComponent  implements OnInit {
    @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

outilForm!: FormGroup;
prefixes: any = {
  tolerance: '',
  tolerenceLargeurSertissage: '',
  tolerenceHauteurIsolant: '',
  tolerenceLargeurIsolant: ''
};


champs = [
  { name: 'numeroOutil', label: 'Numéro Outil', placeholder: '' },
  { name: 'numeroContact', label: 'Numéro Contact', placeholder: '' },
  { name: 'sectionFil', label: 'Section Fil (ex: 2.5mm²)', placeholder: 'ex: 2.5mm²' },
  { name: 'hauteurSertissage', label: 'Hauteur Sertissage', placeholder: '' },
  { name: 'frequenceControcircle', label: 'Fréquence Controcircle', placeholder: '' },
  { name: 'largeurSertissage', label: 'Largeur Sertissage', placeholder: '' },
  { name: 'hauteurIsolant', label: 'Hauteur Isolant', placeholder: '' },
  { name: 'largeurIsolant', label: 'Largeur Isolant', placeholder: '' },
  { name: 'traction', label: 'Traction', placeholder: '' },
  { name: 'lgd', label: 'LGD', placeholder: '' },
  { name: 'tolerenceLargeurSertissage', label: 'Tolérance Largeur Sertissage', placeholder: '' },
  { name: 'tolerenceLargeurIsolant', label: 'Tolérance Largeur Isolant', placeholder: '' },
  { name: 'tolerenceHauteurIsolant', label: 'Tolérance Hauteur Isolant', placeholder: '' }
];


constructor(private service: AdminServiceService , private fb: FormBuilder ,
            private router : Router ) {}
  
ngOnInit(): void {
  this.outilForm = this.fb.group({
  numeroOutil: ['', [Validators.required]],
  numeroContact:  ['', [Validators.required]],
  sectionFil: ['', [Validators.required]],
  hauteurSertissage:  ['', [Validators.required]],
  tolerance:  ['', [Validators.required]],
  frequenceControcircle:  ['', [Validators.required]],
  largeurSertissage:  ['', [Validators.required]],
  hauteurIsolant:  ['', [Validators.required]],
  largeurIsolant:  ['', [Validators.required]],
  traction:  ['', [Validators.required]],
  lgd: ['', [Validators.required]],
  tolerenceLargeurSertissage:  ['', [Validators.required]],
  tolerenceLargeurIsolant:  [''],
  tolerenceHauteurIsolant:  ['']
});

}


 onSubmit(): void {
    if (this.outilForm.valid) {
      const formData = this.outilForm.value;

      formData.tolerance = this.prefixes.tolerance + formData.tolerance;
      formData.tolerenceLargeurSertissage = this.prefixes.tolerenceLargeurSertissage + formData.tolerenceLargeurSertissage;
      formData.tolerenceHauteurIsolant = this.prefixes.tolerenceHauteurIsolant + formData.tolerenceHauteurIsolant;
      formData.tolerenceLargeurIsolant = this.prefixes.tolerenceLargeurIsolant + formData.tolerenceLargeurIsolant;

      this.service.addOutilContact(formData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Outil ajouté avec succès !', 'success');

          // Réinitialise le formulaire proprement
          this.formDirective.resetForm();

          // Réinitialise les préfixes
          this.prefixes = {
            tolerance: '',
            tolerenceLargeurSertissage: '',
            tolerenceHauteurIsolant: '',
            tolerenceLargeurIsolant: ''
          };
        },
        error: () => {
          alert('Erreur lors de l\'ajout.');
        }
      });
    }
  }


applyPrefix(controlName: string) {
  const prefix = this.prefixes[controlName];
  const value = this.outilForm.get(controlName)?.value || '';
  if (value && !value.startsWith(prefix)) {
    this.outilForm.get(controlName)?.setValue(prefix + value.replace(/^(\+|±)/, ''));
  }
}
}