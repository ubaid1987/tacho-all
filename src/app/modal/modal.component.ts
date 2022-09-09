import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-modal",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit {
    @Input() modalTitle: string = '';
    @Input() modalText: any = '';
    @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit() {

    }

    close(event:any) {
        this.closeModal.emit(event);
    }
    async print(e:any){
        const img:any = document.getElementById('source-image')
        await fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
        const file = new File([blob], 'source.png', blob)
        var reader = new FileReader();
        reader.onloadend = function() {
          const pimg:any=document.getElementById("print-image")
          pimg.src=reader.result
          console.log(pimg);
        }
        reader.readAsDataURL(file);
        })
        setTimeout(function(){
            var printContent = document.getElementById('print-view');
            var WinPrint:any = window.open('', '', 'width=900,height=650');
            WinPrint.document.write(printContent?.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
        },1000)
        

    }

    async encodeImageFileAsURL() {

      }
} 