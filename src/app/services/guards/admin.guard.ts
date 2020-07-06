import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/services/service.index';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivate() {
    if (this.usuarioService.usuario.rol === 'ADMIN_ROLE') {
      return true;
    } else {
      console.error('Bloqueado por el admin guard');
      this.usuarioService.logout();
    }

    return true;
  }
}
