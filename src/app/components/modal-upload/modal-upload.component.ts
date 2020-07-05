import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SubirArchivoService } from 'src/app/services/service.index';

// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { ModalUploadService } from './modal-upload.service';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string;

  constructor(public subirArchivoService: SubirArchivoService, public modalUploadService: ModalUploadService) {
    console.log('Modal listo');
  }

  ngOnInit(): void {
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
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

  subirImagen() {
    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
    .then(resp => {
      this.modalUploadService.notificacion.emit(resp);
      this.modalUploadService.ocultarModal();
      this.cerrarModal();
    })
    .catch(err => {
      console.log('Error en la carga');
    });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }
}
