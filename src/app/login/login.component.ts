import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { map } from 'rxjs/operators';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'
  ]
})
export class LoginComponent implements OnInit {

  recuerdame = false;
  email: string;
  auth2: any;

  constructor(public router: Router, public usuarioService: UsuarioService) { }

  ngOnInit(): void {
    init_plugins();
    this.email = localStorage.getItem('email') || '';

    if(this.email.length > 1) {
      this.recuerdame = true;
    }

    this.googleInit();
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '977844472054-1n4lp8s195eb30ncj3tfgq5lpc18tqcc.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    })
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, googleUser => {
      let profile = googleUser.getBasicProfile();
      console.log(profile);
      let token = googleUser.getAuthResponse().id_token;
      console.log(token);

      this.usuarioService.loginGoogle(token)
      .subscribe(resp => {
        console.log(resp);
        this.router.navigate(['/dashboard']);
      });
    })
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(
      null, forma.value.email, forma.value.password
    );

    this.usuarioService.login(usuario, forma.value.recuerdame)
    .subscribe(ok => this.router.navigate(['/dashboard']));
    //this.router.navigate(['/dashboard']);
  }



}
