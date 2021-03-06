import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { Observable } from 'rxjs';
const swal: SweetAlert = _swal as any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(public http: HttpClient, public router: Router, public subirArchivoService: SubirArchivoService) {
    console.log('Usuario Service');
    this.cargarStorage();
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.usuario = null;
      this.token = '';
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
    .pipe(
      catchError(err => {
        console.log(err.status);
        swal(err.error.mensaje, err.error.errors.message, 'error');
        throw(err);
      })
    );
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
    .pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }));
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recuerdame: boolean = false) {

    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
    .pipe(
      map((resp: any) => {
        console.log(resp);
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }),
      catchError(err => {
        console.log(err.status);
        swal('Error', err.error.mensaje, 'error');
        throw(err);
      })
    );
  }

  estaLogueado() {
    return this.token && this.token.length > 5;
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
    .pipe(map((resp: any) => {
      if(usuario._id === this.usuario._id) {
        let usuarioDB: Usuario = resp.usuario;
        this.guardarStorage(resp.usuario._id, this.token, resp.usuario, resp.menu);
      }
      //this.usuario = resp.usuario;
      swal('Usuario Actualizado', resp.usuario.nombre, 'success');
      return true;
    }));
  }


  cambiarImagen(file: File, id: string) {
    this.subirArchivoService.subirArchivo(file, 'usuarios', id)
    .then((resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario, this.menu);
    })
    .catch(err => console.log(err));
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde.toString();
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      return resp.usuarios;
    }));
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;
    return this.http.delete(url)
    .pipe(map(resp => {
      swal('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
      return true;
    }));
  }
}
