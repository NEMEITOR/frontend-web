import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProjectsService } from 'app/services/projects/projects.service';
import { ModalCreateProjectComponent } from '../modal-create-project/modal-create-project.component';
import { ModalEditProjectComponent } from '../modal-create-project/modal-edit-project.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalAssignUsersProjectsComponent } from '../modal-assign-users-projects/modal-assign-users-projects.component';

@Component({
  selector: 'app-projects', // Define el nombre con el que se usará el componente en los archivos HTML.
  standalone: true, // Indica que el componente puede funcionar de manera independiente, sin estar dentro de un módulo.
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './projects.component.html', // Archivo que contiene la estructura visual del componente.
  styleUrl: './projects.component.scss' // Archivo donde se encuentran los estilos específicos del componente.
})
export class ProjectsComponent { // Definición de la clase principal del componente.
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'administrador',
    'action'
  ];

  breadscrums = [
    {
      title: 'Gestión de proyectos',
      item: [],
      active: 'Proyectos',
    },
  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isLoading = false;

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.isLoading = true;
    this.projectsService.getAllProjects().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.projects;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openModalCreateProject(): void {
    const dialogRef = this.dialogModel.open(ModalCreateProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllProjects();
      }
    });
  }

  openModalEditProject(project: any): void {
    const dialogRef = this.dialogModel.open(ModalEditProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
      data: { project }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllProjects();
      }
    });
  }

  openModalAssignUsers(project: any): void {
    const dialogRef = this.dialogModel.open(ModalAssignUsersProjectsComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
      data: { project: project, user: [] } // Asegúrate de pasar los usuarios del proyecto
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllProjects();
      }
    });
  }


  

  deleteProject(projectId: number): void {
    this.projectsService.deleteProject(projectId).subscribe({
      next: (response: any) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.getAllProjects();
      },
      error: (error: any) => {
        const errorMessage = error.error?.message || 'Error al eliminar el proyecto';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
}

