import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { IDevice } from '../../../assets/interfaces/idevice';
import { IAllProcessRearrange, IAllProcessResponse, IStateMonitoring } from '../../../assets/interfaces/istatemonitoring';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { StatemonitoringService } from '../../../assets/services/statemonitoring.service';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';

@Component({
   selector: 'app-statemonitoring',
   templateUrl: './statemonitoring.component.html',
   styleUrls: ['./statemonitoring.component.scss']
})
export class StatemonitoringComponent implements OnInit, OnDestroy {
   viewMode = 'left';
   id: any;
   aggalgo: any;

   deviceStatus: IStateMonitoring = {
      'Report': {
         'status': 'DOWN',
         'details': {
            'Success Response http://172.16.2.174:9005': 'Service is Running'
         }
      },
      'NodeExporter': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9100': 'Service is Running'
         }
      },
      'DeviceSetting': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9003': 'Service is Running'
         }
      },
      'Prometheus': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9090': 'Service is Running'
         }
      },
      'ProcessExporter': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9256': 'Service is Running'
         }
      },
      'Grafana': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:3000': 'Service is Running'
         }
      },
      'UserSetting': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9006': 'Service is Running'
         }
      },
      'UserRoleAuth': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9007': 'Service is Running'
         }
      },
      'core': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:8123': 'Service is Running'
         }
      },
      'AISimulatorFrontend': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:4200': 'Service is Running'
         }
      },
      'Peripheral': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9012': 'Service is Running'
         }
      },
      'loki': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:3100': 'Service is Running'
         }
      },
      'Tempo': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:3200': 'Service is Running'
         }
      },
      'AISimulatorBackend': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9000': 'Service is Running'
         }
      },
      'ActiveMonitorBackend': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9001': 'Service is Running'
         }
      },
      'Auth': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9002': 'Service is Running'
         }
      },
      'DeviceDetect': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9008': 'Service is Running'
         }
      },
      'Adminer': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:8080': 'Service is Running'
         }
      },
      'Collector': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:5555': 'Service is Running'
         }
      },
      'DcgmExporter': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:9400': 'Service is Running'
         }
      },
      'Keycloak': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:8180': 'Service is Running'
         }
      },
      'ActiveMonitorFrontend': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:4201': 'Service is Running'
         }
      },
      'Kong': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:8000': 'Service is Running'
         }
      },
      'db': {
         'status': 'UP',
         'details': {
            'Success Response http://172.16.2.174:3306': 'Service is Running'
         }
      },
      'Recorder': {
         'details': {
            'Response': 'Service is Running'
         },
         'status': 'DOWN'
      },
      'Camera': {
         'details': {
            'Response': 'Service is Running'
         },
         'status': 'DOWN'
      },
      'Aggregate': {
         'details': {
            'Response': 'Service is Running'
         },
         'status': 'DOWN'
      },
      'Retinanet': {
         'details': {
            'Response': 'Service is not Running'
         },
         'status': 'DOWN'
      },
      'Capture': {
         'details': {
            'Response': 'Service is Running'
         },
         'status': 'UP'
      },
      'Aggregate-algo': {
         'details': {
            'Response': 'Service is not Running'
         },
         'status': 'DOWN'
      },
      'Detect-algo': {
         'details': {
            'Response': 'Service is Running'
         },
         'status': 'UP'
      },
   };

   

   rightDeviceStatus: IStateMonitoring = this.deviceStatus;
   leftDevice: IDevice = {};
   rightDevice: IDevice = {};
   device: IDevice[] = [];
   allprocessdata: IAllProcessResponse[] = [];
   rightallprocessdata: IAllProcessResponse[] = [];
   allprocessrearrangedata: IAllProcessRearrange = {
      'FPGAInterface': 'DOWN',
      'AiAggregate': 'DOWN',
      'DataReduction': 'DOWN',
      'Drfits': 'DOWN',
      'ImageReconstruction': 'DOWN',
      'Recorder': 'DOWN',
      'Webapi': 'DOWN',
      'Webserver': 'DOWN'
   };
   rightallprocessrearrangedata: IAllProcessRearrange = {
      'FPGAInterface': 'DOWN',
      'AiAggregate': 'DOWN',
      'DataReduction': 'DOWN',
      'Drfits': 'DOWN',
      'ImageReconstruction': 'DOWN',
      'Recorder': 'DOWN',
      'Webapi': 'DOWN',
      'Webserver': 'DOWN'
   };

   processMap = {
      FPGA_Interface: 'FPGAInterface',
      ai_aggregate: 'AiAggregate',
      data_reduction: 'DataReduction',
      image_reconstruction: 'ImageReconstruction',
      recorder: 'Recorder',
      webapi: 'Webapi',
      webserver: 'Webserver',
   };
   leftdeviceName = 'Left Device';
   rightdeviceName = 'Right Device';
   ipDeviceShown = 'IP Address';
   devicesInSameLane: { laneId: number; deviceNames: string; deviceNamesArr: string[]; ipAddresses: string[]; }[];

   constructor(
      private router: Router,
      private shareDataService: ShareDataService,
      public deviceService: DevicemanagementService,
      public stateService: StatemonitoringService,
      private threatActivityService: ThreatActivityService,
      private spinnerService: NgxSpinnerService) {
      this.spinnerService.show();
      this.devicesIP();
   }

   ngOnInit() {
   }

   serviceStatus(ipAddress) {
      if (!ipAddress) {
         return;
      }

      // Set status of all services to "DOWN"
      for (const serviceName in this.deviceStatus) {
         if (this.deviceStatus.hasOwnProperty(serviceName)) {
            this.deviceStatus[serviceName].status = 'DOWN';
         }         
      }

      this.ipDeviceShown = ipAddress;
      // Clear previous interval, if any
      clearInterval(this.id);

      this.spinnerService.show();

      this.id = setInterval(() => {
         this.serviceStatus(ipAddress);
      }, 60000);

      const DeviceStatus$ = this.stateService.getServiceHealthStatus(ipAddress);
      const AllProcess$ = this.stateService.getAllProcess(ipAddress);
      const CoreStatus$ = this.stateService.getCoreStatus(ipAddress);

      DeviceStatus$.subscribe(res => {
         // Update status of services whose status is "UP"
         for (const serviceName in res) {
            if (res[serviceName].status === 'UP') {
               this.deviceStatus[serviceName] = res[serviceName];
            }
         }
      });

      AllProcess$.subscribe(processres => {
         this.allprocessdata = processres;
         if (this.allprocessdata) {
            for (let i = 0; i < this.allprocessdata.length; i++) {
               const item = this.allprocessdata[i];
               const key = this.processMap[item.name];
               if (key) {
                  this.allprocessrearrangedata[key] = (item.statename === 'RUNNING' ? 'UP' : 'DOWN');
               } else {
                  console.log('Invalid operator');
               }
            }
         }
      });

      CoreStatus$.subscribe(coreres => {
         // Update status of services whose status is "UP"
         for (const serviceName in coreres) {
            if (coreres[serviceName].status === 'UP') {
               this.deviceStatus[serviceName] = coreres[serviceName];
            }
         }
      });

      forkJoin([DeviceStatus$, AllProcess$, CoreStatus$]).subscribe(
         () => {
            this.spinnerService.hide();
         },
         err => {
            console.error('Failed to get device status and all process:', err);
            this.spinnerService.hide();
         }
      );
   }

   onScreenClose() {
      this.router.navigate(['/admin/dashboard']);
   }

   ngOnDestroy() {
      if (this.id) {
         clearInterval(this.id);
      }
   }

   devicesIP() {
      this.deviceService.getDevices().subscribe(deviceres => {
         if (deviceres['status'] === 200) {
            try {
               this.device = deviceres['data'];

               this.devicesInSameLane = [];

               // Filter devices with laneId 0 and null
               const selectedDevices = [];

               for (const device of this.device) {
                  if (device.laneId !== 0 && device.laneId !== null) {
                     selectedDevices.push(device);
                  }
               }

               // Group devices with the same laneId
               const groups = selectedDevices.reduce((acc, device) => {
                  const laneId = device.laneId;
                  (acc[laneId] || (acc[laneId] = [])).push(device);
                  return acc;
               }, {});

               // Store devices with at least 2 devices in the same lane
               for (const laneId in groups) {
                  if (groups.hasOwnProperty(laneId)) {
                     const devicesInLane = groups[laneId];
                     if (devicesInLane.length >= 2) {
                        const deviceNames = devicesInLane.map(d => d.name);
                        const ipAddresses = devicesInLane.map(d => d.ipAddress);
                        this.devicesInSameLane.push({
                           laneId: devicesInLane[0].laneId,
                           deviceNames: deviceNames.join(' - '),
                           deviceNamesArr: deviceNames,
                           ipAddresses: ipAddresses
                        });
                     }
                  }
               }


               this.threatActivityService.getThreatActivities(this.shareDataService.email).subscribe(res => {
                  if (res['data']['#result-set-3'].length !== 0) {
                     this.leftDevice = this.device.filter(
                        a => a.macAddress === res['data']['#result-set-3'].filter(d => d.side === 'left')[0]['mac_address'])[0];
                     this.rightDevice = this.device.filter(
                        a => a.macAddress === res['data']['#result-set-3'].filter(d => d.side === 'right')[0]['mac_address'])[0];

                     if (this.leftDevice.laneId !== 0 && this.rightDevice.laneId !== 0
                        && this.leftDevice.laneId === this.rightDevice.laneId) {
                        this.leftdeviceName = this.leftDevice.name;
                        this.rightdeviceName = this.rightDevice.name;

                        this.serviceStatus(this.leftDevice.ipAddress);
                     } else {
                        this.leftdeviceName = 'No Device';
                        this.rightdeviceName = 'No Device';
                        this.spinnerService.hide();
                     }
                  } else {
                     this.leftdeviceName = 'No Device';
                     this.rightdeviceName = 'No Device';
                     this.spinnerService.hide();
                  }
               });
            } catch {
               this.spinnerService.hide();
            }
         }
      }, err => {
         console.log('Error occurred: ' + err.message);
      });
   }

   // changeServiceStatus(serviceType: any, status: any) {
   //    this.spinnerService.show();
   //    if (serviceType == 'backend') {
   //       if (status == 'start') {
   //          this.stateService.changeServiceStatus("backend/start").subscribe(res => {
   //          },
   //             err => {
   //             })
   //       }
   //       else {
   //          this.stateService.changeServiceStatus("backend/stop").subscribe(res => {
   //          },
   //             err => {
   //             })
   //       }
   //    }
   //    else if (serviceType == 'logging') {
   //       if (status == 'start') {
   //          this.stateService.changeServiceStatus("logging/start").subscribe(res => {
   //          },
   //             err => {
   //             })
   //       }
   //       else {
   //          this.stateService.changeServiceStatus("logging/stop").subscribe(res => {
   //          },
   //             err => {
   //             })
   //       }
   //    }
   //    else if (serviceType == 'pipeline') {
   //       if (status == 'start') {
   //          this.stateService.changeServiceStatus("pipeline/start").subscribe(res => {
   //          },
   //             err => {
   //             })
   //       }
   //       else {
   //          this.stateService.changeServiceStatus("pipeline/stop").subscribe(res => {
   //          },
   //             err => {
   //             })
   //       }
   //    }

   //    this.spinnerService.hide();
   //    this.serviceStatus();
   // }

   onDeviceChange(selectedLaneId: string) {
      if (!selectedLaneId) {
         return;
      }

      // Remove the "Connected Devices" option from the select list
      const connectedDevicesOption = document.querySelector('option[value=""]');
      if (connectedDevicesOption) {
         connectedDevicesOption.remove();
      }

      // Do something when a device is selected
      const selectedDevice = this.devicesInSameLane.find(device => device.laneId.toString() === selectedLaneId);
      if (selectedDevice) {
         this.spinnerService.show();
         // Set the name and IP address of the left device based on the selected device
         this.leftDevice.name = selectedDevice.deviceNamesArr[0];
         this.leftDevice.ipAddress = selectedDevice.ipAddresses[0];

         // Set the name and IP address of the right device based on the selected device
         this.rightDevice.name = selectedDevice.deviceNamesArr[1];
         this.rightDevice.ipAddress = selectedDevice.ipAddresses[1];

         this.leftdeviceName = this.leftDevice.name;
         this.rightdeviceName = this.rightDevice.name;

         // Call the serviceStatus() function to get the status of both devices
         this.serviceStatus(this.leftDevice.ipAddress);
      }
   }
}
