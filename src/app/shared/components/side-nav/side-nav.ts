import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmploymentDetailsComponent } from '../../../features/components/employment-details/employment-details.component';

export interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-side-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  isCollapsed = false;
  mainMenu: MenuItem[] = [
    // {
    //   label: 'Dashboard',
    //   icon: 'bi bi-grid-fill',
    //   link: 'dashboard',
    // },
    {
      label:'Personal-Details',
      icon:'	bi bi-card-heading',
      link:'personal-details'
    },
    {
      label:'Employement Details',
      icon:'bi bi-person-badge',
      link:'employement-details'
    },
    {
      label: 'Employees List ',
      icon: 'bi bi-person-lines-fill',
      link: 'employees',
    },
    {
      label: 'Leave Management',
      icon: 'bi bi-kanban-fill',
      link: 'leave',
      children: [
        {
          label: 'Apply Leave',
          icon: 'bi bi-pencil-square small text-muted',
          link: 'leaves/apply-leave',
        },
        {
          label: 'My Leaves',
          icon: 'bi bi-person-check small text-muted',
          link: 'leaves/my-leaves',
        },
        {
          label: 'Leave History',
          icon: 'bi bi-clock-history small text-muted',
          link: 'leaves/history',
        },
        {
          label: 'Leave Summary',
          icon: '	bi bi-file-earmark-text-fill small text-muted',
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

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
