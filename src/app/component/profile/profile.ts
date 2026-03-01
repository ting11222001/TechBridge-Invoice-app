import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, ProfileState } from '../../interface/appstates';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event-type.enum';
import { User } from '../../service/user';
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

  constructor(private userService: User) { }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return { 
            dataState: DataState.LOADED, 
            appData: response 
          };
        }),
        startWith({ 
          dataState: DataState.LOADING 
        }),
        catchError((error: string) => {
          return of({ 
            dataState: DataState.ERROR, 
            appData: this.dataSubject.value,
            error 
          })
        })
      )
  }

  updateProfile(profileForm: NgForm): void {
 
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
