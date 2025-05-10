import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ContenuPagePdekDTO } from 'src/app/Modeles/ContenuPagePdekDTO';
import { PlanActionDTO } from 'src/app/Modeles/PlanActionDTO';
import { PDEK } from 'src/app/Modeles/Pdek';
import { PdekAvecPlans } from 'src/app/Modeles/PdekAvecPlans';

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

  getContenuParNumeroPage(pdekId: number, numeroPage: number): Observable<ContenuPagePdekDTO[]> {
    return this.getContenuParPage(pdekId).pipe(
      map((pages) => {
        const pageTrouvee = pages.find(page => page.numeroPage === numeroPage);
        return pageTrouvee ? pageTrouvee.contenu : [];
      })
    );
  }
  /**********************************************************************************/
  getPdeksEnServiceAvecPlans(typeOperation: string): Observable<PdekAvecPlans[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get<PdekAvecPlans[]>(
      `http://localhost:8281/pdek/pdekEnServiceAvecPlans/${typeOperation}`,
      { headers }
    );
  }
/**************************************************************************/ 
    testerAllTypesPdeksSaufPistolet(pdekId: number): Observable<PlanActionDTO[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`});
      return this.http.get<PlanActionDTO[]>(
        `http://localhost:8281/planAction/testerAllTypesPdeksSaufPistolet/${pdekId}`,
        { headers }
      );
    }
getPdeks(typeOperation: string): Observable<PDEK[]> {
    const token = localStorage.getItem('token');   
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` });
      return this.http.get<PDEK[]>(
      `http://localhost:8281/pdek/pdeksAllSaufPistolet/${typeOperation}`,
      { headers }
    );
  }
  private types = ['Soudure', 'Torsadage', 'Sertissage_IDC', 'Sertissage_Normal'];
  getAllPdeksAvecPlanAction(): Observable<PDEK[]> {
    const observablesParType = this.types.map(type => this.getPdeks(type));

    return forkJoin(observablesParType).pipe(
      map(listes => listes.flat()), // aplatir les listes par type en une seule
      switchMap(pdeks =>
        forkJoin(
          pdeks.map(pdek =>
            this.testerAllTypesPdeksSaufPistolet(pdek.id).pipe(
              catchError(err => {
                console.error(`Erreur lors du plan d'action pour PDEK ${pdek.id}`, err);
                pdek.planAction = [];
                return of([]);
              }),
              map(planActions => {
                pdek.planAction = planActions;
                return pdek;
              })
            )
          )
        )
      )
    );
  }
}
