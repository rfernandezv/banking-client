import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  template: `
  <block-ui>
    <app-header></app-header>
    <router-outlet></router-outlet>
  </block-ui>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  constructor(
    public _containerRef: ViewContainerRef,
    private toastr: ToastsManager,
  ) {

    this.toastr.setRootViewContainerRef(_containerRef);

  }

  ngOnInit() {

  }
}