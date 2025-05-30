import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { OperateurErreurDTO } from 'src/app/Modeles/OperateurErreurDTO';
import { OperateurErreurPistolet } from 'src/app/Modeles/OperateurErreurPistolet';
import { StatProcessus } from 'src/app/Modeles/StatProcessus';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {

  hommes$ = new BehaviorSubject<number>(0);
  femmes$ = new BehaviorSubject<number>(0);
  total$ = new BehaviorSubject<number>(0);
  pourcentageAugmentation$ = new BehaviorSubject<number>(0);
  erreurs$= new BehaviorSubject<number>(0);
  pourcentageErreurs$ = new BehaviorSubject<number>(0);
  private apiUrl = 'http://localhost:8281/statistiques'; 

  constructor(private http: HttpClient) {}

  getNombreOperateurs(): Observable<number> {
    const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      
    return this.http.get<number>(`${this.apiUrl}/nombre-operateurs`, { headers });
  }

  getNombreHommes(): Observable<number> {
    const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });      
    return this.http.get<number>(`${this.apiUrl}/nombre-operateurs-hommes`, { headers });
  }

  getNombreFemmes(): Observable<number> {
    const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });    
    return this.http.get<number>(`${this.apiUrl}/nombre-operateurs-femmes`, { headers });
  }


  getPourcentatgesAugmentations(): Observable<number> {
    const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      
    return this.http.get<number>(`${this.apiUrl}/pourcentage-augmentation`, { headers });
  }

  fetchAllStats(): void {
    forkJoin({
      hommes: this.getNombreHommes(),
      femmes: this.getNombreFemmes(),
      total: this.getNombreOperateurs(),
      pourcentage: this.getPourcentatgesAugmentations(),
    }).subscribe(({ hommes, femmes, total, pourcentage }) => {
      this.hommes$.next(hommes);
      this.femmes$.next(femmes);
      this.total$.next(total);
      this.pourcentageAugmentation$.next(pourcentage);
    });
  }
  getNombresErreursCetteSemaine(): Observable<number> {
    const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      
    return this.http.get<number>(`${this.apiUrl}/erreurs-semaine`, { headers });
  }

  getPourcentagesErreursCetteSemaine(): Observable<number> {
    const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      
    return this.http.get<number>(`${this.apiUrl}/pourcentage-erreurs-semaine`, { headers });
  }

  getPdekCountByType() : Observable<{ [key: string]: number }> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/pdek-count-by-type`, { headers });
  }

  getPlanActionCountByType():  Observable<{ [key: string]: number }> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/planAction-count-by-type`, { headers });
  }

  getTop5OperateursErreurs(): Observable<OperateurErreurDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get<OperateurErreurDTO[]>('http://localhost:8281/statistiques/top5-operateurs-erreurs',
      { headers }
    );
  }
  

  getStatsParProcessus(plant: string): Observable<StatProcessus[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const params = new HttpParams().set('plant', plant);
    return this.http.get<StatProcessus[]>(`${this.apiUrl}/par-processus`, { params  , headers});
  }

  getStatsTorsadage(plant: string, segment: number): Observable<StatProcessus[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'}); 
    const params = new HttpParams()
      .set('plant', plant)
      .set('segment', segment);
    return this.http.get<StatProcessus[]>(`${this.apiUrl}/chart-torsadage`, { params , headers});
  }

  getStatsSoudure(plant: string, segment: number): Observable<StatProcessus[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'}); 
    const params = new HttpParams()
      .set('plant', plant)
      .set('segment', segment);
    return this.http.get<StatProcessus[]>(`${this.apiUrl}/chart-soudure`, { params , headers});
  }

  getStatsSertissageIDC(plant: string, segment: number): Observable<StatProcessus[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'}); 
    const params = new HttpParams()
      .set('plant', plant)
      .set('segment', segment);
    return this.http.get<StatProcessus[]>(`${this.apiUrl}/chart-sertissage-idc`, { params , headers});
  }

  getStatsSertissageNormal(plant: string, segment: number): Observable<StatProcessus[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'}); 
    const params = new HttpParams()
      .set('plant', plant)
      .set('segment', segment);
    return this.http.get<StatProcessus[]>(`${this.apiUrl}/chart-sertissage-normal`, { params , headers});
  }

  fetchAllStatsErreursProcess(): void {
    forkJoin({
      erreurs: this.getNombresErreursCetteSemaine(),
      pourcentageErreurs: this.getPourcentagesErreursCetteSemaine(),
    }).subscribe(({ erreurs, pourcentageErreurs }) => {
      this.erreurs$.next(erreurs);
      this.pourcentageErreurs$.next(pourcentageErreurs);
    });
  }

}
