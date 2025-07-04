import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

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

  constructor(private router: Router) {
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
  }

  toggleLeaveMenu(): void {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
    this.saveState();
  }

  saveState(): void {
    localStorage.setItem('isLeaveMenuOpen', String(this.isLeaveMenuOpen));
  }

  mainMenu: MenuItem[] = [
    {
      label: 'Personal-Details',
      icon: 'bi bi-card-heading',
      link: 'personal-details',
    },
    {
      label: 'Employement Details',
      icon: 'bi bi-person-badge',
      link: 'employement-details',
    },
    {
      label: 'Employees List ',
      icon: 'bi bi-person-lines-fill',
      link: 'employees',
    },
    {
      label: 'Leave Management',
      icon: 'bi bi-kanban-fill',
      children: [
        {
          label: 'Apply Leave',
          icon: 'bi bi-pencil-square small text-muted',
          link: 'leaves/apply-leave',
        },
        {
          label: 'Leave History',
          icon: 'bi bi-clock-history small text-muted',
          link: 'leaves/history',
        },
        {
          label: 'Users Leave History',
          icon: 'bi bi-person-check small text-muted',
          link: 'leaves/users-leave-history',
        },
        {
          label: 'Leave Summary',
          icon: 'bi bi-file-earmark-text-fill small text-muted',
          link: 'leaves/leave-summary',
        },
      ],
    },
    {
      label: 'Announcements',
      icon: 'bi bi-megaphone-fill',
      link: 'announcements',
    },
  ];

  bottomMenu: MenuItem[] = [
    {
      label: 'Notifications',
      icon: 'bi bi-bell-fill',
      link: 'notifications',
    },
    {
      label: 'Settings',
      icon: 'bi bi-gear-fill',
      link: 'settings',
    },
  ];
}
