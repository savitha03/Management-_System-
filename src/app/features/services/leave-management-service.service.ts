import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';


interface LeaveRecord {
  empCode: string;
  typeName: string;
  fromDate: string;
  toDate: string;
  duration: string;
  status: string;
  reason: string;
}
@Injectable({
  providedIn: 'root'
})

export class LeaveManagementServiceService {
  
  private appUrl = environment.socketUrl


  constructor(private http:HttpClient) { }

  saveEmployeeLeaveRequest(userData:any){
    return this.http.post(`${this.appUrl}/api/LeaveManagement/leave/apply`,userData).pipe(
       map((response: any) =>
        response.status === 2 ? response.data : throwError(() => new Error(response.message)),
          ),
          catchError((error: any) => throwError(error)),
        );
      }

  getEmployeeLeaveHistory(empCode:any): Observable<LeaveRecord[]> {
  return this.http.get<LeaveRecord[]>(`${this.appUrl}/api/LeaveManagement/my-history/${empCode}`).pipe(
       map((response: any) =>
        response.status === 2 ? response.data : throwError(() => new Error(response.message)),
          ),
          catchError((error: any) => throwError(error)),
        );
}

  getUsersLeaveHistory(empCode:any):Observable<any>{
    return this.http.get(`${this.appUrl}/api/LeaveManagement/users-history/${empCode}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
  }

  UpdateEmployeeLeaveRequest(updateUser:any){
    return this.http.put(`${this.appUrl}/api/LeaveManagement/update-leave`,updateUser).pipe(
        map((response: any) =>
          response.status === 2 ? response.data : throwError(response.message),
        ),
        catchError((error: any) => throwError(error)),
      );
  }

  DeleteEmployeeLeaveRequest(deleteUser:any){
    return this.http.put(`${this.appUrl}/api/LeaveManagement/delete-leave`,deleteUser).pipe(
        map((response: any) =>
          response.status === 2 ? response.data : throwError(response.message),
        ),
        catchError((error: any) => throwError(error)),
      );;
  }

  getUsersLeaveRequestHistory(empCode:any):Observable<any>{
    return this.http.get(`${this.appUrl}/api/LeaveManagement/leave-request/${empCode}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
  }

  userLeaveRequestActionUpdate(userData:{ LeavePK: number; Action: string }){
    return this.http.post(`${this.appUrl}/api/LeaveManagement/leave-action/update`,userData).pipe(
      map((data:any)=>(data)))}
  
  getMyLeaveSummary(empCode: string): Observable<any> {
  return this.http.get(`${this.appUrl}/api/LeaveManagement/my-leave-summary/${empCode}`).pipe(
     map((response: any) =>
      response.status === 2 ? response.data : throwError(() => new Error(response.message)),
        ),
        catchError((error: any) => throwError(error)),
      );
}

}