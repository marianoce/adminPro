import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService, UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistro: number = 0;
  cargando: boolean = true;

  constructor(public medicoService: MedicoService, public modalUploadService: ModalUploadService, public usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.modalUploadService.notificacion
    .subscribe(resp => {
      this.cargarMedicos();
    });
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this.medicoService.buscarMedicos(termino)
    .subscribe((medicos: Medico[]) => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde)
    .subscribe((resp: any) => {
      this.totalRegistro = resp.total;
      this.medicos = resp.medicos;
      this.cargando = false;
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    console.log(desde);
    if (desde >= this.totalRegistro) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }

  borrarMedico(medico: Medico) {
    swal({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      //buttons: true,
      dangerMode: true,
    }).then(borrar => {
      if (borrar) {
        this.medicoService.borrarMedico(medico._id, this.usuarioService.token)
        .subscribe((borrado) => {
          console.log(borrado);
          this.cargarMedicos();
        });
      }
    });
  }
}
