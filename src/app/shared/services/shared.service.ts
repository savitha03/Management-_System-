import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private ProfileSubject$ = new BehaviorSubject<any>(null);
  private ValidationSliderSubject$ = new BehaviorSubject<any>(false);

  constructor() {}

  setProfileSubject(profile: any) {
    this.ProfileSubject$.next(profile);
  }

  getProfileSubject() {
    return this.ProfileSubject$.asObservable();
  }

  setValidationSliderSubject(validation:any){
    this.ValidationSliderSubject$.next(validation);
  }

  getValidationSliderSubject(){
    return this.ValidationSliderSubject$.asObservable();
  }
}
