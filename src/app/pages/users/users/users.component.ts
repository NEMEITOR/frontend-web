import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule} from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule} from "@angular/material/select";
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatAutocompleteModule} from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule} from "@angular/material/table";
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { UsersService } from "app/services/users/users.service";
import { ModalCreateUserComponent} from "app/pages/modal-create-user/modal-create-user.component";
import { MatDialog} from "@angular/material/dialog";
import { ModalEditUserComponent} from "app/pages/"
import { debounceTime, distinctUntilChanged } from "rxjs";


export interface User {

  }

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  displayedComuns: string[] = [
    'name',
    'email',
    'role',
    'action'
  ];

  breadscrums = [
    {
      title: 'Gestion de usuarios',
      items: [],
      active: 'Datos Basicos',
    },
  ];

  breadscrumsDetails = [
    {
      title: '',
    },
  ];

  //Table
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // search
  userFormSearchFilter!: FormGroup;
  usersList: any[] = [];

  isLoading = false;

  userDefaultFilterSearch:any = {
    name: undefined,
    email: undefined,
  }

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly userService: UsersService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createUserFormSearchFilter();
    this.getAllUserByAdministrator();
    this.handleUserFilterChange('name', 'name');
    this.handleUserFilterChange('email', 'email');
  }

  private createUserFormSearchFilter() {
    this.userFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: ['']
    });
  }

  getRoleName(rol_id: number): string {
    switch (rol_id) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuario';
      default:
        return 'Desconocido';
    }
  }

  private handleUserFilterChange(controlName: string, filterkey: string) {
    this.userFormSearchFilter.controls[controlName].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      this.userDefaultFilterSearch[filterkey] = value;
    console.log(this.userDefaultFilterSearch);
    this.getAllUserByAdministrator({ ...this.userDefaultFilterSearch, [filterkey]: value });
    });
  }

  getAllUserByAdministrator(filters?: any): void {
    this.isLoading = true;
    this.userService.getAllUserByAdministrator(filters).subscribe({
      next: (response) => {
        this.usersList = response.users;
        this.dataSource.data = response.users;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }
   openModalCreateUser(): void {
    const dialogRef = this.dialogModel.open(ModalCreateUserComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
    });
  }
  openModalUpdateUser(userInformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditUserComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: { user: userInformation }
    });
  }

  deleteUser(userId: number): void { 
    this.userService.deleteUser(userId).subscribe({
      next: (response) => { 
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000});
      },
      error: (error) => { 
        const errorMessage = error.error?.message || 'Error al eliminar el usuario';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000});
      }
    });
  }
}
