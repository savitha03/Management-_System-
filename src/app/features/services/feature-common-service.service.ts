import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureCommonServiceService {
  private appUrl = environment.socketUrl;

  constructor(private http: HttpClient) {}

  getDropdownLists(code: string) {
    return this.http.get(`${this.appUrl}/api/common/code-type/${code}`);
  }

  getTeamDropdownLists(type:string){
    return this.http.get(`${this.appUrl}/api/common/team-type/${type}`);
  }

  getEmployeeNameDropdownLists(){
    return this.http.get(`${this.appUrl}/api/common/names`)
  }

  //   getEmployeeNameDropdownLists(p0:string): Observable<EmployeeName[]>{
  //   let queryParams = new HttpParams();
  //   queryParams=queryParams.append('empCode',p0)
  //   return this.http.get<EmployeeName[]>(`${this.appUrl}/api/common/names`,{params:queryParams})
  // }
}
