import { Directive, effect, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/services/auth/auth';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {

  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef)

  private requiredRole: string = '';

  constructor() {
    effect(() => {
      this.updateView()
    })
   }


   @Input() set appHasRole(role: string) {
    this.requiredRole = role;
    this.updateView()
   }

   private updateView () {
    const currentUser = this.authService.currentUser()

    if(currentUser && currentUser.role === this.requiredRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear()
    }
   }

}
