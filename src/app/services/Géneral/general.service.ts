import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { Soudure } from 'src/app/Modeles/Soudure';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }
  nbrNotifications: number ; 
  pistolets: Pistolet[] = [];
  donnees: any[] = [];

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

}