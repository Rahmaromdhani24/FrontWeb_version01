import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';
import { Soudure } from 'src/app/Modeles/Soudure';
import { GeneralService } from '../Géneral/general.service';


@Injectable({
  providedIn: 'root'
})
export class SoudureService {

  constructor(private http: HttpClient , private general : GeneralService) {}

  private urlGetEtenduMax = "http://localhost:8281/operations/soudure/etenduMax";
  getEtenduMax(sectionFil: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const encodedSection = encodeURIComponent(sectionFil);
    return this.http.get(`${this.urlGetEtenduMax}/${encodedSection}`, {
      headers,
      responseType: 'text' // toujours nécessaire si l'API retourne une String brute
    }).pipe(
      map((response: string) => parseFloat(response)), // conversion en number
      catchError(error => throwError(() => error.message || 'Erreur serveur'))
    );
  }
  

  private  urlGetMoyenneMin = "http://localhost:8281/operations/soudure/valeurMoyenneVertMin" ; 
  getMoyenneMin(sectionFil: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const encodedSection = encodeURIComponent(sectionFil);

    return this.http.get(`${this.urlGetMoyenneMin}/${encodedSection}`, {
      headers,
      responseType: 'text'
    }).pipe(
      map((response: string) => parseFloat(response)), // conversion en number
      catchError(error => throwError(() => error.message || 'Erreur serveur'))
    );
  }

  private  urlGetMoyenneMax = "http://localhost:8281/operations/soudure/valeurMoyenneVertMax" ; 
  getMoyenneMax(sectionFil: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const encodedSection = encodeURIComponent(sectionFil);

    return this.http.get(`${this.urlGetMoyenneMax}/${encodedSection}`, {
      headers,
      responseType: 'text'
    }).pipe(
      map((response: string) => parseFloat(response)), // conversion en number
      catchError(error => throwError(() => error.message || 'Erreur serveur'))
    );
  
  }

  private urlGetPelageValeur = "http://localhost:8281/operations/soudure/pelage/nombre";
  getPelageValeur(sectionFil: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const encodedSection = encodeURIComponent(sectionFil);
    return this.http.get(`${this.urlGetPelageValeur}/${encodedSection}`, {
      headers,
      responseType: 'text' // car le backend retourne une String
    }).pipe(
      map((response: string) => parseFloat(response)), // conversion en number
      catchError(error => throwError(() => error.message || 'Erreur serveur'))
    );
  }
  


  getNombreNotificationsAgentQualitePourValidation(): Observable<number> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<number>('http://localhost:8281/operations/soudure/nbrNotificationsAgentsQualite',
        { headers }
      );
    }
    getNombreNotificationsChefDeLigne(): Observable<number> {
      const token = localStorage.getItem('token');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<number>('http://localhost:8281/operations/soudure/nbrNotificationsTechniciens',
        { headers }
      );
    }
    getSouduresNonValideesAgentsQualite(): Observable<Soudure[]> {
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<Soudure[]>('http://localhost:8281/operations/soudure/soudures-non-validees-agents-Qualite', { headers });
    }

    getSouduresNonValideesChefDeLigne(): Observable<Soudure[]> {
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<Soudure[]>('http://localhost:8281/operations/soudure/soudures-non-validees-plan-action', { headers });
    }

    

    recupererListeSouudresNonValidesAgentQualite() {
      this.getSouduresNonValideesAgentsQualite().subscribe({
        next: (data) => {
          this.general.donnees = this.general.donnees.concat(data);
          console.error('liste dans service soudure :', data);

        },
        error: (err) => {
          console.error('Erreur lors de la récupération des pistolets :', err);
        }
      });
    }
    recupererListeSouudresNonValidesChefDeLigne() {
      this.getSouduresNonValideesChefDeLigne().subscribe({
        next: (data) => {
          this.general.donnees = this.general.donnees.concat(data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des pistolets :', err);
        }
      });
    }
       validerSoudure(id: number, matriculeAgent: number) {
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          const params = new HttpParams()
            .set('id', id)
            .set('matriculeAgentQualite', matriculeAgent);
        
          return this.http.put(
            `http://localhost:8281/operations/soudure/validerSoudure`,
            {}, // corps vide
            { headers, params }
          );
        }

        getSouduresParPdekEtPage(pdekId: number, pageNumber: number): Observable<Soudure[]> {
            const token = localStorage.getItem('token'); 
          
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`
            });
          
            const params = new HttpParams()
              .set('pdekId', pdekId.toString())
              .set('pageNumber', pageNumber.toString());
          
            return this.http.get<Soudure[]>(
              'http://localhost:8281/operations/soudure/soudures-par-pdek-et-page',
              { headers, params }
            );
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
