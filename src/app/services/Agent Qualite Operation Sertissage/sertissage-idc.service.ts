import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  , map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SertissageIDCService {
  constructor(private http: HttpClient) { }

  validerSertissageIDC(id: number, matriculeAgent: number) {
      const token = localStorage.getItem('token');
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      const params = new HttpParams()
        .set('id', id)
        .set('matriculeAgentQualite', matriculeAgent);
    
      return this.http.put(
        `http://localhost:8281/operations/SertissageIDC/validerSertissageIDC`,
        {}, // corps vide
        { headers, params }
      );
    }
    
}
