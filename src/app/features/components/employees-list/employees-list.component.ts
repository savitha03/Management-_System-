// import { CommonModule } from '@angular/common';
// import { Component, Input } from '@angular/core';
// import { AgGridModule } from 'ag-grid-angular';

// @Component({
//   selector: 'app-employees-list',
//   imports: [AgGridModule,CommonModule],
//   templateUrl: './employees-list.component.html',
//   styleUrl: './employees-list.component.css'
// })
// export class EmployeesListComponent {
//   isDarkMode = false;

//   @Input()colDefs: any
//   @Input()rowData:any
// }
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';
import { filter } from 'rxjs';
import { DiceComponentComponent } from '../../../shared/components/dice-component/dice-component.component';
import { FormsModule } from '@angular/forms';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-employees-list',
  imports: [AgGridModule, FormsModule],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css',
})
export class EmployeesListComponent implements OnInit {
  @Input() filterType: any;
  @Input() colDefs: ColDef[] = [];
  @Input() rowData: any[] = [];
  @Input() defaultColDefs: any;
  @Input() gridApi: any;
  @Input() gridColumnApi: any;
  @Input() gridOptions!: GridOptions;
  @Input() isNewEmployee:any;
  @Output() gridReady = new EventEmitter<any>();
  @Output() applicationEventService = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}


  private emitRowClicked(rowData: any) {
    this.applicationEventService.emit({
      name: 'ROW_CLICKED',
      component: 'EmployeesListComponent',
      value: { selectedRow: rowData },
    });
  }

  onRowClicked(events: any): void {
    const event: any = {
      name: 'ROW_CLICKED',
      component: 'EmployeesListComponent',
      value: {
        selectedRow: events.data,
      },
    };
    this.applicationEventService.emit(event);
  }

  toggleActiveFilter() {
    const event: any = {
      name: 'TOGGLE_ACTIVE',
      component: 'EmployeesListComponent',
      value: {
        filterType: this.filterType,
      },
    };
    this.applicationEventService.emit(event);
  }

  newUser() {
    const event = {
      name: 'NEW_EMPLOYEE',
      component: 'EmployeesListComponent',
      value: null,
    };
    this.applicationEventService.emit(event);
  }


}
