import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from 'src/app/Modeles/Projet';


@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  private apiUrl = 'http://localhost:8281/admin2'; // à adapter selon ton backend

  constructor(private http: HttpClient) {}

  // GET : tous les projets
  getAllProjets(): Observable<Projet[]> {
      const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' });   
    return this.http.get<Projet[]>(`${this.apiUrl}/getProjets`, { headers });
  }

  // POST : ajouter un projet
  createProjet(projet: Projet): Observable<Projet> {
       const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' });  
    return this.http.post<Projet>(`${this.apiUrl}`, projet, { headers });
  }

  // PUT : modifier un projet
  updateProjet(id: number, projet: Projet): Observable<Projet> {
       const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' });  
    return this.http.put<Projet>(`${this.apiUrl}/projet/${id}`, projet, { headers });
  }

  // DELETE : supprimer un projet
  deleteProjet(id: number): Observable<void> {
       const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' });  
    return this.http.delete<void>(`${this.apiUrl}/projet/${id}`, { headers });
  }

 getProjetById(id: number): Observable<Projet> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' });  
    return this.http.get<Projet>(`${this.apiUrl}/projet/${id}`, { headers });
  }
}
