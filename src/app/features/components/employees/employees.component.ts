import { Component } from '@angular/core';
import { EmployeesListComponent } from "../employees-list/employees-list.component";
import { EmployeesFormComponent } from "../employees-form/employees-form.component";
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-employees',
  imports: [EmployeesListComponent, EmployeesFormComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  public colDefs:ColDef[]=[
    {
      headerName:'',
      field:'diceMenu',
      width:50
    },
    {
      headerName:'Emp ID',
      field:'empId',
      width:100
    },
    {
      headerName:'Emp Name',
      field:'empName',
      width:340
    }
  ]

  rowData=[
    {
      empId:'ST1176',
      empName:'Vigneshwaran Thiruselvam'
    },
    {
      empId:'T2506',
      empName:'Savitha Bharathidasan'
    },
    {
      empId:'T2503',
      empName:'Ravi Shankar Sivakumar'
    }
  ]
}
