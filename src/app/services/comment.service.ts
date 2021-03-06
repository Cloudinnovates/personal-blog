import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';

import { Comment } from '../shared/comment'

@Injectable()
export class CommentService {

  private commentsURL = 'https://personal-blog-api.herokuapp.com/comments/';  // URL to web api
  //private commentsURL = 'http://localhost:3000/comments/';  // URL to web api

  constructor(private http: Http, private userService: UserService) { }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get(this.commentsURL)
      .map(response => response.json() as Comment[])
      .catch(this.handleError);
  }

  getComments(id: number): Observable<Comment[]> {
    return this.getAllComments().map(x => x.filter(comment => comment.id_post == id));

  }

  create(content: String, id_post: Number): Observable<Comment> {
    // add authorization header with jwt token and application/json header so otherwise it wouldnt let me create comments!
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.userService.token, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var new_comment = JSON.stringify({id_user: currentUser.id, id_post: id_post, content: content, author: currentUser.name, published_at: new Date(), avatar: currentUser.avatar });
  
    return this.http
      .post(this.commentsURL, new_comment, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

    upvote(comment : Comment) {
          // add authorization header with jwt token and application/json header so otherwise it wouldnt let me create comments!
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.userService.token, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    comment.upvote += 1;

    return this.http
      .put(this.commentsURL + comment.id , comment, options)
      .map(res => res.json())
      .catch(this.handleError);

  }

    downvote(comment : Comment) {
          // add authorization header with jwt token and application/json header so otherwise it wouldnt let me create comments!
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.userService.token, 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    comment.upvote -= 1;

    return this.http
      .put(this.commentsURL, comment, options)
      .map(res => res.json())
      .catch(this.handleError);

  }


}
