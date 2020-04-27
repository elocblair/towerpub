import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { TowerComponent } from './tower/tower.component';
import { CharacterComponent } from './character/character.component';
import { InventoryService } from './inventory.service';
import { ResourceService } from './resource.service';
import { ResourceManagerComponent } from './tower/resource-manager/resource-manager.component';
import { HqComponent } from './tower/hq/hq.component';
import { HqService } from './hq.service';
import { TimerPipe } from './shared/timer-pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    TowerComponent,
    CharacterComponent,
    ResourceManagerComponent,
    HqComponent,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    InventoryService,
    ResourceService,
    HqService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
