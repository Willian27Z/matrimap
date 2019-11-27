import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Friends } from 'src/app/models/friends.model';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';

export interface DialogData {
  message: string;
  recipient: string;
  comment: string;
}

export interface RecommandationData {
  friends: Friends[],
  exception: Friends,
  pseudo: string
}

export interface DiscussionData {
  friendOptions: Friends[],
  owner: string,
  participants: string[],
  subject: string,
  messageInitial: string,
  date: Date,
}

// DIALOG FOR ASKING CONFIRMATION FOR ANYTHING
@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.html',
  })
  export class ConfirmationDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
  }

// DIALOG FOR SENDING MESSAGE
@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.html',
})
export class MessageDialog {

  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// DIALOG FOR COMMENTING
@Component({
  selector: 'comment-dialog',
  templateUrl: 'comment-dialog.html',
})
export class CommentDialog {

  constructor(
    public dialogRef: MatDialogRef<CommentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


// DIALOG FOR RECOMMANDATIONS
@Component({
  selector: 'recommandation-dialog',
  templateUrl: 'recommandation-dialog.html',
})
export class RecommandationDialog {

  constructor(
    public dialogRef: MatDialogRef<RecommandationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: RecommandationData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// DIALOG FOR STARTING A NEW PRIVATE DISCUSSION
@Component({
  selector: 'new-discussion-dialog',
  templateUrl: 'new-discussion-dialog.html',
  styles: ['.error {color:red;font-size:0.7em;margin-top:0;text-align:left;}']
})
export class NewDiscussionDialog {

  friends: Friends[] = null;
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFriends: Observable<Friends[]>;
  selectedFriends: Friends[] = [];
  friendCtrl = new FormControl();
  subjectCtrl = new FormControl('', [Validators.required]);
  messageCtrl = new FormControl('', [Validators.required]);
  //allFriends: string[] = null;  //names

  @ViewChild('friendInput', {static: false}) friendInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  constructor(
    public dialogRef: MatDialogRef<NewDiscussionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DiscussionData,
  ) 
  {
    this.filteredFriends = this.friendCtrl.valueChanges.pipe(
        startWith(null),
        map((friend: string | null) => friend ? this._friendFilter(friend) : this.friends.filter(e => e.status === "confirmed" && !this.selectedFriends.includes(e)))
    );
    this.friends = data.friendOptions;
    data.participants = this.selectedFriends.map(e => e.id);
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        // find pseudo in friends names
        let friendSelected: Friends = this.friends.find(e => e.pseudo.toLowerCase() === value.trim().toLowerCase())
        if(friendSelected){
          this.selectedFriends.push(friendSelected);
          this.data.participants = this.selectedFriends.map(e => e.id);
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.friendCtrl.setValue(null);
    }
  }

  remove(friend: Friends): void {
    const index = this.selectedFriends.indexOf(friend);

    if (index >= 0) {
      this.selectedFriends.splice(index, 1);
      this.data.participants = this.selectedFriends.map(e => e.id);
      this.friendCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // add value to the selected array
    let selectedFriend = this.friends.find(e => e.pseudo === event.option.value);
    if(selectedFriend){
      this.selectedFriends.push(selectedFriend);
    }
    this.data.participants = this.selectedFriends.map(e => e.id);
    //this.selectedFriends.push(event.option);
    // changes the value on the input
    this.friendInput.nativeElement.value = '';
    // resets value on form control
    this.friendCtrl.setValue(null);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }
  private _friendFilter(value: string): Friends[] {
    const filterValue = value.toLowerCase();

    return this.friends.filter(friend => {
      return (
        friend.pseudo.toLowerCase().includes(filterValue)
        // add first and last name here after backend upgrade
      ) && friend.status === "confirmed"
        && !this.selectedFriends.includes(friend)});
  }

  

  onNoClick(): void {
    this.dialogRef.close();
  }
}