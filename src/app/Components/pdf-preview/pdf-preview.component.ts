import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.css']
})
export class PdfPreviewComponent implements OnInit{

  pdfURL: SafeResourceUrl | null = null; // Initialize as null


  constructor(
    private route: ActivatedRoute,
    private helpService: HelpService,
    private sanitizer: DomSanitizer
  ) {}


  ngOnInit() {
    const id = this.route.snapshot.params['id'];


    this.helpService.getPDFContent(id).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);


      // Sanitize the URL to prevent security issues
      this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }


}
