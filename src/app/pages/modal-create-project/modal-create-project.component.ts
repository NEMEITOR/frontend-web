// Importaciones necesarias para la creación del componente y gestión de formularios.
import { CommonModule } from '@angular/common'; // Proporciona funciones esenciales para Angular.
import { Component, Inject } from '@angular/core'; // Define el componente y maneja la inyección de dependencias.
import { MatButtonModule } from '@angular/material/button'; // Botones de Angular Material.
import { MatFormFieldModule } from '@angular/material/form-field'; // Campos de formulario con Material Design.
import { MatInputModule } from '@angular/material/input'; // Campos de entrada en formularios.
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Manejo de formularios y validaciones.
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // Manejo de diálogos en Angular Material.
import { MatSnackBar } from '@angular/material/snack-bar'; // Notificaciones emergentes en Angular Material.
import { ProjectsService } from 'app/services/projects/projects.service'; // Servicio para gestionar proyectos.

@Component({
  selector: 'app-modal-create-project', // Nombre del componente en HTML.
  standalone: true, // Indica que el componente no depende de un módulo externo.
  imports: [ // Módulos utilizados dentro del componente.
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-create-project.component.html', // Archivo que define la estructura visual del componente.
  styleUrl: './modal-create-project.component.scss' // Archivo que contiene los estilos específicos del componente.
})
export class ModalCreateProjectComponent { // Definición del componente.

  formCreateProject!: FormGroup; // Formulario reactivo para la creación de proyectos.

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe datos del diálogo cuando es abierto.
    private readonly _formBuilder: FormBuilder, // Servicio para construir formularios reactivos.
    private readonly projectsService: ProjectsService, // Servicio para gestionar proyectos.
    public dialogRef: MatDialogRef<ModalCreateProjectComponent>, // <-- Cambiado a public
    private readonly _snackBar: MatSnackBar, // Servicio para mostrar notificaciones emergentes.
  ) {
    this.createForm(); // Inicializa el formulario.
  }

  createForm() {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      administrador_id: ['', Validators.required]
    });
  }

  // Envía el formulario para crear un nuevo proyecto.
  onSubmit() {
    if (this.formCreateProject.invalid) { // Verifica si el formulario es válido.
      this._snackBar.open('Por favor completa los campos', 'Cerrar', { duration: 5000 });
      return;
    }
    const projectData = this.formCreateProject.value;
    this.projectsService.createProject(projectData).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formCreateProject.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

}


