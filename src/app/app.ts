import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,NgbTimepickerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'hr-app';


}
