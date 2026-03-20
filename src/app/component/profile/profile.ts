import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, Profile } from '../../interface/appstates';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event-type.enum';
import { UserService } from '../../service/user';
import { State } from '../../interface/state';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, RouterModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  profileState$!: Observable<State<CustomHttpResponse<Profile>>>;

  private data = signal<CustomHttpResponse<Profile> | undefined>(undefined);
  readonly DataState = DataState;
  readonly EventType = EventType;

  activeTab = signal<string>('profile');
  isLoading = signal<boolean>(true);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(
        map(response => {
          this.data.set(response);
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
            appData: this.data(),
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
        // backend always returns the entire User object with the updated fields in UserResource.updateUser > UserService.updateUserDetails > UserRepositoryImpl.updateUserDetails
        this.data.set(response);
        this.isLoading.set(false);
        return { 
          dataState: DataState.LOADED, 
          appData: this.data()
        };
      }),
      startWith({ 
        dataState: DataState.LOADED,
        appData: this.data()
      }),
      catchError((error: string) => {
        this.isLoading.set(false);
        return of({ 
          dataState: DataState.ERROR, 
          appData: this.data(),
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
