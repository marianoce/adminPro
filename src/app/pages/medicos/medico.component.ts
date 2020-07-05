import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService, UsuarioService } from 'src/app/services/service.index';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(public medicoService: MedicoService,
              public hospitalService: HospitalService,
              public usuarioService: UsuarioService,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public modalUploadService: ModalUploadService) {
    activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    })
  }

  ngOnInit(): void {
    this.hospitalService.cargarHospitales()
    .subscribe((hospitales: any) => {
      this.hospitales = hospitales.hospitales;
      console.log(this.hospitales);
    });

    this.modalUploadService.notificacion
    .subscribe((resp: any) => {
      console.log(resp);
      this.medico.img = resp.medico.img;
    });
  }

  guardarMedico(form: NgForm) {
      if (form.invalid) {
        return;
      }
      const update = this.medico._id !== '';
      console.log(this.medico);
      this.medicoService.crearMedico(this.medico, this.usuarioService.token)
      .subscribe((resp: any) => {
        console.log(resp);
        this.medico._id = resp.medico._id;
        this.router.navigate(['/medico', resp.medico._id]);
        if (!update) {
          swal('Medico creado', resp.medico.nombre, 'success');
        } else {
          swal('Medico actualizado', resp.medico.nombre, 'success');
        }
      });
  }

  cambioHospital(idHospital: string) {
    this.hospitalService.obtenerHospital(idHospital)
    .subscribe((resp: any) => {
      this.hospital = resp.hospital;
    });
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id)
    .subscribe(medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(this.medico.hospital);
    });
  }

  cambiarFotografia() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }
}
