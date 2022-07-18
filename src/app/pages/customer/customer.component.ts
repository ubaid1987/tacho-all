import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import {Customer} from './customer'
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'src/app/modal/modal.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  itemID = 1;
  sessionID = '';
  account_id=0
  api_fld_acc='Account'
  api_fld_com='Company'
  api_fld_ins='Inspecter'
  api_fld_site='Site'
  
  customer_fields:any={}
  model:any={}
  ctime:number = new Date().getTime();
  submitted = false;
  fld_acc_id=0
  fld_com_id=0;
  fld_ins_id=0;
  fld_site_id=0;
  
  onSubmit() { 
   
  }

  newCustomer() {

    this.submitted = true;
   // console.log(this.model,this.model.company_name);

/**
 * 
 * Update API of Customer Document's Account custom fields 
 * 
 */
    const p1= '{\"svc\":\"item/update_custom_field\",\"params\":{\"id\":'+this.fld_acc_id+',\"n\":\"'+this.api_fld_acc+'\",\"v\":\"'+this.model.account_name+'\",\"itemId\":'+this.account_id+',\"callMode\":\"update\"}},'
    const p2= '{\"svc\":\"item/update_custom_field\",\"params\":{\"id\":'+this.fld_com_id+',\"n\":\"'+this.api_fld_com+'\",\"v\":\"'+this.model.company_name+'\",\"itemId\":'+this.account_id+',\"callMode\":\"update\"}},'
    const p3= '{\"svc\":\"item/update_custom_field\",\"params\":{\"id\":'+this.fld_ins_id+',\"n\":\"'+this.api_fld_ins+'\",\"v\":\"'+this.model.inspecter_name+'\",\"itemId\":'+this.account_id+',\"callMode\":\"update\"}},'
    const p4= '{\"svc\":\"item/update_custom_field\",\"params\":{\"id\":'+this.fld_site_id+',\"n\":\"'+this.api_fld_site+'\",\"v\":\"'+this.model.site_name+'\",\"itemId\":'+this.account_id+',\"callMode\":\"update\"}}'

    const param = '{\"params\":['+p1+p2+p3+p4+'],\"flags\":0}'
    var formData: any = new FormData();
    formData.append('params',param);
    formData.append('sid', this.sessionID);
    this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&sid=' + this.sessionID, formData).subscribe((res1: any) => {
        console.log(res1)
    })

  }
  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private modalService: ModalService,
    private viewContainerRef: ViewContainerRef) { 
    const queryParams = window.location.search;
    const searchParams = new URLSearchParams(queryParams);
   
    let sid: any = searchParams.get('sid');
    let user: any = searchParams.get('user');
if (!sid) {
  sid = searchParams.get('?sid');
  sid = searchParams.get('user');
}
if (!sid) {
  sid = sessionStorage.getItem('sid');
}

if (typeof (Storage) !== 'undefined') {
  // Store
  sessionStorage.setItem('sid', sid);
  sessionStorage.setItem('user', user);
}
this.sessionID = sid ? sid : sessionStorage.getItem('sid');

}

  ngOnInit(): void {
    
/**
 * 
 * Get Customer Document User ID
 * 
 */

   let sessionID = this.sessionID;
    this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={\"spec\":{\"itemsType\":\"user\",\"propName\":\"sys_name\",\"propValueMask\":\"Customer Document*\",\"sortType\":\"sys_name\"},\"force\":1,\"flags\":1,\"from\":0,\"to\":0}&sid=' + sessionID).subscribe((res: any) => {
    this.doProcessData(res);
    })
    
    
  }

  doProcessData(users: any) {
    console.log(users)
    let acc_name=''
    let com_name=''
    let ins_name=''
    let site_name=''
    if(users.items.length >0){

/**
 * 
 * Get Customer Document  custom fields Ids' from API
 * And populate to class variables
 * 
 */  
      this.account_id= users.items[0].id 
      const flag1 = 4294967295  
      var formData0: any = new FormData();
      formData0.append('params','{\"id\":'+this.account_id+',\"flags\":'+flag1+'}');
      formData0.append('sid', this.sessionID);
      this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item&sid=' + this.sessionID, formData0).subscribe((res0: any) => {
          console.log(res0.item.flds)
          this.customer_fields = res0.item.flds
         
          Object.keys(this.customer_fields).forEach((key1: any) => {
            let fld_id = this.customer_fields[key1].id
            let fld_name = this.customer_fields[key1].n
            let fld_val = this.customer_fields[key1].v
            console.log(fld_name,fld_name)
            switch (fld_name){
                case this.api_fld_acc:
                  acc_name=fld_val;
                  this.fld_acc_id=fld_id;
                  break;
                case this.api_fld_com:
                  com_name=fld_val;
                  this.fld_com_id=fld_id;

                  break;
                case this.api_fld_ins:
                  ins_name=fld_val;
                  this.fld_ins_id=fld_id;

                  break;
                case this.api_fld_site:
                  site_name=fld_val;
                  this.fld_site_id=fld_id;

                  break;
                
            }
      
          })
      
          this.model = new Customer( acc_name,com_name, ins_name,site_name,this.ctime,this.ctime);
      
        //console.log(this.model)

      })
      
     
    
    } 

  }
  
}
