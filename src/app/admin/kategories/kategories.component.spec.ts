import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { AddEditKategorieComponent } from '../add-edit-kategorie/add-edit-kategorie.component';
import { ErrorService } from 'src/app/error/error.service';
import { iKategorie } from 'src/app/model/iKategorie';
import { KategorieService } from './kategorie.service';
import { KategoriesComponent } from './kategories.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('KategoriesComponent', () => {
  let component: KategoriesComponent;
  let fixture: ComponentFixture<KategoriesComponent>;
  let kategorieService: KategorieService;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KategoriesComponent, HttpClientTestingModule, MatDialogModule],
      providers: [KategorieService, ErrorService, MatDialog, MatSnackBar],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriesComponent);
    component = fixture.componentInstance;
    kategorieService = TestBed.inject(KategorieService);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addKategorie method', () => {
    const spy = jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(null) } as any);
    component.addKategorie();
    expect(spy).toHaveBeenCalled();
  });

  it('should call editKategoria method', () => {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '300px'
    conf.width = '300px'
    conf.data = {};
    const mockKategoria: iKategorie = {
      id: 1, name: 'Test', products: [],
      parent_id: null
    };
    conf.data = mockKategoria;
    const spy = jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(null) } as any);
    component.editKategoria(mockKategoria);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(AddEditKategorieComponent, conf);
  });

  it('should call deleteKategoria method', () => {
    const mockId = 1;
    const spy = jest.spyOn(kategorieService, 'deleteCategory').mockReturnValue(of([]));
    component.deleteKategoria(mockId);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockId);
  });
});
