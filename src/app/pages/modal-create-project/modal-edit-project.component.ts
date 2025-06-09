import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from 'app/services/projects/projects.service';

@Component({
  selector: 'app-modal-edit-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-edit-project.component.html',
  styleUrl: './modal-edit-project.component.scss'
})
export class ModalEditProjectComponent implements OnInit {
  formEditProject!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly projectsService: ProjectsService,
    public dialogRef: MatDialogRef<ModalEditProjectComponent>,
    private readonly _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.data && this.data.project) {
      this.formEditProject.patchValue({
        nombre: this.data.project.nombre,
        descripcion: this.data.project.descripcion,
        administrador_id: this.data.project.administrador?.id || this.data.project.administrador_id
      });
    }
  }

  createForm() {
    this.formEditProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      administrador_id: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formEditProject.invalid) {
      this._snackBar.open('Por favor completa los campos', 'Cerrar', { duration: 5000 });
      return;
    }
    const projectData = this.formEditProject.value;
    const projectId = this.data.project.id;
    this.projectsService.updateProject(projectId, projectData).subscribe({
      next: (response: any) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        const errorMessage = error.error?.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
} 