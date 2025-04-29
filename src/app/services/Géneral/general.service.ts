import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { forkJoin } from 'rxjs';
import { TorsadageService } from '../Agent Qualite Operation Torsadage/torsadage.service';
import { SoudureService } from '../Agent Qualité Operation Soudure/soudure.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient ,
              public serviceSoudure : SoudureService , 
              public serviceTorsadage : TorsadageService) { }
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

/*****************************************************************************************************/
recupererNombreNotificationsTousProcessSaufPistolet() {
  forkJoin([
    this.serviceSoudure.getNombreNotificationsAgentQualitePourValidation(),
    this.serviceTorsadage.getNombreNotificationsAgentQualitePourValidation()
  ]).subscribe({
    next: ([countSoudure, countTorsadage]) => {
      this.nbrNotifications = countSoudure + countTorsadage;
      console.log('Total notifications :', this.nbrNotifications);
    },
    error: (err: any) => {
      console.error('Erreur lors de la récupération des notifications :', err);
    }
  });
}
recupererNombreNotificationsTousProcessSaufPistoletChefLigne(){
    forkJoin([
      this.serviceSoudure.getNombreNotificationsChefDeLigne(),
      this.serviceTorsadage.getNombreNotificationsChefDeLigne()
    ]).subscribe({
      next: ([countSoudure, countTorsadage]) => {
        this.nbrNotifications = countSoudure + countTorsadage;
        console.log('Total notifications :', this.nbrNotifications);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    });
  }
}