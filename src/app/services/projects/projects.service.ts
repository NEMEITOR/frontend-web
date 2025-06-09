// Importación del decorador necesario para definir un servicio en Angular.
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Indica que el servicio estará disponible de manera global en la aplicación.
})
export class ProjectsService { // Definición del servicio ProjectsService.
  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) { 
    // Constructor del servicio. Aquí pueden inyectarse dependencias si es necesario.
  }

  createProject(projectData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/create`;
    return this.http.post<any>(endpoint, projectData);
  }

  updateProject(projectId: number, projectData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/update/${projectId}`;
    return this.http.put<any>(endpoint, projectData);
  }

  deleteProject(projectId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/delete/${projectId}`;
    return this.http.delete<any>(endpoint);
  }

  getAllProjects(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects`;
    return this.http.get<any>(endpoint);
  }

  getProjectById(projectId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/${projectId}`;
    return this.http.get<any>(endpoint);
  }

  assignUsersToProject(data: { projectId: number, userIds: number[] }): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/associate`;
    return this.http.post<any>(endpoint, data);
  }

  removeUserFromProject(data: { projectId: number, userId: number }): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/projects/disassociate`;
    return this.http.delete<any>(endpoint, { body: data });
  }
}

