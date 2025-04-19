import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailPistoletRequest } from 'src/app/Modeles/EmailPistoletRequest';
import { PdekResultat } from 'src/app/Modeles/PdekResultat';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { User } from 'src/app/Modeles/User';

@Injectable({
  providedIn: 'root'
})
export class PistoletGeneralService {

  constructor(private http: HttpClient) {}

  getDernierNumeroCycle(typePistolet: string, numPistolet: number, categorie: string, segment: number, nomPlant: string): Observable<number> {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const params = new HttpParams()
      .set('typePistolet', typePistolet)
      .set('numPistolet', numPistolet.toString())
      .set('categorie', categorie)
      .set('segment', segment.toString())
      .set('nomPlant', nomPlant); // enum ou string
  
    return this.http.get<number>(
      `http://localhost:8281/operations/pistolet/dernier-numero-cycle`,
      { params, headers }
    );
  }
  
  getPistoletsParPdekEtPage(pdekId: number, pageNumber: number): Observable<Pistolet[]> {
    const token = localStorage.getItem('token'); // récupère le token depuis le localStorage
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const params = new HttpParams()
      .set('pdekId', pdekId.toString())
      .set('pageNumber', pageNumber.toString());
  
    return this.http.get<Pistolet[]>(
      'http://localhost:8281/operations/pistolet/pistolets-par-pdek-et-page',
      { headers, params }
    );
  }
  
  validerPistolet(id: number, matriculeAgent: number) {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const params = new HttpParams()
      .set('id', id)
      .set('matriculeAgentQualite', matriculeAgent);
  
    return this.http.put(
      `http://localhost:8281/operations/pistolet/validerPistolet`,
      {}, // corps vide
      { headers, params }
    );
  }
  

  getPdekByTypeOperation(typeOperation: string): Observable<PdekResultat[]> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<PdekResultat[]>(
      `http://localhost:8281/pdek/pdeks/${typeOperation}`,
      { headers }
    );
  }
  getNombreNotifications(): Observable<number> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<number>('http://localhost:8281/operations/pistolet/nbrNotifications',
      { headers }
    );
  }
  getNombreNotificationsTechniciens(): Observable<number> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<number>('http://localhost:8281/operations/pistolet/nbrNotificationsTechniciens',
      { headers }
    );
  }
  getPistoletsNonValidees(): Observable<Pistolet[]> {
    const token = localStorage.getItem('token'); // récupère le token depuis le local storage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Pistolet[]>('http://localhost:8281/operations/pistolet/pistolets-non-validees', { headers });
  }
  getPistoletsNonValideesTechniciens(): Observable<Pistolet[]> {
    const token = localStorage.getItem('token'); // récupère le token depuis le local storage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Pistolet[]>('http://localhost:8281/operations/pistolet/pistolets-non-validees-plan-action', { headers });
  }
  
  getPistoletInformations(numeroPistolet: number, type: string, categorie: string): Observable<Pistolet> {
    const token = localStorage.getItem('token'); 
    const params = new HttpParams()
      .set('numeroPistolet', numeroPistolet.toString())
      .set('type', type)
      .set('categorie', categorie);
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

    return this.http.get<Pistolet>('http://localhost:8281/operations/pistolet/pistolet', { params , headers });
  }
  getTechniciens(nomPlant: string, segment: number, operation: string): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const params = new HttpParams()
      .set('nomPlant', nomPlant)
      .set('segment', segment.toString())
      .set('operation', operation);
  
    return this.http.get<User[]>('http://localhost:8281/operateur/TechniciensParPlantEtSegment', { headers, params });
  }
  
  sendWarningEmail(request: EmailPistoletRequest): Observable<any> {
    const token = localStorage.getItem('token'); // récupère le token JWT depuis localStorage
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}) ;     
    return this.http.post('http://localhost:8281/admin/TechnicienSendMailWarning', request, {
      headers,
      responseType: 'text' as 'json'  
    });
  }

  sendErreurEmail(request: EmailPistoletRequest): Observable<any> {
  const token = localStorage.getItem('token'); // récupère le token JWT depuis localStorage
  const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
  return this.http.post<string>('http://localhost:8281/admin/TechnicienSendMailErreur', request, {
    headers,
    responseType: 'text' as 'json'  
  });
}
  etatPistolet(etendu: number, moyenne: number, typePistolet: string): string {
    if (typePistolet === "PISTOLET_ROUGE") {
      if (etendu < 12 && (moyenne > 131 && moyenne < 149)) return "vert";
      if (etendu < 12 && ((moyenne > 125 && moyenne <= 131) || (moyenne >= 149 && moyenne < 166))) return "jaune";
      return "rouge";
    }
  
    if (typePistolet === "PISTOLET_VERT") {
      if (etendu < 12 && (moyenne > 88 && moyenne < 112)) return "vert";
      if (etendu < 12 && ((moyenne > 80 && moyenne <= 88) || (moyenne >= 112 && moyenne < 120))) return "jaune";
      return "rouge";
    }
  
    if (typePistolet === "PISTOLET_JAUNE") {
      if (etendu < 3 && (moyenne > 35 && moyenne < 45)) return "vert";
      if (etendu < 3 && ((moyenne > 34 && moyenne <= 35) || (moyenne >= 45 && moyenne < 46))) return "jaune";
      return "rouge";
    }
  
    if (typePistolet === "PISTOLET_BLEU") {
      if (etendu < 6 && (moyenne > 56 && moyenne < 74)) return "vert";
      if (etendu < 6 && ((moyenne > 50 && moyenne <= 56) || (moyenne >= 74 && moyenne < 80))) return "jaune";
      return "rouge";
    }
  
    return "inconnu";
  }
  
} 