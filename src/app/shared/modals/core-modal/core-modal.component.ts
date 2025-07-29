import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-core-modal',
  imports: [CommonModule],
  templateUrl: './core-modal.component.html',
  styleUrl: './core-modal.component.css'
})
export class CoreModalComponent implements OnInit {

  @Input() header:any;
  @Input() content:any;
  @Input() isYesOrNo:any;

  @Output() eventHandler$ = new EventEmitter();

  constructor( public activeModal:NgbActiveModal){}

  ngOnInit(): void {
    
  }


  proceed(){
    this.eventHandler$.emit('Proceed')
  }
}
