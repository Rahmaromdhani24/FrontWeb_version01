import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralService } from 'src/app/services/Géneral/general.service';
import Swal from 'sweetalert2';
import { AdminServiceService } from 'src/app/services/Admin/admin-service.service';

@Component({
  selector: 'app-login-user',
  imports: [RouterModule, MaterialModule , FormsModule, ReactiveFormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent implements OnInit {
  form: FormGroup;
  matricule: number;
  errorMessage: string;
  admin : any ; 


  constructor( private router: Router , private fb: FormBuilder , private authService: GeneralService , 
               private serviceAdmin : AdminServiceService ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      matricule: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin(): void {
    if (this.form.valid) {
      const matricule = this.form.get('matricule')?.value;
      this.authService.login(matricule).subscribe({
        next: async (response) => {
          if (response.token) {   
            localStorage.setItem('token', response.token);
            
            try {
              await this.recupererInformations(matricule);
              this.router.navigate(['/dashboard']);
            } catch (error) {
              console.error('Erreur lors de la récupération des informations', error);
            }
          }
        },
        error: (error) => {
            // Gérer les erreurs de connexion, par exemple une erreur réseau
            if (error.status === 400 || error.status === 500) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Erreur de connexion !" ,
              });
            } else {
              // Si c'est une erreur spécifique liée au matricule incorrect (ou autre logique),
              // vous pouvez aussi ici personnaliser le message d'erreur.
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Cette matricule n'existe pas, Veuillez réessayer !",
              });
            }
          }
        });
      } 
    }
   
    recupererInformations(matricule: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.authService.getUser(matricule).subscribe({
          next: (user) => {
            this.admin = user;
            if((user.role="AGENT_QUALITE" ) && (user.operation="Montage_Pistolet")){
              localStorage.setItem('role', "AGENT_QUALITE_PISTOLET");    
            }
            if((user.role="AGENT_QUALITE" ) && (user.operation=null)){
              localStorage.setItem('role', user.role);    
            }
            localStorage.setItem('user', JSON.stringify(user)); 
          
            localStorage.setItem('matricule', user.matricule);

            localStorage.setItem('plant', user.plant);

            localStorage.setItem('segment', user.segment);
            resolve();
          },
          error: (err) => {
            console.error('S7i7aaaa   !!!!! ');
            reject(err);
          }
        });
      });
    }  
}



/*this.authService.getUser(matricule).subscribe({
  next: (user) => {
    this.admin = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
    // this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    console.error('Erreur lors de la récupération de l\'utilisateur', err);
  }
});*/