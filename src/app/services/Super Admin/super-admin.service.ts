import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Admin } from 'src/app/Modeles/Admin';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  constructor(private http: HttpClient) {}


  getPlants(): Observable<string[]> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
  return this.http.get<string[]>('http://localhost:8281/superAdmin/plants', { headers });
}

   addAdmin(admin: Admin): Observable<any> {
      const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });    
    return this.http.post('http://localhost:8281/superAdmin/addUserAdmin', admin , { headers });
  }

    getAllAdmins(): Observable<Admin[]> {
        const token = localStorage.getItem('token');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });   
    return this.http.get<Admin[]>('http://localhost:8281/superAdmin/admins', { headers });
  }

  deleteUser(matricule: number): Observable<any> {
     const token = localStorage.getItem('token');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });   
  return this.http.delete(`http://localhost:8281/superAdmin/deleteUser/${matricule}`,  { responseType: 'text' , headers });
}

updateUser(matricule: number, user: any): Observable<Admin> {
   const token = localStorage.getItem('token');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' });   
  return this.http.put<Admin>(`http://localhost:8281/superAdmin/updateUser/${matricule}`, user, { headers });
}

  private urlGetUser = 'http://localhost:8281/superAdmin/getUser';
  getUser(matricule: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.urlGetUser}/${matricule}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

    countAdmins(): Observable<number> {
       const token = localStorage.getItem('token');
    return this.http.get<number>(`http://localhost:8281/superAdmin/count-admins`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

      countUsersParRole(role : string): Observable<number> {
       const token = localStorage.getItem('token');
    return this.http.get<number>(`http://localhost:8281/superAdmin/count-users/${role}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


    private baseUrl = 'http://localhost:8281/superAdmin/count-users';
 getUserCountByTypeAdmin(typeAdmin: string): Observable<Map<string, number[]>> {
     const token = localStorage.getItem('token');
    return this.http.get<Map<string, number[]>>(`${this.baseUrl}/${typeAdmin}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
