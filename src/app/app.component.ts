import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FlickrService } from '../services/flickr.service';
import { Image } from '../interfaces/image.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatChipsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent {
  @ViewChild('searchForm') searchForm!: NgForm;
  searchQuery = "" ;
  searchTags: string[] = []
  savedTags: string[] = [];
  images: Image[] = [];
  inputFormControl = new FormControl(this.searchQuery, [Validators.required]);

  title = 'TRCodingChallenge';

  constructor(private flickrService: FlickrService) {}

  searchImages(query: string): void {
    this.searchTags = this.searchQuery.split(' ');
    this.searchTags.forEach(tag => {
      if (!this.savedTags.includes(tag)) {
        this.savedTags.push(tag);
      }
    })
    this.flickrService.searchImages(this.searchTags).subscribe((images: Image[]) => {
      if (this.images.length === 0) {
        this.images = images;
      } else {
        this.images.concat(images);
        this.images.push.apply(this.images, images);

      }
      this.resetInput();
    });
  }
  resetInput() {
    this.searchTags = [];
    if (this.searchForm) {
      this.searchQuery = "";
      this.searchForm.resetForm();
    }
  }
}
