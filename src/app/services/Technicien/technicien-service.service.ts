import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailsPlanAction } from 'src/app/Modeles/DetailsPlanAction';
import { EmailPistoletRequest } from 'src/app/Modeles/EmailPistoletRequest';
import { PdekResultat } from 'src/app/Modeles/PdekResultat';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { User } from 'src/app/Modeles/User';
@Injectable({
  providedIn: 'root'
})
export class TechnicienServiceService {

  constructor(private http: HttpClient) {}



  private baseUrl = 'http://localhost:8281/planAction/addPlanAction';

  ajouterPlanAction(pdekId: number, numeroPage: number, details: DetailsPlanAction, userId: number, 
                    numeroPistolet: number,typePistolet: string, categoriePistolet: string): Observable<any> {
    const url = `${this.baseUrl}/${pdekId}/${numeroPage}/${userId}/${numeroPistolet}/${typePistolet}/${categoriePistolet}`;
    const token = localStorage.getItem('token'); // Assure-toi que le token est bien stocké
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(url, details, { headers });
  }
  
}
