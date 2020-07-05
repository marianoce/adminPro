import { Component, OnInit } from '@angular/core';
import { HospitalService, UsuarioService } from 'src/app/services/service.index';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistro: number = 0;
  cargando: boolean = true;

  constructor(public hospitalService: HospitalService, public modalUploadService: ModalUploadService, public usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.modalUploadService.notificacion
    .subscribe(resp => {
      this.cargarHospitales();
    });
  }


  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hospitalService.buscarHospital(termino)
    .subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
    .subscribe((resp: any) => {
      this.totalRegistro = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital, this.usuarioService.token)
    .subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      //buttons: true,
      dangerMode: true,
    }).then(borrar => {
      if (borrar) {
        this.hospitalService.borrarHospital(hospital._id, this.usuarioService.token)
        .subscribe((borrado) => {
          console.log(borrado);
          this.cargarHospitales();
        });
      }
    });
  }

  agregarHospital() {
    swal({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      content: {
        element: 'input',
        attributes: {
          placeholder: '',
          type: 'text',
        },
      },
      icon: 'info',
      buttons: ['Cancelar', 'Guardar'],
      dangerMode: true
    })
    .then(name => {
      if (!name) {
        return;
      }
      console.log(this.usuarioService.token);
      const hospitalNuevo = new Hospital(name);
      this.hospitalService.crearHospital(hospitalNuevo, this.usuarioService.token)
      .subscribe((resp: any) => {
        console.log(resp);
        swal('Hospital creado', resp.hospital.nombre, 'success');
      },
      err => {
        swal('Error al crear Hospital creado', err.error.mensaje, 'warning');
      });
    });
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
    this.cargarHospitales();
  }
}
