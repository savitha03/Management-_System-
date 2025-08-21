import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-validation-core-model',
  imports: [CommonModule],
  templateUrl: './validation-core-model.component.html',
  styleUrl: './validation-core-model.component.css'
})
export class ValidationCoreModelComponent implements OnInit{

  @Input() errors:any;

  @Output() eventHandler$ = new EventEmitter();

  constructor(public activeModal:NgbActiveModal){}
  ngOnInit(): void {
    
  }
  cancel(){
    this.eventHandler$.emit('Cancel')
  }
}
