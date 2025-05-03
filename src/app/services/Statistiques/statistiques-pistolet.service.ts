import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { OperateurErreurDTO } from 'src/app/Modeles/OperateurErreurDTO';
import { OperateurErreurPistolet } from 'src/app/Modeles/OperateurErreurPistolet';
import { StatPistolet } from 'src/app/Modeles/StatPistolet';
import { StatProcessus } from 'src/app/Modeles/StatProcessus';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesPistoletService {

  private apiUrl = 'http://localhost:8281/statistiques'; 

 erreurs$= new BehaviorSubject<number>(0);
  pourcentageErreurs$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}
  getNombresErreursPistoleCetteSemaine(): Observable<number> {
      const token = localStorage.getItem('token'); 
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });       
      return this.http.get<number>(`${this.apiUrl}/nombreErreursPistoletsCetteSemaine`, { headers });
    }
  
    getPourcentagesErreursPistoletCetteSemaine(): Observable<number> {
      const token = localStorage.getItem('token'); 
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });    
      return this.http.get<number>(`${this.apiUrl}/pourcentageErreursPistoletsCetteSemaine`, { headers });
    }

 fetchAllStatsErreursProcessPistolet(): void {
    forkJoin({
      erreurs: this.getNombresErreursPistoleCetteSemaine(),
      pourcentageErreurs: this.getPourcentagesErreursPistoletCetteSemaine(),
    }).subscribe(({ erreurs, pourcentageErreurs }) => {
      this.erreurs$.next(erreurs);
      this.pourcentageErreurs$.next(pourcentageErreurs);
    });
  }

    getTop5OperateursPistoletsErreurs(): Observable<OperateurErreurPistolet[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' });  
      return this.http.get<OperateurErreurPistolet[]>('http://localhost:8281/statistiques/topOperateursPistolets',
        { headers }
      );
    }
    
     getPdekPistoletCountByType() : Observable<StatPistolet[] > {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.get<StatPistolet[] >(`${this.apiUrl}/pistolet/stats-par-couleur-et-categorie`, { headers });
      }
    
      getPlanActionCountByType():  Observable<{ [key: string]: number }> {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/planActionPistolet-by-year`, { headers });
      }
    
   
    
      getStatsParProcessus(plant: string): Observable<StatProcessus[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        const params = new HttpParams().set('plant', plant);
        return this.http.get<StatProcessus[]>(`${this.apiUrl}/pistolet-statistiques-par-plant`, { params  , headers});
      }
    /******************** chart pdek pistolet ***************************/
    getChartDataForPistolet(): Observable<{ series: any[], categories: string[] }> {
      return forkJoin({
        pdek: this.getPdekPistoletCountByType(),
        plans: this.getPlanActionCountByType()
      }).pipe(
        map(({ pdek, plans }) => {
          const types = ['Rouge', 'Vert', 'Jaune', 'Bleu'];
          const categories = ['Mécanique', 'Pneumatique'];
    
          const pdekMap = new Map<string, number>();
          pdek.forEach(item => {
            const couleurFormatted = item.couleur.replace('PISTOLET_', '').toLowerCase();
            const couleurCap = couleurFormatted.charAt(0).toUpperCase() + couleurFormatted.slice(1);
            const key = `${couleurCap}_${item.categorie}`;
            pdekMap.set(key, item.nombrePdek);
          });
    
          const plansMap = new Map<string, number>();
          Object.entries(plans).forEach(([key, value]) => {
            plansMap.set(key, value as number);
          });
    
          const finalCategories: string[] = [];
          const pdekData: number[] = [];
          const plansData: number[] = [];
    
          for (const type of types) {
            for (const cat of categories) {
              const label = `${type} - ${cat}`;
              finalCategories.push(label);
              const keyPdek = `${type}_${cat}`;
              const keyPlan = `PISTOLET_${type.toUpperCase()} - ${cat}`;
              pdekData.push(pdekMap.get(keyPdek) ?? 0);
              plansData.push(plansMap.get(keyPlan) ?? 0);
            }
          }
    
          return {
            categories: finalCategories,
            series: [
              { name: 'Nombre PDEKs', data: pdekData, color: '#0085db' },
              { name: 'Nombre Plans Actions', data: plansData, color: '#fb977d' },
            ]
          };
        })
      );
    }
    
}
