import { Applications, application, addApp, updateApp, delApp, AppCoarse, AppFine } from '../../routeConfig';
import { Component, OnInit, state } from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Http } from '@angular/http';
declare var $;

@Component({ selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.css'] })
export class HeaderComponent implements OnInit {

    applications = [];
    selected_id = "";
    // selected_toggle = "";

    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private http: Http) {
        this.router.events.subscribe(() => {
            // this.fetchApplication();
            // this.getAppId();
            // this.toggle();           
        })
    }

    collapse() {
        if (document.body.className == 'sidebar-mini') {
            document.body.className = '';
        } else {
            document.body.className = 'sidebar-mini';
        }
    }

    toggleStylesheet(href) {

        var ss = document.getElementById('darkmode');

        if (ss == null) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.id = "darkmode"
            link.href = href;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        else {
            document.getElementById("darkmode").remove();
        }
    }

    toggleFullScreen() {
        

        var x = document.getElementById("fsi");
        if (x.innerHTML === "fullscreen") {
            x.innerHTML = "fullscreen_exit";
        } else {
            x.innerHTML = "fullscreen";
        }

        if ((document.fullscreenElement && document.fullscreenElement !== null) || (!document.fullscreenElement && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullscreen) {
                document
                    .documentElement
                    .requestFullscreen();
            } else if (document.documentElement.requestFullscreen) {
                document
                    .documentElement
                    .requestFullscreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document
                    .documentElement
                    .webkitRequestFullScreen();
            }
        } else {
            if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    onLogoutClick() {
        sessionStorage.clear();
        this
            .authService
            .logout();
        this
            .router
            .navigate(['/login']);
        return false;
    }


    getAppId() {
        sessionStorage.setItem('app_id', this.selected_id);
        
        // sessionStorage.setItem('app_type', this.selected_id);
        sessionStorage.setItem('componentVisibility', 'true')
        var currentLocation = window.location.pathname;
        this
            .router
            .navigate(['']);
    }


    se_app_id = sessionStorage.getItem('app_id');
    // se_app_type = sessionStorage.getItem('app_type');
    // Fetch Application
    fetchApplication = function () {
        this
            .http
            .get(Applications)
            .subscribe((res: Response) => {
                this.applications = res.json();
            });
    }

    // fetchApplicationFine = function () {
    //     this
    //         .http
    //         .get(AppFine)
    //         .subscribe((res: Response) => {
    //             this.applications = res.json();
    //         });

    // }
    // fetchApplicationCoarse = function () {
    //     this
    //         .http
    //         .get(AppCoarse)
    //         .subscribe((res: Response) => {
    //             this.applications = res.json();
    //         });
    // }

    // variable for toggle
    // isToggled: boolean;
    // toggle = function () {
    //     this.isToggled = !this.isToggled;
    //     if (this.isToggled ) {
    //         this.fetchApplicationCoarse();
    //         // console.log(this.se_app_id);
    //         // console.log(this.se_app_type);
    //     }
    //     else {
    //         this.fetchApplicationFine();
    //         // console.log(this.se_app_id);
    //         // console.log(this.se_app_type);
    //         // location.reload(true);
    //     }
    //     this.reset();

    // }

    // reset() {
    //     this.router.navigate(['/']);
    //     this.selected_id = "";
      
    // }

    ngOnInit() {
        if (this.se_app_id != null) {
            this.selected_id = this.se_app_id;
        }
        // this.toggle();
        this.fetchApplication();
        // this.fetchApplicationCoarse();
        // this.fetchApplicationFine();
    }
}
