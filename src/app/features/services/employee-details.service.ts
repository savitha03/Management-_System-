import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  private appUrl=environment.socketUrl

  constructor( private http:HttpClient) { }

  getEmployeeDetails(){
    return this.http.get(`${this.appUrl}/api/Employee/view-employee-details`);
  }

  saveEmployeeDetails(userData:any){
    return this.http.post(`${this.appUrl}/api/Employee/add-employee-details`,userData).pipe(
      map((data:any)=>(data)))
  }

  updateEmployeeDetails(userData:any){
    return this.http.put(`${this.appUrl}/api/Employee/update-employee-details`,userData).pipe(
      map((data:any)=>(data)))
  }

}
