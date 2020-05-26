import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/models/user.module';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  arrCategories: Array<any> = [];

  form: FormGroup;
  modalRef: BsModalRef;
  submitted: boolean;
  showMobileMenu = false;
  dropMenu = false;

  constructor(
    private categoryService: CategoryService,
    private modalService: BsModalService,
    public auth: AuthService,
    private router: Router,
    private activetedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  public openModal(loginForm: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(loginForm);
    this.form.patchValue({
      email: null,
      password: null
    });
  }

  private getCategories() {
    return this.categoryService.getAllFirebaseCategories().subscribe((
      data => {
        this.arrCategories = data;
      }));
  }

  public closeSignIn(): void {
    this.modalRef.hide();
    this.form.reset();
  }

  public signIn(): void {
    if (this.form.invalid) {
      return;
    }
    const user = new User(
      this.form.value.email,
      this.form.value.password,
      true
    );
    this.auth.login(user).subscribe(
      () => {
        this.form.reset();
        this.router.navigate(['/admin', 'post']);
        this.submitted = true;
        this.modalRef.hide();
      });

  }

  public logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/home']);
    this.submitted = false;
  }

  public openNav() {
    this.showMobileMenu = true;
  }

  public closeNav() {
    this.showMobileMenu = false;
  }

  public dropDownMenu() {
    this.dropMenu = !this.dropMenu;   
  }

}
