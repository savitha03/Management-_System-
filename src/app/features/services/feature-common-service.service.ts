import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureCommonServiceService {
  private appUrl = environment.socketUrl;

  constructor(private http: HttpClient) {}

  getDropdownLists(code: string) {
    return this.http.get(`${this.appUrl}/api/common/code-type/${code}`).pipe(
         map((response: any) =>
          response.status === 2 ? response.data : throwError(() => new Error(response.message)),
            ),
            catchError((error: any) => throwError(error)),
          );
  }

  getTeamDropdownLists(type:string){
    return this.http.get(`${this.appUrl}/api/common/team-type/${type}`).pipe(
         map((response: any) =>
          response.status === 2 ? response.data : throwError(() => new Error(response.message)),
            ),
            catchError((error: any) => throwError(error)),
          );
  }

  getEmployeeNameDropdownLists(){
    return this.http.get(`${this.appUrl}/api/common/names`).pipe(
         map((response: any) =>
          response.status === 2 ? response.data : throwError(() => new Error(response.message)),
            ),
            catchError((error: any) => throwError(error)),
          );
  }

  //   getEmployeeNameDropdownLists(p0:string): Observable<EmployeeName[]>{
  //   let queryParams = new HttpParams();
  //   queryParams=queryParams.append('empCode',p0)
  //   return this.http.get<EmployeeName[]>(`${this.appUrl}/api/common/names`,{params:queryParams})
  // }
}
