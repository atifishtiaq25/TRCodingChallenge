import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Image } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  private apiKey = '6ad82343b5f33d55812dc2208820cc2c';
  private apiUrl = 'https://api.flickr.com/services/rest/';

  constructor(private http: HttpClient) { }

  searchImages(query: string[]): Observable<Image[]> {
    const params = {
      method: 'flickr.photos.search',
      api_key: this.apiKey,
      tags: query.join(','),
      sort: 'interestingness-desc',
      per_page: '1',
      extras: ['date_upload', 'date_taken', 'owner_name', 'views', 'url_q'],
      format: 'json',
      nojsoncallback: true
    };
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<any>(this.apiUrl, { params, headers }).pipe(
      map((response: any) => {
        if (response && response.photos && response.photos.photo) {
          return response.photos.photo.map((photo: any) => {
            return {
              id: photo.id,
              title: photo.title,
              url: photo.url_q,
              tag: params.tags,
              views: response.photos.photo.views,
              owner: response.photos.owner_name,
              uploadDate: response.photos.photo.date_upload,
              takenDate: response.photos.photo.date_taken
            };
          }) as Image[];
        } else {
          return [];
        }
      })
    );
  }
}