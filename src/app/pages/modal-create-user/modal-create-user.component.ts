import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatSelectModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './modal-create-user.component.html',
  styleUrl: './modal-create-user.component.scss'
})
export class ModalCreateUsersComponent  implements OnInit{
  formCreateUser!: FormGroup;
  administratorsValue: any[] = [];
  showfieldAdministrator: boolean = false;
  validatePassword: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _userService: UsersService,
    private readonly dialogRef: MatDialogRef<ModalCreateUsersComponent>,
    private readonly _snackBar: MatSnackBar,
  )

  {
    this.createFormUsers();
    this.formCreateUser.controls['confirmPassword'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.validatePassword(value);
    });
  }

  ngOnInit(): void {
    this.getAllAdministrator();
  }

  createFormUsers() {
    this.formCreateUser = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rol_id: [undefined, Validators.required],
      administrador_id: [undefined, Validators.required]
    });
  }

  getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res: { users: any[]; }) => {
        this.administratorsValue = res.users;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onChangeRol(event: any) {
    if (event.value === '1') {
      this.hideAdministratorsField();
    } else {
      this.hideAdministratorsField();
    }
  }
  hideAdministratorsField() {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.formCreateUser.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    const userDataInformation = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      password: this.formCreateUser.get('password')?.value,
      rol_id: Number(this.formCreateUser.get('rol_id')?.value),
      administrador_id: this.formCreateUser.get('administrador_id')?.value
    };

    this._userService.createUser(userDataInformation).subscribe({
      next: (response: { message: string; }) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000});
        this.formCreateUser.reset();
        this.dialogRef.close(true);
      },
      error:(error: { error: { result: string; }; }) => {
        const errorMessage = error.error?.result || 'Ocurrio un error innesperado';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000});
      }
    });
  }

}

