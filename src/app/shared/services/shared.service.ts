import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private ProfileSubject$ = new BehaviorSubject<any>(null);
  private ValidationSliderSubject$ = new BehaviorSubject<any>(false);
  private ValidationSubject$ = new BehaviorSubject<any>(null);

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

  setValidationSubject(errors:any){
    this.ValidationSubject$.next(errors);
  }

  getValidationSubject(){
    return this.ValidationSubject$.asObservable();
  }
}
