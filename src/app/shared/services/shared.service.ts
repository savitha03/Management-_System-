import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface IApplicationEvent {
  name: string;
  component: string;
  value: any;
}


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private ProfileSubject$ = new BehaviorSubject<any>(null);
  private ValidationSliderSubject$ = new BehaviorSubject<any>(false);
  private ValidationSubject$ = new BehaviorSubject<any>(null);
  private IsValidation$ = new BehaviorSubject<any>(false);

  private _appEvent = new Subject<IApplicationEvent>();

  appEvent$ = this._appEvent.asObservable();

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

  emitAnEvent(appEvent: IApplicationEvent) {
    this._appEvent.next(appEvent);
  }

  setIsValidation(errors:any){
    this.IsValidation$.next(errors);
  }

  getIsValidation(){
    return this.IsValidation$.asObservable();
  }

}
