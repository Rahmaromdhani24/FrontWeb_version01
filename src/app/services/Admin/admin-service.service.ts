import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operateur } from 'src/app/Modeles/Operateur';
import { User } from 'src/app/Modeles/User';
import { Users } from 'src/app/Modeles/Users';
import { OutilContact } from 'src/app/Modeles/OutilContact';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http: HttpClient) { }
 

  private urlGetUser = 'http://localhost:8281/admin/getUser';
  getAdmin(matricule: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.urlGetUser}/${matricule}`, { headers });
  }
 getPlants(): Observable<string[]> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
  return this.http.get<string[]>('http://localhost:8281/superAdmin/plants', { headers });
}

   addOperateur(user: Operateur): Observable<any> {
      const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });    
    return this.http.post('http://localhost:8281/admin2/addOperateur', user , { headers });
  }

   addUser(user: Users): Observable<any> {
      const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });    
    return this.http.post('http://localhost:8281/admin2/addUser', user , { headers });
  }


   getAllOperateurs(): Observable<Operateur[]> {
          const token = localStorage.getItem('token');
           const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' });   
      return this.http.get<Operateur[]>('http://localhost:8281/admin2/getOperateurs', { headers });
}

updateOperateur(matricule: number, user: any): Observable<Operateur> {
   const token = localStorage.getItem('token');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });   
  return this.http.put<Operateur>(`http://localhost:8281/admin2/updateOperateur/${matricule}`, user, { headers });
}

updateUtilisateur(matricule: number, user: any): Observable<Users> {
   const token = localStorage.getItem('token');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });   
  return this.http.put<Users>(`http://localhost:8281/admin2/updateUtilisateur/${matricule}`, user, { headers });
}

 private urlGetUserr = 'http://localhost:8281/admin2/getOperateur';
  getOperateur(matricule: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.urlGetUserr}/${matricule}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

   private urlGetUtilisateur = 'http://localhost:8281/admin2/user';
  getUtilisateur(matricule: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.urlGetUtilisateur}/${matricule}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
    getAllUsers(): Observable<Users[]> {
          const token = localStorage.getItem('token');
           const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' });   
      return this.http.get<Users[]>('http://localhost:8281/admin2/getUtilisateursSaufOperateur', { headers });
    }

     addOutilContact(outil: OutilContact): Observable<OutilContact> {
        const token = localStorage.getItem('token');
           const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' });   
    return this.http.post<OutilContact>(`http://localhost:8281/admin2/outilContactAdd`, outil, { headers });
  }
}