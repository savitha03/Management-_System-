import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { SideNav } from '../../../shared/components/side-nav/side-nav';
import { TopNav } from '../../../shared/components/top-nav/top-nav';
import { SharedService } from '../../../shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-feature-container',
  imports: [RouterModule, TopNav, SideNav, CommonModule,NgScrollbarModule],
  templateUrl: './feature-container.html',
  styleUrl: './feature-container.css',
})
export class FeatureContainer implements OnInit {
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
    private sharedService: SharedService
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
        this.authService.logout();
        this.router.navigate(['auth']);
        break;
      }
    }
  }

  
}
