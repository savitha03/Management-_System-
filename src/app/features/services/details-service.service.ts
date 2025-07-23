import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DetailsServiceService {
  private appUrl = environment.socketUrl;

  constructor(private http: HttpClient) {}

  getEmployeePersonalDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/personal/employee/${empId}`);
  }

  getEmployeeContactDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/personal/contact/${empId}`);
  }
  getEmployeeTeamDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/personal/team/${empId}`);
  }

  getEmployeeJobDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/employment/job/${empId}`);
  }
  getEmployeeSalaryDetails(empId: any) {
    return this.http.get(`${this.appUrl}/api/employment/salary/${empId}`);
  }
}
