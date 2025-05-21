import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
              public serviceSertissageNormal : SertissageNormalService  , 
              ) { }
  nbrNotifications: number ; 
  nbrNotificationsSoudure: number = 0;
  nbrNotificationsTorsadage : number = 0;
  nbrNotificationsSertissageIDC : number = 0;
  nbrNotificationsSertissageNormal :number = 0;
  pistolets: Pistolet[] = [];
  donnees: any[] = [];
 private _nbrNotifications = new BehaviorSubject<number>(0);
public readonly nbrNotifications$ = this._nbrNotifications.asObservable();

setNombreNotifications(n: number) {
  this._nbrNotifications.next(n);
}
// Méthode pour décrémenter proprement
decrementNombreNotifications() {
  const current = this._nbrNotifications.getValue();
  this._nbrNotifications.next(Math.max(0, current - 1)); // évite valeurs négatives
}


  get operationUser() {
    return localStorage.getItem('operation') || '';
  }

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
    this.serviceTorsadage.getNombreNotificationsAgentQualitePourValidation(),
    this.serviceSertissageIDC.getNombreNotificationsAgentQualitePourValidation(),
    this.serviceSertissageNormal.getNombreNotificationsAgentQualitePourValidation()
  ]).subscribe({
    next: ([countSoudure, countTorsadage, countSertissageIDC, countSertissageNormal]) => {
      const total = countSoudure + countTorsadage + countSertissageIDC + countSertissageNormal;
      this.setNombreNotifications(total); // ⬅️ MISE À JOUR ici !
      console.log('Total notifications agent qualite:', total);
    },
    error: (err: any) => {
      console.error('Erreur lors de la récupération des notifications :', err);
    }
  });
}


   // operationUser = localStorage.getItem('operation') || '';

   recupererNombreNotificationsTousProcessSaufPistoletChefLigne() {
    const operation = this.operationUser;

    const handle = (val: number) => {
      this.setNombreNotifications(val);
      console.log(`Notifications ${operation} :`, val);
    };

    switch (operation) {
      case 'Soudure':
        this.serviceSoudure.getNombreNotificationsChefDeLigne().subscribe(handle);
        break;
      case 'Torsadage':
        this.serviceTorsadage.getNombreNotificationsChefDeLigne().subscribe(handle);
        break;
      case 'Sertissage_IDC':
        this.serviceSertissageIDC.getNombreNotificationsChefDeLigne().subscribe(handle);
        break;
      case 'Sertissage_Normal':
        this.serviceSertissageNormal.getNombreNotificationsChefDeLigne().subscribe(handle);
        break;
    }
  }
}

    
