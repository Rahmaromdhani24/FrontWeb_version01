import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';
import { Torsadage } from 'src/app/Modeles/Torsadage';
import { GeneralService } from '../Géneral/general.service';

@Injectable({
  providedIn: 'root'
})
export class TorsadageService {
  private _generalService: GeneralService;

  constructor(private http: HttpClient, private injector: Injector) {}

  private get general(): GeneralService {
    if (!this._generalService) {
      this._generalService = this.injector.get(GeneralService);
    }
    return this._generalService;
  }

   validerTorsadage(id: number, matriculeAgent: number) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const params = new HttpParams()
        .set('id', id)
        .set('matriculeAgentQualite', matriculeAgent);
    
      return this.http.put(
        `http://localhost:8281/operations/torsadage/validerTorsadage`,
        {}, // corps vide
        { headers, params }
      );
    }
    
      getNombreNotificationsAgentQualitePourValidation(): Observable<number> {
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.http.get<number>('http://localhost:8281/operations/torsadage/nbrNotificationsAgentsQualite',
            { headers }
          );
        }


        getNombreNotificationsChefDeLigne(): Observable<number> {
          const token = localStorage.getItem('token');
          
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.http.get<number>('http://localhost:8281/operations/torsadage/nbrNotificationsTechniciens',
            { headers }
          );
        }
        getTorsadagesNonValideesAgentsQualite(): Observable<Torsadage[]> {
          const token = localStorage.getItem('token'); 
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.http.get<Torsadage[]>('http://localhost:8281/operations/torsadage/torsadages-non-validees-agents-Qualite', { headers });
        }
    
        getTorsadagesNonValideesChefDeLigne(): Observable<Torsadage[]> {
          const token = localStorage.getItem('token'); 
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.http.get<Torsadage[]>('http://localhost:8281/operations/torsadage/torsadages-non-validees-plan-action', { headers });
        }
    
        
    
        recupererListeTorsadagesesNonValidesAgentQualite() {
          this.getTorsadagesNonValideesAgentsQualite().subscribe({
            next: (data) => {
              this.general.donnees = this.general.donnees.concat(data);
              console.error('liste dans service torsadage :', data);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des pistolets :', err);
            }
          });
        }
        
        recupererListeTorsadagesesNonValidesChefDeLigne() {
          this.getTorsadagesNonValideesChefDeLigne().subscribe({
            next: (data) => {
              this.general.donnees = this.general.donnees.concat(data);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des pistolets :', err);
            }
          });
        }
        
            getTorsadagesParPdekEtPage(pdekId: number, pageNumber: number): Observable<Torsadage[]> {
                const token = localStorage.getItem('token'); 
              
                const headers = new HttpHeaders({
                  'Authorization': `Bearer ${token}`
                });
              
                const params = new HttpParams()
                  .set('pdekId', pdekId.toString())
                  .set('pageNumber', pageNumber.toString());
              
                return this.http.get<Torsadage[]>(
                  'http://localhost:8281/operations/torsadage/torsadages-par-pdek-et-page',
                  { headers, params }
                );
              }
              
}
