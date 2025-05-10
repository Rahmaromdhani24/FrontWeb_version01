import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';
import { NonNullableFormBuilder } from '@angular/forms';
import { GeneralService } from '../Géneral/general.service';
import { SertissageNormal } from 'src/app/Modeles/SertissageNormal';
import { User } from 'src/app/Modeles/User';

@Injectable({
  providedIn: 'root'
})
export class SertissageNormalService {
  private _generalService: GeneralService;
  
    constructor(private http: HttpClient ,
                private injector: Injector ) {}
  
  private get general(): GeneralService {
    if (!this._generalService) {
      this._generalService = this.injector.get(GeneralService);
    }
    return this._generalService;
  }
  validerSertissageNormal(id: number, matriculeAgent: number) {
      const token = localStorage.getItem('token');
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      const params = new HttpParams()
        .set('id', id)
        .set('matriculeAgentQualite', matriculeAgent);
    
      return this.http.put(
        `http://localhost:8281/operations/SertissageNormal/validerSertissage`,
        {}, // corps vide
        { headers, params }
      );
    }
    
    private urlChargerTraction = 'http://localhost:8281/operations/SertissageNormal';
    getTractionValeur(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<string> {
      const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });      
      const params = new HttpParams()
        .set('numeroOutil', numeroOutil)
        .set('numeroContact', numeroContact)
        .set('sectionFil', sectionFil);
      return this.http.get<string>(this.urlChargerTraction + '/traction', {
        headers,
        params,
        responseType: 'text' as 'json' 
      });
    }
    


getToleranceHauteurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<string> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get(this.urlChargerTraction + '/ToleranceHauteurIsolant', {headers , params, responseType: 'text' });
}

getToleranceLargeurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<string> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get(this.urlChargerTraction + '/ToleranceLargeurIsolant', {headers , params, responseType: 'text' });
}

getHauteurSertissage(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<number> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get<number>(this.urlChargerTraction + '/hauteurSertissage', {headers , params });
}

getLargeurSertissage(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<number> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get<number>(this.urlChargerTraction + '/largeurSertissage', {headers , params });
}

getToleranceLargeurSertissage(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<string> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get(this.urlChargerTraction + '/ToleranceLargeurSertissage', {headers , params, responseType: 'text' });
}

getHauteurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<number> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get<number>(this.urlChargerTraction + '/hauteurSertissage', {headers , params });
}

getLargeurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): Observable<number> {
  const token = localStorage.getItem('token');   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });    
  const params = new HttpParams()
    .set('numeroOutil', numeroOutil)
    .set('numeroContact', numeroContact)
    .set('sectionFil', sectionFil);

  return this.http.get<number>(this.urlChargerTraction + '/largeurSertissage', {headers , params });
}

   getSertissagesParPdekEtPage(pdekId: number, pageNumber: number): Observable<SertissageNormal[]> {
              const token = localStorage.getItem('token');   
              const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`  });
              const params = new HttpParams()
                .set('pdekId', pdekId)
                .set('pageNumber', pageNumber);           
              return this.http.get<SertissageNormal[]>(
                'http://localhost:8281/operations/SertissageNormal/sertissages-par-pdek-et-page',
                { headers, params }
              );
            }
            
  getNombreNotificationsAgentQualitePourValidation(): Observable<number> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<number>('http://localhost:8281/operations/SertissageNormal/nbrNotificationsAgentsQualite',
          { headers }
        );
      }
      getNombreNotificationsChefDeLigne(): Observable<number> {
        const token = localStorage.getItem('token');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<number>('http://localhost:8281/operations/SertissageNormal/nbrNotificationsChefLigne',
          { headers }
        );
      }

      getSertissagesNormalNonValideesAgentsQualite(): Observable<SertissageNormal[]> {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<SertissageNormal[]>('http://localhost:8281/operations/SertissageNormal/sertissages-non-validees-agents-Qualite', { headers });
      }
            
      getSertissagesNormalNonValideesChefDeLigne(): Observable<SertissageNormal[]> {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<SertissageNormal[]>('http://localhost:8281/operations/SertissageNormal/sertissages-non-validees-plan-action', { headers });
      }
    
        recupererListeSertissagesIDCNonValidesAgentQualite() {
          this.getSertissagesNormalNonValideesAgentsQualite().subscribe({
            next: (data) => {
              this.general.donnees = this.general.donnees.concat(data);
              console.error('liste dans service sertissages  :', data);   
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des sertissages :', err);
            }
          });
        }

        recupererListeSertissagesIDCNonValidesChefDeLigne() {
          this.getSertissagesNormalNonValideesChefDeLigne().subscribe({
            next: (data) => {
              this.general.donnees = this.general.donnees.concat(data);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des sertissages :', err);
            }
          });
        }
 getSertissagessIDCParPdekEtPage(pdekId: number, pageNumber: number): Observable<SertissageNormal[]> {
          const token = localStorage.getItem('token'); 
        
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
        
          const params = new HttpParams()
            .set('pdekId', pdekId.toString())
            .set('pageNumber', pageNumber.toString());
        
          return this.http.get<SertissageNormal[]>(
            'http://localhost:8281/operations/SertissageNormal/sertissages-par-pdek-et-page',
            { headers, params }
          );
        }
              private baseUrl = 'http://localhost:8281/operations/SertissageNormal';
                 getUsersByPdek(pdekId: number): Observable<User[]> {
                   const token = localStorage.getItem('token'); // récupère le token depuis le local storage
               
                   const headers = new HttpHeaders({
                     'Authorization': `Bearer ${token}`
                   });
               
                   return this.http.get<User[]>(`${this.baseUrl}/users-by-pdek/${pdekId}`, { headers });
                 } 
                       
              genererMessageEtatAllProcess(etat: string): string {
                switch (etat) {
                  case 'vert':
                    return 'Attente de votre validation immédiate.';
                  case 'jaune':
                    return 'Zone jaune détectée : une vérification peut être nécessaire.';
                  case 'rouge':
                    return 'Zone rouge détectée : intervention immédiate requise.';
                  default:
                    return 'État inconnu.';
                }
              }
}
