import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  private appUrl=environment.socketUrl

  constructor( private http:HttpClient) { }

  getEmployeeDetails(){
    return this.http.get(`${this.appUrl}/api/Employee/view-employee-details`).pipe(
         map((response: any) =>
          response.status === 2 ? response.data : throwError(() => new Error(response.message)),
            ),
            catchError((error: any) => throwError(error)),
          );
  }

  saveEmployeeDetails(userData:any){
    return this.http.post(`${this.appUrl}/api/Employee/add-employee-details`,userData).pipe(
        map((response: any) =>
          response.status === 2 ? response.data : throwError(response.message),
        ),
        catchError((error: any) => throwError(error)),
      );
  }

  updateEmployeeDetails(userData:any){
    return this.http.put(`${this.appUrl}/api/Employee/update-employee-details`,userData).pipe(
        map((response: any) =>
          response.status === 2 ? response.data : throwError(response.message),
        ),
        catchError((error: any) => throwError(error)),
      );
  }

}
