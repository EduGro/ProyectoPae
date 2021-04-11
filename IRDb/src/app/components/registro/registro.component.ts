import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: () => {
        if (!this.form) return;
        if (this.form.controls.password.value == this.form.controls.confirmar.value) {
          return null;
        } else {
          return {
            confirmPass: true
          }
        }
      }
    });
  }

  registrar() {
    //TODO
  }

}
