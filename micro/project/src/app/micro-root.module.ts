import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import zh from '@angular/common/locales/zh';

import { MicroRootComponent } from './micro-root.component';
import { AppModule } from './app.module';
import { RootRoutingModule } from './root-routing.module';

registerLocaleData(zh);

@NgModule({
  declarations: [
    MicroRootComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    RootRoutingModule
  ],
  providers: [
  ],
  bootstrap: [MicroRootComponent]
})
export class MicroRootModule { }
