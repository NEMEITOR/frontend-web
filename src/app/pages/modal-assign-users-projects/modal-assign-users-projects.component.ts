import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProjectsService } from 'app/services/projects/projects.service';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-modal-assign-users-projects',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './modal-assign-users-projects.component.html',
  styleUrl: './modal-assign-users-projects.component.scss'
})
export class ModalAssignUsersProjectsComponent {
  assignForm!: FormGroup;
  users: any[] = [];
  projects: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalAssignUsersProjectsComponent>,
    private readonly _formBuilder: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService
  ) {
    this.createForm();
    this.loadProjects();
    this.loadUsers();
  }

  createForm(): void {
    this.assignForm = this._formBuilder.group({
      projectId: [this.data?.project?.id || '', Validators.required],
      userIds: [[], Validators.required]
    });
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.users || response; // depende de tu API
      },
      error: () => {
        this._snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 5000 });
      }
    });
  }

  loadProjects(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (response: any) => {
        this.projects = response.projects || response;
      },
      error: () => {
        this._snackBar.open('Error al cargar proyectos', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid) {
      this._snackBar.open('Por favor selecciona los campos requeridos', 'Cerrar', { duration: 5000 });
      return;
    }

    const formValue = this.assignForm.value;

    this.projectsService.assignUsersToProject({
      projectId: formValue.projectId,
      userIds: formValue.userIds
    }).subscribe({
      next: (response: any) => {
        this._snackBar.open(response.message || 'Usuarios asignados correctamente', 'Cerrar', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Ocurrió un error al asignar usuarios';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
