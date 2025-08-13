import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
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

//   onEmpCodeInput(event: Event) {
//   const input = event.target as HTMLInputElement;
//   const upperValue = input.value.toUpperCase();
//   this.loginForm.get('empCode')?.setValue(upperValue, { emitEvent: false });
// }

onEmpCodeInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const upperValue = input.value.toUpperCase();
  this.loginForm.get('empCode')?.setValue(upperValue, { emitEvent: false });
}

}
