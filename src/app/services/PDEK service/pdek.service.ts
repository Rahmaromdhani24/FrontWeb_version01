import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContenuPagePdekDTO } from 'src/app/Modeles/ContenuPagePdekDTO';

@Injectable({
  providedIn: 'root'
})
export class PdekService {

  constructor(private http: HttpClient) { }

  private uriPdekGeneral ='http://localhost:8281/pdek' ; 
  private apiUrlGetContenuParPage = 'http://localhost:8281/pdek/contenu-par-page'; 
  getContenuParPage(pdekId: number): Observable<ContenuPagePdekDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ContenuPagePdekDTO[]>(`${this.apiUrlGetContenuParPage}/${pdekId}`, { headers });
  }

  getPdekById(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // ou sessionStorage, selon ton système
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.uriPdekGeneral}/${id}`, { headers });
  }
}
