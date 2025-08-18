import { Component, OnInit } from '@angular/core';
import { Login } from '../login/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { login } from '../store/auth/login.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-auth-component',
  imports: [Login],
  templateUrl: './auth-component.html',
  styleUrl: './auth-component.css',
})
export class AuthComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private store:Store
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
        empCode: ['',[Validators.required,Validators.pattern(/^[A-Z]+$/)]],
        password: ['', Validators.required],
    });
  }

  formActions(event: any) {
    switch (event) {
      case 'LOGIN': {
        this.store.dispatch(login({ payload: this.loginForm.getRawValue() }));
      }
    }
  }
}
