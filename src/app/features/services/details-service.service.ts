import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailsServiceService {
  private appUrl = environment.socketUrl;

  constructor(private http: HttpClient) {}

  getEmployeePersonalDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/personal/employee/${empId}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
     
  }

  getEmployeeContactDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/personal/contact/${empId}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
  }
  getEmployeeTeamDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/personal/team/${empId}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
  }

  getEmployeeJobDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/employment/job/${empId}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
  }
  getEmployeeSalaryDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/employment/salary/${empId}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
  }
}
