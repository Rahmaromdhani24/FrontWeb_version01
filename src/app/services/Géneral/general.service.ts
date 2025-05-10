import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { forkJoin } from 'rxjs';
import { TorsadageService } from '../Agent Qualite Operation Torsadage/torsadage.service';
import { SoudureService } from '../Agent Qualité Operation Soudure/soudure.service';
import { SertissageIDCService } from '../Agent Qualite Operation Sertissage/sertissage-idc.service';
import { SertissageNormalService } from '../Agent Qualite Operation Sertissage/sertissage-normal.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient ,
              public serviceSoudure : SoudureService , 
              public serviceTorsadage : TorsadageService ,
              public serviceSertissageIDC : SertissageIDCService , 
              public serviceSertissageNormal : SertissageNormalService   ) { }
  nbrNotifications: number ; 
  pistolets: Pistolet[] = [];
  donnees: any[] = [];

  private urlLogin = 'http://localhost:8281/auth/login';
  login(matricule: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { matricule };
    return this.http.post<any>(this.urlLogin, body, { headers });
  }


  private urlGetUser = 'http://localhost:8281/auth/getUser';
  getUser(matricule: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.urlGetUser}/${matricule}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
 

saveToken(token: string) {
  localStorage.setItem('token', token);
}

getToken(): string | null {
  return localStorage.getItem('token');
}
isLoggedIn(): boolean {
  return !!localStorage.getItem('token'); // ou une vérification plus poussée
}
getCurrentUser(): any {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}


/*****************************************************************************************************/
recupererNombreNotificationsTousProcessSaufPistoletAgentQualite() {
    forkJoin([
      this.serviceSoudure.getNombreNotificationsAgentQualitePourValidation(),
      this.serviceTorsadage.getNombreNotificationsAgentQualitePourValidation() ,
      this.serviceSertissageIDC.getNombreNotificationsAgentQualitePourValidation() ,
      this.serviceSertissageNormal.getNombreNotificationsAgentQualitePourValidation()
    ]).subscribe({
      next: ([countSoudure, countTorsadage , countSertissageIDC , countSertissageNormal]) => {
        this.nbrNotifications = countSoudure + countTorsadage +countSertissageIDC +countSertissageNormal;
        console.log('Total notifications agent qualite:', this.nbrNotifications);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }
 /* //operationUser  = localStorage.getItem('operation') || '';
recupererNombreNotificationsTousProcessSaufPistoletChefLigne(){
    forkJoin([
        this.serviceSoudure.getNombreNotificationsChefDeLigne(),
      this.serviceTorsadage.getNombreNotificationsChefDeLigne(),
      this.serviceSertissageIDC.getNombreNotificationsChefDeLigne() ,
      this.serviceSertissageNormal.getNombreNotificationsChefDeLigne() 
    ]).subscribe({
      next: ([countSoudure, countTorsadage , countSertissageIDC ,countSertissageNormal ]) => {
        this.nbrNotifications = countSoudure + countTorsadage + countSertissageIDC +countSertissageNormal;
        console.log('Total notifications :', this.nbrNotifications);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }*/
    operationUser = localStorage.getItem('operation') || '';

    recupererNombreNotificationsTousProcessSaufPistoletChefLigne() {
      const observables: Observable<number>[] = [];
    
      if (this.operationUser === 'Soudure') {
        observables.push(this.serviceSoudure.getNombreNotificationsChefDeLigne());
      }
      if (this.operationUser === 'Torsadage') {
        observables.push(this.serviceTorsadage.getNombreNotificationsChefDeLigne());
      }
      if (this.operationUser === 'Sertissage_IDC') {
        observables.push(this.serviceSertissageIDC.getNombreNotificationsChefDeLigne());
        console.log("test de nbr notif en service general : "+this.serviceSertissageIDC.getNombreNotificationsChefDeLigne())
      }
      if (this.operationUser === 'Sertissage_Normal') {
    
        observables.push(this.serviceSertissageNormal.getNombreNotificationsChefDeLigne());
      }
    
      // Si rien à exécuter, on évite l'appel à forkJoin
      if (observables.length === 0) {
        this.nbrNotifications = 0;
        return;
      }
    
      forkJoin(observables).subscribe({
        next: (counts: number[]) => {
          this.nbrNotifications = counts.reduce((acc, curr) => acc + curr, 0);
          console.log('Total notifications :', this.nbrNotifications);
        },
        error: (err: any) => {
          console.error('Erreur lors de la récupération des notifications :', err);
        }
      });
    }
    
}