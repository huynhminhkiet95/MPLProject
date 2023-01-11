import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.sendRequest();
  }
  sendRequest()
  {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "https://cloud.mplogistics.vn:9090/nextcloud/index.php/apps/oauth2/authorize?access_token=c9Twdd4ekbbTogUqAD7oVqdCSHGM1Ylsuv6B4g90poQ1tm4WPIDiMujxCbMYsg7YWeJm4sXe");
    xhr.setRequestHeader("authorization", "Bearer CJ84GkwpKznnYTcEt3vTMjKTRdqJm2VGcytjplr82FWzJjna4Hujg3C1dGVlvOAGADMXdDXm");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "85803710-13f2-eb15-7750-4f03afc055aa");

    xhr.send(data);
  }
}
