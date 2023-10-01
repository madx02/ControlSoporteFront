import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visits-attention',
  templateUrl: './visits-attention.component.html',
  styleUrls: ['./visits-attention.component.css']
})
export class VisitsAttentionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<VisitsAttentionComponent>, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.data.urlMap);

  }

  get safeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.urlMap);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
