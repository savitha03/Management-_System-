import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-top-nav',
  standalone: true, // Since you use imports here
  imports: [CommonModule],
  templateUrl: './top-nav.html',
  styleUrls: ['./top-nav.css'], // fix typo here
})
export class TopNav implements OnInit {
  @Output() actionEmitter = new EventEmitter();
  profile$:any;
  isDarkMode = false;
  profile:any;

  constructor(private themeService: ThemeService,private sharedService: SharedService) {
    this.profile$=this.sharedService.getProfileSubject();
     this.profile$?.subscribe((data:any)=>{
      if(data){
        this.profile= data;
        console.log(this.profile)
      }
    })
  }

  ngOnInit(): void {
    // 1. Check if user saved preference
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // 2. If no saved preference, use system preference
      this.isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }
    this.themeService.setDarkMode(this.isDarkMode);
    this.updateBodyClass();

    // 3. Listen for system changes and update only if no saved preference
    if (!savedTheme) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          this.isDarkMode = e.matches;
          this.updateBodyClass();
        });
    }
  }

  updateBodyClass() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  logout() {
    const payload = {
      type: 'LOGOUT',
    };
    this.actionEmitter.emit(payload);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
    this.updateBodyClass();

    // Save user preference explicitly
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
