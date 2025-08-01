import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';


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
    return this.http.post(`${this.appUrl}/api/LeaveManagement/apply`,userData).pipe(
    map((data:any)=>(data)))}

  getEmployeeLeaveHistory(p0: string): Observable<LeaveRecord[]> {
   let queryParams = new HttpParams();
   queryParams=queryParams.append('empCode',p0)
  return this.http.get<LeaveRecord[]>(`${this.appUrl}/api/LeaveManagement/my-history`,{params:queryParams});
}

  getUsersLeaveHistory():Observable<any>{
    return this.http.get(`${this.appUrl}/api/LeaveManagement/users-history`);
  }

  UpdateEmployeeLeaveRequest(updateUser:any){
    return this.http.put(`${this.appUrl}/api/LeaveManagement/update-leave`,updateUser);
  }

  DeleteEmployeeLeaveRequest(deleteUser:any){
    return this.http.put(`${this.appUrl}/api/LeaveManagement/delete-leave`,deleteUser);
  }

  getUsersLeaveRequestHistory():Observable<any>{
    return this,this.http.get(`${this.appUrl}/api/LeaveManagement/leave-action`);
  }
}
