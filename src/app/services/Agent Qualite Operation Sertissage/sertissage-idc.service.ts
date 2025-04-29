import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';
import { SertissageIDC } from 'src/app/Modeles/SertissageIDC';

@Injectable({
  providedIn: 'root'
})
export class SertissageIDCService {
  constructor(private http: HttpClient) { }

  validerSertissageIDC(id: number, matriculeAgent: number) {
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` });   
      const params = new HttpParams()
        .set('id', id)
        .set('matriculeAgentQualite', matriculeAgent);   
      return this.http.put(
        `http://localhost:8281/operations/SertissageIDC/validerSertissageIDC`,
        {}, // corps vide
        { headers, params }
      );
    }
    


    getSertissagesParPdekEtPage(pdekId: number, pageNumber: number): Observable<SertissageIDC[]> {
              const token = localStorage.getItem('token');   
              const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`  });
              const params = new HttpParams()
                .set('pdekId', pdekId.toString())
                .set('pageNumber', pageNumber.toString());           
              return this.http.get<SertissageIDC[]>(
                'http://localhost:8281/operations/SertissageIDC/sertissages-par-pdek-et-page',
                { headers, params }
              );
            }
                  
}
