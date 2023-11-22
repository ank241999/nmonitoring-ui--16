import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareDataService } from '../../../assets/services/share-data.service';

@Component({
  selector: 'app-intermediate',
  templateUrl: './intermediate.component.html'// ,
  // styleUrls: ['./intermediate.component.css']
})
export class IntermediateComponent implements OnInit {

  constructor(private router: Router,
    private shareDataService: ShareDataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const skipLocationChange = params['isskip'];
      if (skipLocationChange !== 1) {
        if (localStorage.getItem('userLogId') === null) {
          this.router.navigate(['./login']);
        } else {
          this.router.navigate(['./admin/activitymonitoring']);
        }
      }
    });
  }
}
