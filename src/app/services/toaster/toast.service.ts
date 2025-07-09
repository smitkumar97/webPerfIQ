import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastr: ToastrService) { }

  showSuccess(message: string) {
    this.toastr.success('', message, {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    })
  }

  showWarning(message: string) {
    this.toastr.warning('', message, {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    })
  }

  showError(error: string) {
    this.toastr.error('', error, {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    })
  }
}
