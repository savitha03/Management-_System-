import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GooseMenuService {
  
 private appUrl=environment.socketUrl

 constructor( private http:HttpClient) {}

  
  getGooseMenu(empCode:any):Observable<any>{
    return this.http.get(`${this.appUrl}/api/GooseMenu/hierarchical-menu/${empCode}`).pipe(
         map((response: any) =>
          response.status === 2 ? response.data : throwError(() => new Error(response.message)),
            ),
            catchError((error: any) => throwError(error)),
          );
  }
}

