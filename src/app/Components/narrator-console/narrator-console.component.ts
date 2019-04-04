import { Component, OnInit, Output } from '@angular/core';
import { CommandSupportService } from '../../Services/command-support.service';
import {DialoguesService} from '../../Services/dialogues.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-narrator-console',
  templateUrl: './narrator-console.component.html',
  styleUrls: ['./narrator-console.component.css']
})

export class NarratorConsoleComponent implements OnInit {

  constructor(private dataCSS: CommandSupportService,
              private dialogueS: DialoguesService,) { }

  ngOnInit() {
    //It's waiting for new information from player console and open functions respectively
    this.dataCSS.getEventSubject().subscribe((command: string) => {
      if (command !== undefined) this.playerInput(command);
    });
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
    $('#narratorConsole').append(text + "<br>");
    $("#narratorConsole").scrollTop($("#narratorConsole")[0].scrollHeight);
    //$("html, #narratorConsole").animate({ scrollTop: $(document).height() }, "slow"); //Old scrolling
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
        if(typeof this.rooms[this.currentRoom].items[dir] === 'string'){
          this.writeText(this.rooms[this.currentRoom].items[dir]);
        } else this.rooms[this.currentRoom].items[dir]();
      } else this.writeText("Hmm?");
  }

  playerChangeInput(dir:string){
    this.currentState = dir;
  }
  
  playerInput(input:string){//m = menu, d = dialogue, f = fight, g = game
    switch(this.currentState){
      case 'd': this.playerDialogueInput(input); break;
      case 'g': this.playerGameInput(input); break;
      case 'f': this.playerFightInput(input); break;
      default: this.playerMenuInput(input); break;
    }
  }

  playerMenuInput(input:string){
    switch(input){
      case 'nowa gra': this.playerChangeInput('g'); this.writeText(this.rooms[this.currentRoom].start); break;
      case 'wczytaj': this.writeText('Not implemented yet'); break;
    }
  }

  playerGameInput(input:string){
    switch(input){
      case 'spojrz': this.writeText(this.rooms[this.currentRoom].description); break;
      case 'north': case 'south': case 'east': case 'west': this.changeRoom(input); break;
      case 'help': this.showHelp(); break;
      case 'pokaz': this.showBackPack(); break;
      default: switch(input.split(' ')[0]){
        case 'idz': this.changeRoom(input.split(' ')[1]); break;
        case 'uzyj': this.useItem(input.split(' ')[1]); break;
        case 'rozmawiaj': this.initiateDialogue(input.split(' ')[1]); break;
        default: this.writeText('Hmm?');
      }
    }
  }

  showBackPack(){
    for(var i = 0; i < this.player.backPack.length; i++){
      this.writeText(this.player.backPack[i]);
    }
  }

  playerFightInput(input:string){
  }

  initiateDialogue(actor:string){
    let flag;
    for(var i = 0; i < this.rooms[this.currentRoom].npc.length; i++){
      if(this.rooms[this.currentRoom].npc[i] === actor){
        flag = 1;
        break;
      }
    }
    console.log('flag:', flag);
    if(flag){
      this.playerChangeInput('d');
      this.dialogueS.parse(actor, this.dialoguesTable[actor]);
      this.currentActor = actor;
      this.playerInput('');
    }
  }

  playerDialogueInput(input:string){
    var dialogue = this.dialogueS.interact(this.currentActor, "gracz", input);
    console.log('dialogue: ', dialogue);
    if(dialogue){
      if(dialogue.text === 'koniec'){
        this.playerChangeInput('g');
        console.log('zmienilem tryb na:', this.currentState);
        this.writeText("Zakończyłeś dialog!");
      }else if(dialogue){
        this.writeText(dialogue.text);
        if(dialogue.responses) {
          for(var i = 0; i < dialogue.responses.length; i++){
           this.writeText('[' + (i+1) + '] ' + dialogue.responses[i].text);
          }
        }
      }
    }
  }

  showHelp(){
    this.writeText('Lista wszystkich możliwych komend:')
    for (var i = 0; i < this.commands.length; i++){
      this.writeText(this.commands[i])
    }
  }

  addToBackPack(quantity:number, id:string){
    if(id === "0001"){
      this.player.gold =+ quantity;
    } else {
      this.player.backPack.push(id);
    }
    return false;
  }

  currentActor = 'default';
  currentDialogue = "default";
  currentState = 'm';
  previousRoom = "default";
  player = {
    "equipment": {
      "head": "",
      "torso": "",
      "legs": "",
      "weapon": "",
    },
    "backPack": [],
    "gold": 0,
  }
  currentRoom = "2";
  quests = {
    "1": {
      "id": "1",
      "status": "notStarted",
      "name": "Księga z ziołami",
    },
  };
  commands = ['idź [gdzie]', 'podnieś [co]', 'spójrz', 'rozmawiaj [imie]', 'użyj [co]', 'zapisz [nazwa]', 'wczytaj [nazwa]', 'załóż [co]'];
  items = {
    "0001": {
      "name": "Złota moneta",
      "value": 1,
    },
    "0002": {
      "name": "Onuce",
      "value": 5,
      "equipment": "legs",
      "defense": 1,
    },
  }
  tutor = {
    "1": "Tutor: Witaj w grze „Ku chwale Gothica”. Nie bój się. Podstawowych komend i zasad gry nauczysz się w trakcie tego prologu. Jeżeli chcesz wyświetlić wszystkie dostępne w grze komendy wpisz <b>help</b>. Aktualnie znajdujesz się w jednej z setek lokacji, które przyjdzie ci zwiedzać. Aby rozejrzeć się po okolicy użyj polecenia <b>spojrz</b>. Zrób to teraz.",
    "2": "Tutor: Aby wejść w interakcję z otoczeniem wystarczy wpisać polecenie <b>użyj</b>. Spróbuj otworzyć komodę.",
    "3": "Tutor: Podczas gry napotkasz wiele miejsc, w których mogą być ukryte ciekawe przedmioty, te nieciekawe jak również absolutnie nic.",
    "4": "Tutor: Znalazłeś element ekwipunku. Aby go ubrać należy użyć polecenia <b>załóż</b>.",
    "5": "Tutor: Spotkałeś pierwszą postać niezależną (NPC). Postaci te będziesz spotykał niezwykle często. Idź porozmawiać z Kapłanem. Aby to zrobić użyj polecenia <b>rozmawiaj</b>.",
    "6": "Tutor: Otrzymałeś właśnie dokument. Dokumenty można czytać za pomocą polecenia <b>czytaj</b>.",
  };
  rooms = {
    "1": {
      "start": "Budzisz się. Ostre światło razi twe jeszcze senne oczy. Znajdujesz się w surowym, zbudowanym z marmuru pomieszczeniu. Wstajesz z drewnianego łóżka.",
      "tutor": "Tutor: Witaj w grze „Ku chwale Gothica”. Nie bój się. Podstawowych komend i zasad gry nauczysz się w trakcie tego prologu. Jeżeli chcesz wyświetlić wszystkie dostępne w grze komendy wpisz <b>help</b>. Aktualnie znajdujesz się w jednej z setek lokacji, które przyjdzie ci zwiedzać. Aby rozejrzeć się po okolicy użyj polecenia <b>spojrz</b>. Zrób to teraz.",
      "description": "Rozglądasz się po marmurowym pokoju. Na północy widzisz okute drewniane drzwi. Przy wschodniej ścianie stoi komoda. Przy południowej łóżko na którym spałeś. Od zachodniej ściany bije jasne, kolorowe światło słoneczne przedostające się przez wielobarwny witraż.",
      "items": {
        "komoda": function() {this.addToBackPack(10,'0001');this.addToBackPack(1,'0002')},
        "lozko": function() {alert("Nie chcę mi się spać.")},
      },
      "directions": {
        "north": "2"
      }
    },
    "2": {
      "start": "Otwierasz cięższe niż myślałeś drewniane drzwi i wchodzisz do zdecydowanie większego, również marmurowego pomieszczenia. Po wystroju poznajesz, że jest to świątynia.",
      "description": "Przy wschodniej ścianie, przy ołtarzu stoi Kapłan Verdes. Na zachodzie widzisz ogromne metalowe drzwi prawdopodobnie prowadzące na zewnątrz budynku. Północną ścianę pokrywa istna wystawa rozmaitych wiraży, a pod nimi kolejne drewniane drzwi. Na południu również znajdują się drzwi.",
      "directions": {
        "north": "3",
        "south": "1",
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
}



