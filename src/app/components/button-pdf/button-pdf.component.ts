import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface Itemfile {
  name: string;
  type: string;
  content: string | ArrayBuffer | null;
}

@Component({
  selector: 'button-pdf',
  templateUrl: './button-pdf.component.html',
  styleUrl: './button-pdf.component.css',
})
export class ButtonPdfComponent implements AfterViewInit {
  allowMultipleFiles = true;
  dragOver = false;
  selectedFile: Itemfile[] = [];
  errorMessage: string = '';
  pdfSrcList: SafeResourceUrl[] = [];

  @ViewChild('inputFileElement') inputFileElement!: ElementRef;
  @ViewChild('dropArea') dropArea!: ElementRef;

  private renderer2 = inject(Renderer2);

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.listenDragOver();
    this.listenDragLeave();
    this.listenDrop();
  }

  openSelectedFileDialog(): any {
    this.inputFileElement.nativeElement.value = null;
    this.inputFileElement.nativeElement.click();
  }

  onSelectedFiles(evt: any) {
    let files = Array.from(evt.target.files);
    files.forEach((file) => this.pushFileinArray(file));
  }

  pushFileinArray(file: any): void {
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Por favor seleccione un archivo en formato PDF';
      throw new Error('Por favor seleccione un archivo en formato PDF');
    }

    const fileAlreadyExist = this.selectedFile.find(
      (f) => f.name === file.name
    );
    if (fileAlreadyExist) {
      this.errorMessage = 'Archivo ya ingresado';
    }

    if (!this.allowMultipleFiles) {
      this.selectedFile = [];
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let item: Itemfile = {
        name: file.name,
        type: file.type,
        content: reader.result,
      };
      this.selectedFile.unshift(item);
      const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        item.content as string
      );
      this.pdfSrcList.unshift(pdfUrl);
      console.log('ITEM', item.name);
      this.errorMessage = '';
    };
  }

  listenDragOver(): void {
    this.renderer2.listen(
      this.dropArea.nativeElement,
      'dragover',
      (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = true;
      }
    );
  }

  listenDragLeave(): void {
    this.renderer2.listen(
      this.dropArea.nativeElement,
      'dragleave',
      (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = false;
      }
    );
  }

  listenDrop(): void {
    this.renderer2.listen(
      this.dropArea.nativeElement,
      'drop',
      (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = false;

        const files = Array.from(event?.dataTransfer?.files ?? []);
        files.forEach((f) => this.pushFileinArray(f));
      }
    );
  }

  // TODO: remove file button
  removeFile(file: Itemfile): void {
    this.selectedFile = this.selectedFile.filter((f) => f !== file);
    this.pdfSrcList = this.pdfSrcList.filter((f) => f !== file);
  }

  resetFiles(): void {
    this.errorMessage = '';
    this.selectedFile = [];
    this.pdfSrcList = [];
  }

  sendFiles(): void {
    //TODO: build destination of files
    console.log('PDFs a Enviar', this.selectedFile);
    this.selectedFile = [];
    this.pdfSrcList = [];
  }
}
