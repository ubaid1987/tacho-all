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
    print(e:any){
        var printContent = document.getElementById('print-view');
        var WinPrint:any = window.open('', '', 'width=900,height=650');
        WinPrint.document.write(printContent?.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();

    }
} 