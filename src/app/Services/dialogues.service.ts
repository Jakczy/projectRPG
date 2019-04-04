import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialoguesService {

  constructor() { }
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
      if (!this.dialogue_states[actor]) this.dialogue_states[actor] = {};
      var actor_state = this.dialogue_states[actor][player];
      actor_state = actor_state || 0;
      return actor_state;
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
    let state = this.__getState(actor, player);
    let dialogue;
    //
    // If a response id is passed along, see if it matches a dialogue element
    //
    console.log("response:", response);
    if (response && (/[^null]/g && /[^undefined]/g).test(this.dialogues[actor][state].responses)){
      response = this.dialogues[actor][state].responses[response - 1] || response;
      var response_dialogue = this.__getDialogue(actor,response);
      console.log("response_dialogue:", response_dialogue);
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
}
