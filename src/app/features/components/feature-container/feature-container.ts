import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { SideNav } from '../../../shared/components/side-nav/side-nav';
import { TopNav } from '../../../shared/components/top-nav/top-nav';
import { SharedService } from '../../../shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { logout } from '../../../auth/store/auth/login.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-feature-container',
  imports: [RouterModule, TopNav, SideNav, CommonModule,NgScrollbarModule],
  templateUrl: './feature-container.html',
  styleUrl: './feature-container.css',
})
export class FeatureContainer implements OnInit , OnDestroy {
  public validationSlider$: any;
  public validationErrors$: any;
  validationErrors: any;
  isOpen = false;

  togglePanel(): void {
    this.sharedService.setValidationSliderSubject(!this.isOpen);
  }
  constructor(
    private authService: Auth,
    private router: Router,
    private sharedService: SharedService,
    private store:Store
  ) {}

  ngOnInit() {
    this.validationSlider$ = this.sharedService.getValidationSliderSubject();
    this.validationSlider$?.subscribe((data: any) => {
      this.isOpen = data;
    });

    this.validationErrors$ = this.sharedService.getValidationSubject();
    this.validationErrors$?.subscribe((data: any) => {
      this.validationErrors = data;
    });
    
  }

  emitter(event: any) {
    switch (event.type) {
      case 'LOGOUT': {
        // this.authService.logout();
        this.store.dispatch(logout());
        this.router.navigate(['auth']);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.sharedService.setValidationSliderSubject(null);
    this.sharedService.setValidationSubject(null);
    this.sharedService.setIsValidation(null);
  }
}
