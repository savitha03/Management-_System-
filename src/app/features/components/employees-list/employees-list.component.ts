import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-employees-list',
  imports: [AgGridModule,CommonModule],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent {
  isDarkMode = false;

  @Input()colDefs: any
  @Input()rowData:any
}
