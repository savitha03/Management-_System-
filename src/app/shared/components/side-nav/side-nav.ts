import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { GooseMenuService } from '../../services/gooseMenu.service';
import { GetMainMenuItems } from 'ag-grid-community';
import { selectAuthUser } from '../../../auth/store/auth/login.selectors';
import { Store } from '@ngrx/store';
import {
  IApplicationEvent,
  SharedService,
} from '../../services/shared.service';

export interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav implements OnInit {
  isCollapsed = false;
  isLeaveMenuOpen = false;

  loggedInUser: any;

  mainMenu: MenuItem[] = [];
  bottomMenu: MenuItem[] = [];
  hasValidationErrors: any;

  constructor(
    private router: Router,
    private gooseMenu: GooseMenuService,
    private store: Store,
    private sharedService: SharedService
  ) {
    this.store.select(selectAuthUser).subscribe((user: any) => {
      if (user) {
        this.loggedInUser = user;
      }
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.isLeaveMenuOpen = currentUrl.includes('/leaves/');
        this.saveState(); // persist current state
      });
  }

  ngOnInit(): void {
    // Restore saved state from localStorage
    const saved = localStorage.getItem('isLeaveMenuOpen');
    this.isLeaveMenuOpen = saved === 'true';

    const empCode = this.loggedInUser.empCode;
    this.gooseMenu.getGooseMenu(empCode).subscribe((menu) => {
      // console.log('Received menu:', menu);
      const mainMenuItems = menu?.['MAINMENU'] ?? [];
      const bottomMenuItems = menu?.['BOTTOMMENU'] ?? [];

      this.mainMenu = mainMenuItems
        .filter((item: any) => !item.Hidden && !item.Disabled)
        .map(this.mapToMenuItem);

      this.bottomMenu = bottomMenuItems
        .filter((item: any) => !item.Hidden && !item.Disabled)
        .map(this.mapToMenuItem);
    });
  }

  private mapToMenuItem = (item: any): MenuItem => ({
    label: item.LinkTitle,
    icon: this.getIcon(item.LinkTitle),
    link: item.LinkPath,
    children: item.Children?.length
      ? item.Children.filter(
          (child: any) => !child.Hidden && !child.Disabled
        ).map((child: any) => ({
          label: child.LinkTitle,
          icon: this.getIcon(child.LinkTitle),
          link: child.LinkPath,
        }))
      : [],
  });

  private getIcon(title: string): string {
    const icons: Record<string, string> = {
      'Personal Details': 'bi bi-card-heading',
      'Employment Details': 'bi bi-person-badge',
      'Employees List': 'bi bi-person-lines-fill',
      'Leave Management': 'bi bi-kanban-fill',
      'Apply Leave': 'bi bi-pencil-square small text-muted',
      'Users Leave Request': 'bi bi-envelope-exclamation small text-muted',
      'My Leave History': 'bi bi-clock-history small text-muted',
      'Users Leave History': 'bi bi-person-check small text-muted',
      'Leave Summary': 'bi bi-file-earmark-text-fill small text-muted',
      Announcements: 'bi bi-megaphone-fill',
      Notifications: 'bi bi-bell-fill',
      Settings: 'bi bi-gear-fill',
    };
    return icons[title] ?? 'bi bi-circle';
  }

  toggleLeaveMenu(): void {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
    this.saveState();
  }

  saveState(): void {
    localStorage.setItem('isLeaveMenuOpen', String(this.isLeaveMenuOpen));
  }

  emitRouterAction(item: any) {
    const event: IApplicationEvent = {
      name: 'NAVIGATED_BY_MENU',
      component: 'SideNav',
      value: item.link,
    };
    this.sharedService.emitAnEvent(event);
  }

  handleMenuClick(event: MouseEvent, item: MenuItem) {
    // event.preventDefault(); // stop default routerLink navigation
    this.emitRouterAction(item);

    // Example: Get validation status from shared service or state
    this.sharedService.getIsValidation().subscribe((value: any) => {
      this.hasValidationErrors = value;
    });
    // const hasValidationErrors = this.sharedService.hasValidationErrors(); // create this in your service
    if (this.hasValidationErrors) {
      console.warn('Navigation blocked due to validation errors.');
      return;
    }

    // Navigate manually if allowed

    if (item.link) {
      this.router.navigate(this.getRouterLink(item.link));
      this.clearValidation();
    }
  }

  clearValidation() {
    this.sharedService.setValidationSubject(null);
    this.sharedService.setValidationSliderSubject(false);
  }

  getRouterLink(link?: string): any[] {
    if (!link) return ['/simplesolve/management'];
    return ['/simplesolve/management', ...link.split('/')];
  }
  isActive(item: MenuItem): boolean {
    if (!item.link) return false;
    return this.router.isActive(this.getRouterLink(item.link).join('/'), {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
