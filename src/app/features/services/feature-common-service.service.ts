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

  getTimeDropDown(){
    return this.http.get(`${this.appUrl}/api/common/GetTimeDropDown`);
  }
}
