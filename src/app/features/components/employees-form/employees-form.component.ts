import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-employees-form',
  imports: [ReactiveFormsModule,CommonModule, NgScrollbarModule],
  templateUrl: './employees-form.component.html',
  styleUrl: './employees-form.component.css'
})
export class EmployeesFormComponent implements OnInit{

  @Input() detailsForm:any;
  @Input()activeTab :any;
  @Output()activeTabEmit =  new EventEmitter()

   employmentTabEnabled:boolean=false;

   constructor(){}

  ngOnInit(): void {
    this.detailsForm.get('employeeId').setErrors(true);
    console.log(this.detailsForm);
    
  }
  navButtons(value:any){
    if(value==='next'){
      this.activeTab='employment'
    }else if(value==='previous'){
      this.activeTab='personal'
    }else{
    }
    this.activeTabEmitter()
  }

  activeTabEmitter(){
    this.activeTabEmit.emit(this.activeTab)
  }

   activatePersonalTab() {
    this.activeTab = 'personal';
  }
}
