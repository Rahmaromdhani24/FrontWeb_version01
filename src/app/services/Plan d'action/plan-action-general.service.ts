import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanActionDTO } from 'src/app/Modeles/PlanActionDTO';
import {DetailsPlanAction} from 'src/app/Modeles/DetailsPlanAction' ; 
import { User } from 'src/app/Modeles/User';
@Injectable({
  providedIn: 'root'
})
export class PlanActionGeneralService {

  constructor(private http: HttpClient) { }


  private baseUrlTesterPdekPossedePlanAction = 'http://localhost:8281/planAction';
  testerPdekPossedePlanAction(pdekId: number): Observable<PlanActionDTO | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PlanActionDTO | null>(`${this.baseUrlTesterPdekPossedePlanAction}/testerPdek/${pdekId}`, { headers });
  }

  testerAllTypesPdeksSaufPistolet(pdekId: number): Observable<PlanActionDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<PlanActionDTO[]>(
      `http://localhost:8281/planAction/testerAllTypesPdeksSaufPistolet/${pdekId}`,
      { headers }
    );
  }

  getDetailsByPlanActionId(id: number): Observable<DetailsPlanAction[]> {
    const token = localStorage.getItem('token'); 
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<DetailsPlanAction[]>(`http://localhost:8281/planAction/${id}/details`, { headers });
  }
  
  private apiUrlGetPlansByTypeOperation = 'http://localhost:8281/planAction/plansActions'; 
  getPlansByTypeOperation(typeOperation: string): Observable<PlanActionDTO[]> {
    const token = localStorage.getItem('token'); // ou sessionStorage selon ton système
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PlanActionDTO[]>(
      `${this.apiUrlGetPlansByTypeOperation}/${typeOperation}`,
      { headers }
    );
  }

  private apiGetUsersByPlanActionId = 'http://localhost:8281/planAction/users-by-planAction';
  getUsersByPlanActionId(planActionId: number): Observable<User[]> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User[]>(`${this.apiGetUsersByPlanActionId}/${planActionId}`, { headers });
  }
}