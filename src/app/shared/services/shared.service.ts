import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private ProfileSubject$ = new BehaviorSubject<any>(null);

  constructor() {}

  setProfileSubject(profile: any) {
    this.ProfileSubject$.next(profile);
  }

  getProfileSubject() {
    return this.ProfileSubject$.asObservable();
  }
}
