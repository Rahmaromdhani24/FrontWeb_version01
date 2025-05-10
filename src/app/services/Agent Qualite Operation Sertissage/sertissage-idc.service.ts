import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';
import { SertissageIDC } from 'src/app/Modeles/SertissageIDC';
import { GeneralService } from '../Géneral/general.service';
import { User } from 'src/app/Modeles/User';

@Injectable({
  providedIn: 'root'
})
export class SertissageIDCService {

   private _generalService: GeneralService;
  
    constructor(private http: HttpClient ,
                private injector: Injector ) {}
  
  private get general(): GeneralService {
    if (!this._generalService) {
      this._generalService = this.injector.get(GeneralService);
    }
    return this._generalService;
  }
  validerSertissageIDC(id: number, matriculeAgent: number) {
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` });   
      const params = new HttpParams()
        .set('id', id)
        .set('matriculeAgentQualite', matriculeAgent);   
      return this.http.put(
        `http://localhost:8281/operations/SertissageIDC/validerSertissageIDC`,
        {}, // corps vide
        { headers, params }
      );
    }
    


    getSertissagesParPdekEtPage(pdekId: number, pageNumber: number): Observable<SertissageIDC[]> {
              const token = localStorage.getItem('token');   
              const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`  });
              const params = new HttpParams()
                .set('pdekId', pdekId)
                .set('pageNumber', pageNumber);           
              return this.http.get<SertissageIDC[]>(
                'http://localhost:8281/operations/SertissageIDC/sertissages-par-pdek-et-page',
                { headers, params }
              );
            }
            
  getNombreNotificationsAgentQualitePourValidation(): Observable<number> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<number>('http://localhost:8281/operations/SertissageIDC/nbrNotificationsAgentsQualite',
          { headers }
        );
      }
      getNombreNotificationsChefDeLigne(): Observable<number> {
        const token = localStorage.getItem('token');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<number>('http://localhost:8281/operations/SertissageIDC/nbrNotificationsChefLigne',
          { headers }
        );
      }

      getSertissagesIDCNonValideesAgentsQualite(): Observable<SertissageIDC[]> {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<SertissageIDC[]>('http://localhost:8281/operations/SertissageIDC/sertissagesIDC-non-validees-agents-Qualite', { headers });
      }
            
      getSertissagesIDCNonValideesChefDeLigne(): Observable<SertissageIDC[]> {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<SertissageIDC[]>('http://localhost:8281/operations/SertissageIDC/sertissagesIDC-non-validees-plan-action', { headers });
      }
    
        recupererListeSertissagesIDCNonValidesAgentQualite() {
          this.getSertissagesIDCNonValideesAgentsQualite().subscribe({
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
          this.getSertissagesIDCNonValideesChefDeLigne().subscribe({
            next: (data) => {
              this.general.donnees = this.general.donnees.concat(data);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des sertissages :', err);
            }
          });
        }

    validerSertissagesIDC(id: number, matriculeAgent: number) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const params = new HttpParams()
        .set('id', id)
        .set('matriculeAgentQualite', matriculeAgent);
    
      return this.http.put(
        `http://localhost:8281/operations/SertissageIDC/validerSertissageIDC`,
        {}, // corps vide
        { headers, params }
      );
    }

      getSertissagessIDCParPdekEtPage(pdekId: number, pageNumber: number): Observable<SertissageIDC[]> {
          const token = localStorage.getItem('token'); 
        
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
        
          const params = new HttpParams()
            .set('pdekId', pdekId.toString())
            .set('pageNumber', pageNumber.toString());
        
          return this.http.get<SertissageIDC[]>(
            'http://localhost:8281/operations/SertissageIDC/sertissages-par-pdek-et-page',
            { headers, params }
          );
        }
        
         private baseUrl = 'http://localhost:8281/operations/SertissageIDC';
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
