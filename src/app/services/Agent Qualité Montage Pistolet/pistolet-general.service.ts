import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdekResultat } from 'src/app/Modeles/PdekResultat';
import { Pistolet } from 'src/app/Modeles/Pistolet';

@Injectable({
  providedIn: 'root'
})
export class PistoletGeneralService {

  constructor(private http: HttpClient) {}

  etat : string ; 
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
      .set('matriculeAgentDeQualite', matriculeAgent);
  
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

  getPistoletsNonValidees(): Observable<Pistolet[]> {
    const token = localStorage.getItem('token'); // récupère le token depuis le local storage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Pistolet[]>('http://localhost:8281/operations/pistolet/pistolets-non-validees', { headers });
  }

  etatPistolet( etendu : number ,  moyenne :number,  typePistolet : string):any{
    /* Pistolet Rouge */
    if(typePistolet==="PISTOLET_ROUGE"){
      if(etendu< 12 && (moyenne>131 && moyenne< 149)){
        this.etat="vert" ; 
      } if(etendu< 12 && ((moyenne> 125 && moyenne<= 131) || (moyenne>= 149 && moyenne< 166))){
        this.etat="jaune" ; 
      } if(etendu< 12 && ((moyenne<= 125 ) || (moyenne>= 166))){
        this.etat="rouge" ; 
      }
      if(etendu>=12){
        this.etat="rouge" ;      }
      }

       /* Pistolet Vert  */
   if(typePistolet==="PISTOLET_VERT"){
    
    if(etendu< 12 && (moyenne>88 && moyenne< 112)){
      this.etat="vert" ; 
    } if(etendu< 12 && ((moyenne> 80 && moyenne<= 88) || (moyenne>= 112 && moyenne< 120))){
      this.etat="jaune" ; 
    } if(etendu< 12 && ((moyenne<= 80 ) || (moyenne>= 120))){
      this.etat="rouge" ; 
    }
    if(etendu>=12){
      this.etat="rouge" ;      }
    } 
     /* Pistolet Jaune */
    if(typePistolet==="PISTOLET_JAUNE"){
      if(etendu< 3 && (moyenne>35 && moyenne< 45)){
        this.etat="vert" ; 
      } if(etendu< 3 && ((moyenne> 34 && moyenne<= 35) || (moyenne>= 45 && moyenne< 46))){
        this.etat="jaune" ; 
      } if(etendu< 3 && ((moyenne<= 34 ) || (moyenne>= 46))){
        this.etat="rouge" ; 
      }
      if(etendu>=3){
        this.etat="rouge" ;      }
    } 
      /* Pistolet Bleu  */
    if(typePistolet==="PISTOLET_BLEU"){
      if(etendu< 6 && (moyenne>56 && moyenne< 74)){
        this.etat="vert" ; 
      } if(etendu< 6 && ((moyenne> 50 && moyenne<= 56) || (moyenne>= 74 && moyenne< 80))){
        this.etat="jaune" ; 
      } if(etendu< 6 && ((moyenne<= 50 ) || (moyenne>= 80))){
        this.etat="rouge" ; 
      }
      if(etendu>=6){
        this.etat="rouge" ;      }
    }
  }
} 