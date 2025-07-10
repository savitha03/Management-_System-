import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { SharedService } from '../../shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private loginApi = `${environment.socketUrl}/api/Login`;

  

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  login(payLoad: any) {
    return this.http
      .post(`${this.loginApi}`, payLoad)
      .pipe(
        map((data: any) => {
          if (data) {
            this.setsessionStorage(data);
            return data;
          }
          return null;
        })
      );
  }

  setsessionStorage(data: any) {
    this.sharedService.setProfileSubject(data);
    sessionStorage.setItem('userLoginCredential', JSON.stringify(data));
  }

  logout() {
    sessionStorage.removeItem('userLoginCredential');
  }
}
