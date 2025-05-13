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
              /*this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/dashboard']);
              });*/
            
            } catch (error) {
              console.error('Erreur lors de la récupération des informations', error);
            }
          }
        },
        error: (error) => {
          let errorCode: string | undefined;
        
          if (error.status === 403) {
            errorCode = "ROLE_NOT_AUTHORIZED";
          } else {
            errorCode = error.error?.code;
          }
        
          console.log("erreur afficher : " + errorCode);
        
          switch (errorCode) {
            case "MATRICULE_INVALIDE":
              Swal.fire({
                icon: "error",
                title: "Matricule incorrect",
                text: "Ce matricule n'existe pas. Veuillez réessayer !",
              });
              break;
        
            case "ROLE_NOT_AUTHORIZED":
              Swal.fire({
                icon: "warning",
                title: "Accès refusé",
                text: "Votre rôle ne vous permet pas d'accéder à cette application.",
              });
              break;
        
            case "ERREUR_GENERALE":
            default:
              Swal.fire({
                icon: "error",
                title: "Erreur de connexion",
                text: "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
              });
              break;
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
            
            localStorage.setItem('user', JSON.stringify(user));
    
            if (user.role === "AGENT_QUALITE" && user.operation === "Montage_Pistolet") {
              localStorage.setItem('role', "AGENT_QUALITE_PISTOLET");
            }
            else if (user.role === "AGENT_QUALITE" && (user.operation === null || user.operation === undefined)) {
              localStorage.setItem('role', user.role);
            }
            else if (user.role === "TECHNICIEN") {
              localStorage.setItem('role', "TECHNICIEN");
            }
            else if (user.role === "CHEF_DE_LIGNE") {
              localStorage.setItem('role', "CHEF_DE_LIGNE");
            }
            else if (user.role === "ADMIN") {
              localStorage.setItem('role', "ADMIN");
            }
             else if (user.role === "SUPER_ADMIN") {
              localStorage.setItem('role', "SUPER_ADMIN");
            }
            localStorage.setItem('matricule', user.matricule);
            localStorage.setItem('plant', user.plant);
            localStorage.setItem('segment', user.segment);
            localStorage.setItem('operation', user.operation);

            resolve();
          },
          error: (err) => {
            console.error('S7i7aaaa !!!!!');
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