import { Component, OnInit, Input } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { CommonService, FileService } from '../../../_services';

@Component({
  selector: 'app-photogallery',
  templateUrl: './photogallery.component.html',
  styleUrls: ['./photogallery.component.css']
})

export class PhotogalleryComponent implements OnInit {

  @Input() isShowCategory: boolean;
  @Input() sliderWidth: string;
  @Input() sliderHeight: string;
  @Input() thumbnailsColumns: number;
  @Input() gallerydetai: string;
  @Input() id: number;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  isLoading: boolean = false;
  listTypes: any = [];
  
  constructor(private commonSvc: CommonService,
    private fileSv: FileService) { }

  ngOnInit() {
    this.galleryOptions = [
      {
        width: this.sliderWidth,//'100%',
        height: this.sliderHeight,//'300px',
        thumbnailsColumns: this.thumbnailsColumns || 10,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // {
      //   breakpoint: 800,
      //   width: '100%',
      //   height: '600px',
      //   imagePercent: 80,
      //   thumbnailsPercent: 20,
      //   thumbnailsMargin: 20,
      //   thumbnailMargin: 20
      // },
      {
        breakpoint: 400,
        preview: false,
        imageDescription: true
      }
    ];
    if (this.gallerydetai == 'GalleryDetai') {
      this.GetGalleryByID(this.id);
    }
    else {
      this.GetGalleryByType('ALL');
    }

    this.commonSvc.getStdcodesByCode('GALLERY').subscribe(
      data => {
        this.listTypes = data["payload"];
      }
    );
  }

  GetGalleryByType(type: string) {
    this.fileSv.GetGalleryByType(type).subscribe(
      data => {

        this.galleryImages = data["payload"];
        this.isLoading = false;
      }
    )
  }

  GetGalleryByID(id: number) {
    this.commonSvc.getGalleryByID(id).subscribe(
      data => {
        this.galleryImages = data["payload"];
        this.isLoading = false;
      }
    )
  }
}
