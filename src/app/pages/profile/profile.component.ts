import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';

// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string;

  constructor(public usuarioService: UsuarioService) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  guardar(usuarioForm: Usuario) {
    this.usuario.nombre = usuarioForm.nombre;
    if (!this.usuario.google) {
      console.log('cagamos');
      this.usuario.email = usuarioForm.email;
    }
    this.usuarioService.actualizarUsuario(this.usuario)
    .subscribe();
  }


  seleccionImagen(archivo: File) {
    if(!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      this.imagenTemp = null;
      swal('Solo imagenes', 'El archivo seleccinado no es una imagen', 'warning');
      return;
    }
    this.imagenSubir = archivo;

    let reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  cambiarImagen() {
    console.log(this.imagenSubir);
    console.log(this.usuario._id);
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
