import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;
  private delayTimeout: any;

show() {
    this.requestCount++;
    if (!this.delayTimeout) {
      this.delayTimeout = setTimeout(() => {
        this.loadingSubject.next(true);
        this.delayTimeout = null;
      }, 300); // 200ms delay
    }
  }

   hide() {
    this.requestCount--;
    if (this.requestCount === 0) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
      this.loadingSubject.next(false);
    }
  }
}
