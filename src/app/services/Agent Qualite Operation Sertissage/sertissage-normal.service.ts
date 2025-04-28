import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SertissageNormalService {
  constructor(private http: HttpClient) { }

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


}
