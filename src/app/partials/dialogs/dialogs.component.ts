import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Friends } from 'src/app/models/friends.model';

export interface DialogData {
  message: string;
  recipient: string;
  comment: string;
}

export interface RecommandationData {
  friends: Friends[],
  exception: Friends
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
    public dialogRef: MatDialogRef<CommentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: RecommandationData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}