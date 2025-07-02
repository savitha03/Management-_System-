import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  @Input() loginForm!: FormGroup;
  @Output() actionEmitter = new EventEmitter();

  login() {
    this.actionEmitter.emit('LOGIN');
  }

  ngOnInit(): void {}
}
