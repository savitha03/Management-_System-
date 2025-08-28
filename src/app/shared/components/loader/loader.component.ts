import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="isLoading">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex; justify-content: center; align-items: center;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9999;
    }
    .spinner {
      width: 50px; height: 50px;
      border: 5px solid #ccc;
      border-top-color: #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class LoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription!: Subscription;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.subscription = this.loaderService.loading$.subscribe(
      isLoading => this.isLoading = isLoading
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
