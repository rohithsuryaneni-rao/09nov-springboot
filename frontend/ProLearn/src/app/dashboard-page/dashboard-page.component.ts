import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ApiService } from '../api.service';
interface Course 
{
  courseId:number;
  name: string;
  description: string;
  category: string;
  rating: number;
  isEnrolled:boolean
}
interface Enrollment
{
  enrollmentId:number;
  studentId:number;
  courseId:number;
}
interface Assignment 
{
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  status: string;
}
interface EnrolledCourse 
{
  name: string;
  description: string;
  status: string;
  progress: number;
  showFeedback?: boolean;
  feedbackText?: string;
}
interface Feedback
{
  name:string;
  feedbackDescription:string;
}
interface CourseFeedback
{
  courseFeedback:string,
  courseId:number,
  name:string,
  courseRating:number
}
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit{
constructor(private ApiService:ApiService,private fb:FormBuilder){}
  studentId=1;
  course:any;
  currentView: string = 'courses';
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedRating: string = '';
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  uniqueCategories: string[] = [];
  enrolledCourses:Course[]=[];
  courseFeedback = {
    courseFeedback: '',
    courseId: 0,
    courseName: '',
    courseRating: 0
  };
  performanceData = [
    { metricName: 'Course Completion', score: '80%', comparison: 'Above Average' },
    { metricName: 'Assignments Completed', score: '90%', comparison: 'Excellent' }
  ];
  //feedbackForm:FormGroup;
  ngOnInit(): void {
    this.loadCourses();
    this.getEnrolledCourses();
}
loadCourses(): void {
    this.ApiService.getAllCourses().subscribe({
        next:(courses)=> 
        {
            this.courses=courses;
            this.filteredCourses=this.courses; 
            this.enrolledCourses=this.courses.filter(course => course.isEnrolled); 
            this.uniqueCategories=this.getUniqueCategories(this.courses);
        },
        error:(err)=> 
        {
            console.error('Error fetching courses: ', err);
        }
    });
}

// ngDoCheck(): void {
//   this.getEnrolledCourses();
// }
 
  getUniqueCategories(filteredCourses: Course[]): string[] {
    return Array.from(new Set(this.courses.map(course=>course.category)));
  }

  filterCourses():void{
    this.filteredCourses=this.courses.filter(course=>{
      const matchesSearch=this.searchTerm
        ? course.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesCategory=this.selectedCategory ? course.category===this.selectedCategory:true;
      const matchesRating=this.selectedRating ? course.rating >= +this.selectedRating:true;
      return matchesSearch && matchesCategory && matchesRating;
    });
  }

  resetFilters():void {
    this.searchTerm ='';
    this.selectedCategory ='';
    this.selectedRating = '';
    this.filteredCourses = this.courses;
  }

  navigateTo(view: string): void {
    this.currentView = view;
  }

  submitAssignment(assignment: Assignment): void {
    console.log(`Submitted assignment: ${assignment.title}`);
  }

  addFeedback(): void {
    console.log('Adding feedback...');
    // Add feedback handling logic here
  }

  searchCourses(): void {
    this.filterCourses();
  }

  // onFileSelected(event: Event, assignment: Assignment): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput && fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //     console.log(`File selected for assignment ${assignment.title}: ${file.name}`);
  //   }
  // }

  enroll(courseId: number): void {
    this.ApiService.enrollStudent(this.studentId, courseId).subscribe(
        response => {
            console.log('Enrolled successfully:', response);
            // alert('You have been successfully enrolled in the course!');
            // console.log(this.courseId);
            let courseToEnroll = this.courses.find(course => course.courseId === courseId);
            if (courseToEnroll) {
                console.log(courseToEnroll);
                // Add the course to enrolledCourses if it's not already there
                if (!this.isEnrolled(courseToEnroll.courseId)) {
                    this.enrolledCourses.push(courseToEnroll);
                    alert(`You have been successfully enrolled in: ${courseToEnroll.name}`);
                } else {
                    alert('You are already enrolled in this course.');
                }
            }
            console.log(this.enrolledCourses);
        },
        error => {
            console.error('Error enrolling:', error);
            alert('Error enrolling in the course!');
        }
    );
   

}
isEnrolled(courseId: number): boolean {
    return this.enrolledCourses.some(course => course.courseId === courseId);
}
  

  toggleFeedback(enrolled: EnrolledCourse): void {
    enrolled.showFeedback = !enrolled.showFeedback; // Toggle feedback textbox visibility
  }

  submitFeedback(enrolled: EnrolledCourse): void {
    console.log(`Feedback for ${enrolled.name}:`, enrolled.feedbackText);
    enrolled.feedbackText = '';
    enrolled.showFeedback = false;
  }

  feedback = {
    name:"",
    feedbackDescription:""
  };
  

  
  // getEnrolledCourses(): void 
  // {
  //   this.ApiService.getEnrolledCourses(this.studentId).subscribe({
  //       next: (enrollments: Enrollment[]) => {
  //           this.enrolledCourses = enrollments.map((enrollment) => ({
  //               courseId: enrollment.courseId,
  //               name: `Course Name ${enrollment.courseId}`,
  //               description: `Description for course ${enrollment.courseId}`,
  //               category: 'Category for course',
  //               rating: 4,
  //               isEnrolled: true
  //           }));
  //       },
  //       error: (err) => {
  //           console.error('Error fetching enrolled courses: ', err);
  //       }
  //   });
  //   }
  getEnrolledCourses(): void {
    const TIMEOUT_DURATION = 1000; // Timeout in milliseconds (10 seconds)

    this.ApiService.getEnrolledCourses(this.studentId).subscribe({
        next: (enrollments: Enrollment[]) => {
            this.enrolledCourses = enrollments.map((enrollment) => ({
                courseId: enrollment.courseId,
                name: `Course Name ${enrollment.courseId}`,
                description: `Description for course ${enrollment.courseId}`,
                category: 'Category for course',
                rating: 4,
                isEnrolled: true
            }));
        },
        error: (err) => {
            // This will also catch the timeout or any other error rethrown in catchError
            console.error('Error fetching enrolled courses: ', err);
        }
    });
  }
  file: File|null=null;
  message:string='';
  success:boolean=false;
  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }
  onSubmitAssignment(): void {
    //console.log("you assignment got submitted successfully",this.file)
    if (this.file) {
      console.log(this.file)
      this.ApiService.submitAssignment(this.file)
        .subscribe({
          next: response=> 
          {
            this.success=true;
            this.message='Assignment submitted successfully!';
            console.log("you assignment got submitted successfully",this.file)
            console.log("response",response);
          },
          error: error=> 
          {
            this.success=false;
            this.message='Error submitting assignment    :'+error.message;
            console.log("error  1     :",error)
          }
        });
    } 
    else
    {
      this.success=false;
      this.message='Please fill in all the fields.';
      console.log("fill the details")
    }
  }
  onCourseSubmit(courseId:number,courseName:string):void
  {
    
  this.courseFeedback={
    courseFeedback:"",
    courseId:courseId,
    courseName:courseName,
    courseRating:0
  }
    //console.log("Your course feedback is submitted")
    this.ApiService.submitCourseFeedback(this.courseFeedback).subscribe(
      (response)=>{
        console.log("in course feedback response method",response)
      },
      (error)=>{
        console.log("feedback is NOT submitted",error)
      }
    )
  }
  submitFeedbackForm(): void {
    console.log('Feedback submitted:', this.feedback);
    this.ApiService.submitFeedback(this.feedback).subscribe(
      (response)=>{
        console.log("your feedback is successfully added",response)
        
      },
      (error)=>{
        console.log("there is error while adding your feedback",error)
      }
    )
  }


  showFeedbackForm=false;
  selectedCourse:any=null;
  feedbackCourses={courseFeedback:String,courseId:Number,name:String,courseRating:Number};
 
  openFeedbackForm(course:Course) 
  {
    this.selectedCourse=course; 
    this.showFeedbackForm=true;
  }
 
  closeFeedbackForm() {
    this.showFeedbackForm=false;
    this.selectedCourse=null;
    this.feedbackCourses={courseFeedback:String,courseId:Number,name:String,courseRating:Number};
  }
  submitFeedbackCourses(courseId:number,courseName:string) 
  {
    console.log('Feedback submitted for', this.selectedCourse.name);
    console.log('Rating:', this.feedbackCourses.courseRating);
    console.log('Feedback:', this.feedbackCourses.courseFeedback);
    console.log("courseid",courseId);
    console.log("coursename",courseName)
    const feedbackData = {
      courseFeedback:String(this.feedbackCourses.courseFeedback),
      courseId: courseId,
      courseName:courseName,
      courseRating:Number(this.feedbackCourses.courseRating),
    };
    this.ApiService.submitCourseFeedback(feedbackData).subscribe(
      (response)=>{
        console.log("your course feedback is successfully added")
        this.closeFeedbackForm();
      },
      (error)=>{
        console.log("error while submitting the feedback")
      }
    )
  }
}