import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
interface Course
{
  courseId: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  isEnrolled: boolean;
}
interface CourseFeedback
{
  courseFeedback:string,
  courseId:number,
  name:string,
  courseRating:number
}
export interface Student
{
  studentName: string;
  studentEmail: string;
  studentPassword: string;
}interface Enrollment
{
  enrollmentId:number,
  studentId:number,
  courseId:number
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private getallurlcourse='http://localhost:8081/course/getAll';
  //private geturlstudent='http://localhost:8001/api/addStudent';
  private enrollurl='http://localhost:8081/enrollment/enroll';
  private enrollstudentUrl='http://localhost:8081/enrollment/student/1';
  private feedbackUrl='http://localhost:8081/feedback/addFeedback';
  private assignmentUrl='http://localhost:8081/assignment/submit';
  private coursefeedbackUrl='http://localhost:8081/feedbackcourses/addFeedback';
  private registerurl='http://localhost:8081/api/addStudent';
  private loginurl='http://localhost:8081/api/token';
  constructor(private http: HttpClient,private router: Router){}

  token:string='' 
  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  }
  getAllCourses(): Observable<Course[]>
  {
    const headers = this.getHeaders();
    //console.log("headers   :",headers)
    //console.log("token   :",this.getToken())
    return this.http.get<Course[]>(this.getallurlcourse,{headers});
  }
  enrollStudent(studentId:number, courseId:number): Observable<any>
  {
    const headers=this.getHeaders();
    console.log(studentId,courseId)
    const enrollmentData={"studentId":studentId,"courseId":courseId};
    return this.http.post<any>(this.enrollurl,enrollmentData,{headers});
  }
  getEnrolledCourses(studentId:number): Observable<Enrollment[]> 
  {
    const headers=this.getHeaders();
    return this.http.get<Enrollment[]>(this.enrollstudentUrl);
  }
  submitFeedback(f:{name:string,feedbackDescription:string}):Observable<any>
  {
    const headers=this.getHeaders();
    return this.http.post<any>(this.feedbackUrl,f,{headers});
  }
  submitAssignment(file:File):Observable<any>
  {
    const formData=new FormData();
    formData.append('file',file,file.name);
    formData.append('enrollmentID','1'); 
    const headers=new HttpHeaders();
    return this.http.post(this.assignmentUrl,formData,{headers,responseType:'text'});
  }
  submitCourseFeedback(f:{
    courseFeedback:string,courseId:number,courseName:String,courseRating:number}):Observable<any>
  {
    const headers=this.getHeaders(); 
    return this.http.post<any>(this.coursefeedbackUrl,f,{headers});
  }
  register(student:{studentName:string,studentEmail:string,studentPassword:string}):Observable<any>
  {
    return this.http.post(this.registerurl,student)
  }
  login(s:{studentEmail:string,studentPassword:string}):Observable<any>
  {
    console.log("in service api",this.http.post<any>(this.loginurl,s))
    return this.http.post<any>(this.loginurl,s)
  }
  saveToken(token:string)
  {
    localStorage.setItem("JWTtoken",token)
    console.log("Token   :",token);
    this.token=token;
  }
  getToken():String|null
  {
    return localStorage.getItem("JWTtoken");
  }
}