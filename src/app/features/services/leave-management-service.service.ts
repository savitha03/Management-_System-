import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagementServiceService {

  private appUrl = environment.socketUrl

  constructor(private http:HttpClient) { }

  saveEmployeeLeaveRequest(userData:any){
    return this.http.post(`${this.appUrl}/api/LeaveManagement/apply`,userData).pipe(
    map((data:any)=>(data)))}

  getEmployeeLeaveHistory(){
    return this.http.get(`${this.appUrl}/api/LeaveManagement/my-history`);
  }
  getUsersLeaveHistory(){
    return this.http.get(`${this.appUrl}/api/LeaveManagement/users-history`);
  }
  // UpdateEmployeeLeaveRequest(){
  //   return this.http.put(`${this.appUrl}/api/LeaveManagement/update-leave`);
  // }
  // DeleteEmployeeLeaveRequest(){
  //   return this.http.put(`${this.appUrl}/api/LeaveManagement/delete-leave`);
  // }
}
