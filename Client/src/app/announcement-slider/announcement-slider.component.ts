import { Component, OnInit } from '@angular/core';
import { } from 'jquery';
import { FacilityBookingService, CommonService, AnnounceService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-announcement-slider',
  templateUrl: './announcement-slider.component.html',
  styleUrls: ['./announcement-slider.component.css']
})
export class AnnouncementSliderComponent implements OnInit {
    //@Input() data: any = {};
    data:any={};
    id:string;
    themes:any={};
    listAnnounce=[];
    constructor(
      public svc: FacilityBookingService,
      public commonSvc:CommonService,
      private router: Router,private route: ActivatedRoute,
      private announceSvc:AnnounceService
    
    ) {

    }

    ngOnInit() {
        this.id = this.route.params["_value"].id;
        this.themes.img=this.route.params["_value"].theme;
        this.themes.image ='url(../assets/img/bg/'+this.themes.img + ')';
        this.announceSvc.getByListId(this.id).subscribe(
          data=>{
            this.listAnnounce=data["payload"];
          }
        );
        // this.svc.getById(this.id,1,'S1').subscribe(
        //     data=>{
        //         this.data=data["payload"];
        //         this.data.bookMemo=this.data.bookMemo.replace(/\r?\n/g, '<br />')
        //         this.data.bookDateStart=this.commonSvc.convertMilisecondToUTCDateTime(this.data.bookDateStart,"LLL");
        //         this.LoadPage();
        //     },error=>{

        //     }
        // )
        this.LoadPage();

    }
    LoadPage()
    {
        $('#main-content').css({ 'height': $(window).height() });
        $(window).resize(function(){
            $('#main-content').css({ 'height': $(window).height() });
        })
        // Define a blank array for the effect positions. This will be populated based on width of the title.
        var bArray = [];
        // Define a size array, this will be used to vary bubble sizes
        var sArray = [4, 6, 8, 10];

        // Push the header width values to bArray
        for (var i = 0; i < $('.bubbles').width(); i++) {
            bArray.push(i);
        }

        // Function to select random array element
        // Used within the setInterval a few times
        function randomValue(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        // setInterval function used to create new bubble every 350 milliseconds
        setInterval(function () {

            // Get a random size, defined as variable so it can be used for both width and height
            var size = randomValue(sArray);
            // New bubble appeneded to div with it's size and left position being set inline
            // Left value is set through getting a random value from bArray
            $('.bubbles').append('<div class="individual-bubble" style="left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');

            // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
            // Callback function used to remove finsihed animations from the page
            $('.individual-bubble').animate({
                'bottom': '100%',
                'opacity': '-=0.7'
            }, 3000, function () {
                $(this).remove()
            }
            );

        }, 350);
    }

}
