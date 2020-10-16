import { Controller, Get,Post,Put,Body, Param  } from '@nestjs/common';
// import { AppService } from './app.service';
// var odoo_connection= require("./db_connection");

var Odoo_lib = require('./rpc_lib');
var odoo = new Odoo_lib({
    url: "localhost",
    port: 8069,
    db: "odoov8",
    username: "admin",
    password: 1,
});

// module.exports = odoo;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // @Get('/abc')
  // getHello(): string {
  //   console.log("zahid");
  //   return this.appService.getHello();
  // }

  @Get('/getpartners1')
  getPartners(){
    var self=this;
    console.log("entered getpartners");
    odoo.print(); 
    odoo.connect(function (err) {
      if (err) { return console.log(err); }
      console.log('Connected to Odoo server.');
      var inParams = [];
      inParams.push(['|',['is_company', '=', true],['is_company', '=', false]]);
      inParams.push(0);  //offset
      inParams.push(1000);  //Limit
      var params = [];
      params.push(inParams);
      odoo.execute_kw('res.partner', 'search', params, function (err, value) {
          if (err) { return console.log(err); }
          console.log('ids.',value);
          var inParams = [];
          inParams.push(value); //ids
          inParams.push(['name', 'email', 'phone', 'mobile']); //fields
          var params = [];
          params.push(inParams);
          odoo.execute_kw('res.partner', 'read', params, function (err2, value2) {
              if (err2) { return console.log(err2); }
              console.log("result",JSON.stringify(value2))
              return JSON.stringify(value2);
          });
      });
  });
  }

  @Put('/update/:id')
  updatePartner(@Param('id') id, @Body() contactData){
    console.log("body",contactData);
    odoo.connect(function (err) {
      const record_id= Number(id);
      if (err) { return console.log(err); }
      console.log('Connected to Odoo server.');
      var inParams = [];
      inParams.push([['active', '=', true],['id', '=', record_id]]);
      inParams.push(0);  //offset
      inParams.push(1);  //Limit
      var params = [];
      params.push(inParams);
      odoo.execute_kw('res.partner', 'search', params, function (err, value) {

          if (err) { return console.log(err);
          if(!value){
            return console.log("Record not found.");
          } 
        }
          console.log('ids.',value);
          var inParams = [];
          inParams.push([record_id]); //id to update
        inParams.push({'name': contactData.name,'email':contactData.email,'phone':contactData.phone,'mobile':contactData.mobile});
        console.log("inParams"+inParams);
          var params = [];
          params.push(inParams);
          odoo.execute_kw('res.partner', 'write', params, function (err, value) {
            if (err) { return console.log(err); }
            console.log('Result: ', value);
            return "Updated Successfully, Id:"+value;
        });
      });
  });
  }


}
