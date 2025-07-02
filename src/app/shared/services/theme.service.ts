import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);

  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {}

  setDarkMode(isDark: any) {
    this.darkModeSubject.next(isDark);
  }
}
