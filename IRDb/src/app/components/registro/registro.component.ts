import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from 'src/app/common/services/session.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  form: FormGroup;
  fileToUpload: File = null;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', [Validators.required, Validators.minLength(6)]],
      upl: ['', Validators.required]
    }, {
      validators: () => {
        if (!this.form) return;
        if (this.form.controls.password.value == this.form.controls.confirmar.value) {
          return null;
        } else {
          //this.registrar(form1);
          return {
            confirmPass: true
          }
        }
      }
    });
  }

  async registrar(form) {
    var toSend = {'name':form.value['nombre'],'upl':this.fileToUpload};

  console.log(await this.sessionService.signup(toSend));
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

}
