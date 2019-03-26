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
    //It's waiting for new information from player console and open functions respectively
    this.dataCSS.getEventSubject().subscribe((command: string) => {
      if (command !== undefined) this.playerInput(command);
    });
    this.load("kaplan", this.dialoguesTable['kaplan']);
    //Maybe TODO Clicking on list variable send command to player console
    $('lu li').click(() => {
      alert($(this).text());
      //this.dataCSS.processCommand($(this).text());
    });
  }  

  //It's working but only with external src like: links because webpage cant access files on your pc directly
  playAudio(){
    var audio = new Audio();
    audio.src = '';//It should be external link.
    audio.load();
    audio.play();
  }

  writeText(text:string){
    $('#narratorConsole').append(text);
  }

  changeRoom(dir: string){
    if ((/[^null]/g && /[^undefined]/g).test(this.rooms[this.currentRoom].directions[dir])){
      this.previousRoom = this.currentRoom;
      this.currentRoom = this.rooms[this.currentRoom].directions[dir];
      this.writeText(this.rooms[this.currentRoom].description);
    } else this.writeText("Hmm?");
  }

  useItem(dir:string){
      if ((/[^null]/g && /[^undefined]/g).test(this.rooms[this.currentRoom].items[dir])){
        this.writeText(this.rooms[this.currentRoom].items[dir]);
      } else this.writeText("Hmm?");
  }

  playerChangeInput(dir:string){
    this.currentState = dir;
  }
  
  playerInput(input:string){//m = menu, d = dialogue, f = fight, g = game
    switch(this.currentState){
      case 'd': this.playerDialogueInput(input); break;
      case 'f': this.playerFightInput(input); break;
      case 'm': this.playerMenuInput(input); break;
      default: this.playerGameInput(input); break;
    }
  }

  playerMenuInput(input:string){
    this.writeText('<p>');
    switch(input){
      case 'nowa gra': this.currentState = 'g'; this.writeText(this.rooms[this.currentRoom].start); break;
      case 'wczytaj': this.writeText('Not implemented yet'); break;
      default: this.writeText('Hmm?');
    }
    this.writeText('</p>');
    $("html, #narratorConsole").animate({ scrollTop: $(document).height() }, "slow");
  }

  playerGameInput(input:string){
    this.writeText('<p>');
    switch(input){
      case 'spojrz': this.writeText(this.rooms[this.currentRoom].description); break;
      case 'north' || 'south' || 'east' || 'west' : this.changeRoom(input); break;
      case 'help': this.showHelp(); break;
      default: switch(input.split(' ')[0]){
        case 'idz': this.changeRoom(input.split(' ')[1]); break;
        case 'uzyj': this.useItem(input.split(' ')[1]); break;
        case 'rozmawiaj': this.dialogueControl(input.split(' ')[1]); break;
        default: this.writeText('Hmm?');
      }
    }
    this.writeText('</p>');
    $("html, #narratorConsole").animate({ scrollTop: $(document).height() }, "slow");
  }

  playerFightInput(input:string){
  }

  dialogueControl(actor:string){
    let flag;
    for(var i = 0; i < this.rooms[this.currentRoom].npc.length; i++){
      if(this.rooms[this.currentRoom].npc[0] === actor){
        flag = 1;
        break;
      }
    }
    console.log(flag);
    if(flag){
      this.playerChangeInput('d');
      this.currentActor = actor;
      this.playerInput('');
    }
  }

  playerDialogueInput(input:string){
    this.writeText('<p>');
    var dialogue = this.interact(this.currentActor, "gracz", input);
    console.log('dialogue: ', dialogue);
    if(dialogue.text === 'koniec'){
      this.playerChangeInput('g');
      this.playerInput('spojrz');
      console.log('zmienilem tryb na:', this.currentState);
    }else if(dialogue){
      this.writeText(dialogue.text);
      if(dialogue.responses) {
        for(var i = 0; i < dialogue.responses.length; i++){
         this.writeText('\n[' + (i+1) + '] ' + dialogue.responses[i].text);
        }
      }
    }
    this.writeText('</p>');
    $("html, #narratorConsole").animate({ scrollTop: $(document).height() }, "slow");
  }

  showHelp(){
    this.writeText('Lista wszystkich możliwych komend:<lu>')
    for (var i = 0; i < this.commands.length; i++){
      this.writeText('<li>' + this.commands[i] + '</li>')
    }
    this.writeText('</lu>');
  }

  currentActor = 'default';
  currentDialogue = "default";
  currentState = 'm';
  previousRoom = "default";
  currentRoom = "1";
  commands = ['idź [gdzie]', 'podnieś [co]', 'spójrz', 'rozmawiaj [imie]', 'użyj [co]', 'zapisz [nazwa]', 'wczytaj [nazwa]', 'załóż [co]'];
  tutor = {
    "1": "Tutor: Witaj w grze „Ku chwale Gothica”. Nie bój się. Podstawowych komend i zasad gry nauczysz się w trakcie tego prologu. Jeżeli chcesz wyświetlić wszystkie dostępne w grze komendy wpisz <b>help</b>. Aktualnie znajdujesz się w jednej z setek lokacji, które przyjdzie ci zwiedzać. Aby rozejrzeć się po okolicy użyj polecenia <b>spojrz</b>. Zrób to teraz.",
    "2": "Tutor: Aby wejść w interakcję z otoczeniem wystarczy wpisać polecenie <b>użyj</b>. Spróbuj otworzyć komodę.",
    "3": "Tutor: Podczas gry napotkasz wiele miejsc, w których mogą być ukryte ciekawe przedmioty, te nieciekawe jak również absolutnie nic.",
    "4": "Tutor: Znalazłeś element ekwipunku. Aby go ubrać należy użyć polecenia <b>załóż</b>.",
    "5": "Tutor: Spotkałeś pierwszą postać niezależną (NPC). Postaci te będziesz spotykał niezwykle często. Idź porozmawiać z Kapłanem. Aby to zrobić użyj polecenia <b>rozmawiaj</b>.",
    "6": "Tutor: Otrzymałeś właśnie dokument. Dokumenty można czytać za pomocą polecenia <b>czytaj</b>."
  };
  rooms = {
    "1": {
      "start": "Budzisz się. Ostre światło razi twe jeszcze senne oczy. Znajdujesz się w surowym, zbudowanym z marmuru pomieszczeniu. Wstajesz z drewnianego łóżka.",
      "description": "Rozglądasz się po marmurowym pokoju. Na północy widzisz okute drewniane drzwi. Przy wschodniej ścianie stoi komoda. Przy południowej łóżko na którym spałeś. Od zachodniej ściany bije jasne, kolorowe światło słoneczne przedostające się przez wielobarwny witraż.",
      "items": {
        "komoda": "Znajdujesz: 10 ZM (złota moneta), onuce.",
        "lozko": "",
      },
      "directions": {
        "north": "2"
      }
    },
    "2": {
      "start": "Otwierasz cięższe niż myślałeś drewniane drzwi i wchodzisz do zdecydowanie większego, również marmurowego pomieszczenia. Po wystroju poznajesz, że jest to świątynia.",
      "description": "Przy wschodniej ścianie, przy ołtarzu stoi Kapłan Verdes. Na zachodzie widzisz ogromne metalowe drzwi prawdopodobnie prowadzące na zewnątrz budynku. Północną ścianę pokrywa istna wystawa rozmaitych wiraży, a pod nimi kolejne drewniane drzwi. Na południu również znajdują się drzwi.",
      "directions": {
        "north": "3"
      },
      "npc": ["kaplan"]
    },
    "3": {
      "description": "Wchodzisz do niewielkiego laboratorium. Przy zachodniej ścianie stoi pokaźnych rozmiarów biblioteczka. Przy północnej ścianie stoi łóżko, biurko oraz okuta skrzynia. Przy wschodniej ścianie stoi komoda.",
      "items": {
        "biblioteczka": "Przeszukujesz biblioteczkę w poszukiwaniu Księgi Ziół. Po 10 minutach czytania grzbietów mniejszych i większych ksiąg o zielonej okładce znajdujesz to po co przyszedłeś.\nOtrzymujesz: Księga Ziół",
        "lozko": "Ja: Nie chce mi się spać.",
        "biurko": "Nie znajdujesz nic ciekawego.",
        "skrzynia": "Skrzynia jest zamknięta.",
        "komoda": "Znajdujesz: 2SZ",
      },
      "directions": {
        "south": "2"
      }
    }
  };

  dialoguesTable = {
    "kaplan" : "0 Verdes: O, w końcu się obudziłeś Zbyszek. Jak się czujesz? -> 1\n1 Ja: Głowa mnie boli, gdzie ja właściwie jestem? -> 2\n2 Verdes: Jesteś w Kaplicy Czystości, niedaleko Anderveltu. -> 3\n3 Ja: Ja... nie wiem kim jestem i skąd się tu wziąłem. Skąd znasz moje imię i dlaczego ja go nie pamiętam? Czym jest Andervelt? Jaka Kaplica? -> 4\n4 Verdes: Spokojnie chłopcze. Rozumiem, masz wiele pytań, ale wszystko po kolei. Najpierw musimy sprawdzić jak się czujesz. Wyglądasz w porządku, jednak nie mogę być pewien czy mi tu zaraz nie zasłabniesz. Udaj się drzwiami na północy do laboratorium i przynieś mi Księgę Ziół. [5,6]\n5 No to idę. -> 9 \n6 A gdzie konkretnie jej szukać? -> 7\n7 Verdes: Tak jak mówiłem wejdź do laboratorium. Będzie tam biblioteczka. Książkę poznasz po zielonej okładce no i rzecz jasna po tytule. [5]\n8 Verdes: A więc jesteś i widzę, że masz moją księgę. Świetnie, w takim razie teraz możemy porozmawiać o tobie. -> 9\n9 koniec",
  };

// The state of a dialogue; this is a matrix of players and actors,
// so for each player an actor has a different dialogue state
//
dialogue_states = {};

//
// A map of dialogue objects for each actor
//
dialogues = {};
    
/*
 * Get the dialogue state for an actor and player combination
 */
__getState = function(actor, player){
    //var actor_state = this.dialogue_states[actor];
    if (!this.dialogue_states[actor]) this.dialogue_states[actor] = {};
    var player_state = this.dialogue_states[actor][player];
    player_state = player_state || 0;
    return player_state;
}

/*
 * Set the dialogue state for an actor and player combination
 */
__setState = function(actor, player, state){
    this.dialogue_states[actor][player] = state;
}

/*
 * Get the specified dialogue for this actor
 */
__getDialogue = function(actor, id){
  this.dialogues[actor] = this.dialogues[actor] || {};
    return this.dialogues[actor][id];
}

/*
 * Set the dialogue for an actor
 */
//Nie dotykac bo zabije
__setDialogue = function(actor, dialogue){
  this.dialogues[actor] = this.dialogues[actor] || {};
  this.dialogues[actor][dialogue.id] = this.dialogues[actor][dialogue.id] || {};
  this.dialogues[actor][dialogue.id].id = dialogue.id;
  this.dialogues[actor][dialogue.id].text = dialogue.text;
  if((/[^null]/g && /[^undefined]/g).test(dialogue.next)) this.dialogues[actor][dialogue.id].next = dialogue.next;
  if((/[^null]/g && /[^undefined]/g).test(dialogue.responses)) this.dialogues[actor][dialogue.id].responses = dialogue.responses;
}

/*
 * Enact a dialogue 
 *
 * Note that this can also result in events being fired
 *
 * @param actor the ID of the actor speaking
 * @param player the ID of the player interacting with the actor
 * @response the response id [optional]
 *
 * @return the dialogue to show (text) and also any responses to display
 */
interact = function(actor,player,response = undefined){
    var state = this.__getState(actor, player);
    let dialogue;
    //
    // If a response id is passed along, see if it matches a dialogue element
    //
    if (response){
      try{//TODO something with undefined variable, how to check if undefined before trying to access it?
        response = this.dialogues[actor][state].responses[response - 1] || response;
      } catch(e){
        console.log(e);
      }
        var response_dialogue = this.__getDialogue(actor,response);
        if ((/[^null]/g && /[^undefined]/g).test(response_dialogue)){
          
            //
            // If its an integer response, move the dialogue state as this is a
            // response choice
            //
            if (parseInt(response)){
                state = response_dialogue.next;
                this.__setState(actor, player, state);
                dialogue = this.__getDialogue(actor,state);
            } else {
            //
            // ... otherwise this was a "what about the [item]" type of choice
            // so we return the dialogue but don't modify the state
            //
                dialogue = response_dialogue;
            }
        } 
        //
        // Process events
        //
    } else {
      console.log('calkowicie pominalem funkcje');
        dialogue = this.__getDialogue(actor,state);
    }

    if ((/[null]/g || /[undefined]/g).test(dialogue)) return null;
    //
    // Process responses
    //
    var responses = new Array();
    if (dialogue.responses){
        for (var r in dialogue.responses){
            var response = this.__getDialogue(actor,dialogue.responses[r]);
            responses.push({id:response.id, text:response.text});
        }
    }
    var dialogue_processed = dialogue_processed || {};
    dialogue_processed.text = dialogue.text;
    dialogue_processed.responses = responses;
    //
    // Move the conversation on
    //
    if (dialogue.next){
        this.__setState(actor, player, dialogue.next);
    }
    return dialogue_processed;
}

/*
 * Parse a simple dialogue tree file
 */
parse = function(actor, text){
   var lines = text.match(/^.*((\r\n|\n|\r)|$)/gm);
   for (var line in lines){
        var dialogue_line =  lines[line];
        var dialogue = dialogue || {};
        //
        // Each line starts with a number (the id) or a word (topic)
        //
        dialogue.id = parseInt(dialogue_line);
        if (isNaN(dialogue.id)){
            dialogue.id = dialogue_line.substr(0, dialogue_line.indexOf(":"));
            dialogue_line = dialogue_line.substr(dialogue.id.toString().length+1);
        } else {
            dialogue_line = dialogue_line.substr(dialogue.id.toString().length);
        }
        //
        // At the end is either a choice [1,2] or a next -> indicator
        //
        if (dialogue_line.indexOf("->") != -1){
            var str = dialogue_line.split("->");
            dialogue_line = str[0];
            dialogue.next= parseInt(str[1]);
        }
        if (dialogue_line.indexOf("[") != -1){
            var choices = dialogue_line.substr(dialogue_line.indexOf("["));
            dialogue.responses = JSON.parse(choices);
            dialogue_line = dialogue_line.split("[")[0];
        }
        dialogue.text = dialogue_line.trim();
        this.__setDialogue(actor, dialogue);
    }
}

/*
 * Loads a dialogue file
 * @param actor the actor to associate with the dialogue
 * @file the path to the file
 * @return a dialogue object
 */
  load = function(actor, data){
    this.parse(actor, data);
  }
}



