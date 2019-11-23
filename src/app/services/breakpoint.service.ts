import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  currentBreakpoint = new Observable<BreakpointState>();

  constructor(private breakpointObserver: BreakpointObserver) { 
    this.currentBreakpoint = this.breakpointObserver.observe([Breakpoints.Handset]);
  }
}
