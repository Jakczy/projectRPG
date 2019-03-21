import { Component, OnInit, Output } from '@angular/core';
import { CommandSupportService } from '../../Services/command-support.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-narrator-console',
  templateUrl: './narrator-console.component.html',
  styleUrls: ['./narrator-console.component.css']
})
export class NarratorConsoleComponent implements OnInit {

  constructor(private dataCSS: CommandSupportService) { }

  ngOnInit() {
    //this.playAudio();
    $('#narratorConsole').append("\n" + this.rooms.menu.description);
    //It's waiting for new information from player console and open functions respectively
    this.dataCSS.getEventSubject().subscribe((command: string) => {
      if (command !== undefined){
        this.changeRoom(command);
        //$('html, #narratorConsole').append($("<link href='narrator-console.component.css' type='text/css' rel='stylesheet'>"));
        $("html, #narratorConsole").animate({scrollTop: $(document).height()}, "slow");
      }
    });
    //TODO Clicking on list variable send command to player console
    $('#menu li').click(() => {
      alert($(this).text());
      //this.dataCSS.processCommand($(this).text());
    });
  }
  //It's working but only with external src like: links. I don't know why it working this way and i'm to tired to find out.
  playAudio(){
    var audio = new Audio();
    audio.src = '';//It should be external link.
    audio.load();
    audio.play();
  }

  changeRoom(zmienna: string){
    if(this.rooms[this.currentRoom].directions[zmienna] !== undefined){
      this.currentRoom = this.rooms[this.currentRoom].directions[zmienna];
      $('#narratorConsole').append("\n" + this.rooms[this.currentRoom].description);
    } else {
      $('#narratorConsole').append("\nHmm?");
    }
    
  };

  currentRoom = "menu";
  rooms = {
    "menu" : {
      "description" : "<lu><li>Nowa gra</li><li>Wczytaj grę</li><li>Opcję</li></lu>",
      "directions" : {
        "nowa gra" : "new game"
      }
    },
    "new game" : {
      "description" : "Rozpoczynasz nową grę!\nKim jesteś?\n<lu><li>Człowiek</li><li>Nieumarły</li></lu>",

    }
  }
}
