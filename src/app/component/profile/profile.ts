import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, ProfileState } from '../../interface/appstates';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../service/user';
import { State } from '../../interface/state';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, RouterModule, DatePipe, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  profileState$!: Observable<State<CustomHttpResponse<ProfileState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<ProfileState> | undefined>(undefined);
  readonly DataState = DataState;

  // private isLoadingSubject = new BehaviorSubject<boolean>(false);
  // isLoading$ = this.isLoadingSubject.asObservable();
  isLoading = signal<boolean>(true);

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          // console.log("getProfile this.dataSubject.value:");
          // console.log(this.dataSubject.value);
          this.isLoading.set(false);
          return { 
            dataState: DataState.LOADED, 
            appData: response 
          };
        }),
        startWith({ 
          dataState: DataState.LOADING 
        }),
        catchError((error: string) => {
          this.isLoading.set(false);
          return of({ 
            dataState: DataState.ERROR, 
            appData: this.dataSubject.value,
            error 
          })
        })
      )
  }

  updateProfile(profileForm: NgForm): void {
    this.isLoading.set(true);
    this.profileState$ = this.userService.updateProfile$(profileForm.value)
    .pipe(
      map(response => {
        // this.dataSubject.next({ ...response, data: response.data });  // backend always returns the entire User object with the updated fields in UserResource.updateUser > UserService.updateUserDetails > UserRepositoryImpl.updateUserDetails
        this.dataSubject.next(response);
        // console.log("updateProfile this.dataSubject.value:");
        // console.log(this.dataSubject.value);
        this.isLoading.set(false);
        return { 
          dataState: DataState.LOADED, 
          appData: this.dataSubject.value 
        };
      }),
      startWith({ 
        dataState: DataState.LOADED,
        appData: this.dataSubject.value
      }),
      catchError((error: string) => {
        this.isLoading.set(false);
        return of({ 
          dataState: DataState.ERROR, 
          appData: this.dataSubject.value,
          error 
        })
      })
    )
  }

  updatePassword(passwordForm: NgForm): void {
  
  }

  updateRole(roleForm: NgForm): void {
   
  }

  updateAccountSettings(settingsForm: NgForm): void {
   
  }

  toggleMfa(): void {
   
  }

  updatePicture(image: File): void {
   
  }

  toggleLogs(): void {
  }

  private getFormData(image: File) {
  }



}
