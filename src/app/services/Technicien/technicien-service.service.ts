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



  private baseUrl ='http://localhost:8281/planAction/addPlanAtcion'
  ajouterPlanAction(pagePdekId: number, userId: number, details: DetailsPlanAction): Observable<any> {
    const url = `${this.baseUrl}/${pagePdekId}/ajouter/${userId}`;
    return this.http.post(url, details);
  }
}
