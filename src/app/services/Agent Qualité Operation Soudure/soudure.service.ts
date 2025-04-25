import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SoudureService {

  constructor(private http: HttpClient) { }

  private urlGetEtenduMax = "http://localhost:8281/operations/soudure/etenduMax";
  getEtenduMax(sectionFil: number): Observable<number> {
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
  getMoyenneMin(sectionFil: number): Observable<number> {
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
  getMoyenneMax(sectionFil: number): Observable<number> {
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
  getPelageValeur(sectionFil: number): Observable<number> {
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
  
}
