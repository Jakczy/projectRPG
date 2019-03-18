import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NarratorConsoleComponent } from './Components/narrator-console/narrator-console.component';
import { EquipmentComponent } from './Components/equipment/equipment.component';
import { PlayerConsoleComponent } from './Components/player-console/player-console.component';
import { BackgroundPhotosComponent } from './Components/background-photos/background-photos.component';
import { QuestLogAndOthersComponent } from './Components/quest-log-and-others/quest-log-and-others.component';

import { TerminalService } from './Services/terminal.service';

@NgModule({
  declarations: [
    AppComponent,
    NarratorConsoleComponent,
    EquipmentComponent,
    PlayerConsoleComponent,
    BackgroundPhotosComponent,
    QuestLogAndOthersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [TerminalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
