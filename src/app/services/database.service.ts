import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var SocketIOFileClient;
import * as uuid from "uuid";
import { environment } from 'src/environments/env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  url = environment.apiUrl;
  socket;    
  uploader;
  numberFileToUpload = 0;
  currentNumberFileUploaded = 0;
  user;

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private http: HttpClient
    ) { 
  }
  

  connectSocketIo(){
    this.socket = io(this.url, {secure: true} );
  }
  connectSocketFile(){
    this.uploader = new SocketIOFileClient(this.socket);
    console.log(this.uploader)
    this.uploader.on('start', (fileInfo) =>  {
      console.log('Start uploading', fileInfo);
      console.log(this.spinner.getSpinner('applyNow'));
      // const spinner = this.spinner.getSpinner('applyNow');
      // if(!spinner)
    });
    this.uploader.on('stream', (fileInfo) =>  {
      console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
    });
    this.uploader.on('complete', (fileInfo) =>  {
      this.currentNumberFileUploaded++;
      console.log(this.currentNumberFileUploaded, this.numberFileToUpload)
      if(this.currentNumberFileUploaded >= this.numberFileToUpload){
        this.spinner.hide();
        this.toastr.success(undefined, 'Your application has been received successfully. Thank you for applying.', {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-full-width'
        });
        this.currentNumberFileUploaded = 0;
        this.numberFileToUpload = 0;
      }
      console.log('Upload Complete', fileInfo);

    });
    this.uploader.on('error', function(err) {
      console.log('Error!', err);
    });
    this.uploader.on('abort', (fileInfo) =>  {
      console.log('Aborted: ', fileInfo);
    });
  }
  uploadFile(files,data){
    // const uid = uuid.v4();
    // this.uploader.upload(file, {data: uid} );
    console.log(files)
    let formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i].name);
    }
    formData.append("data", JSON.stringify(data));
    console.log(formData)
    return this.http.post<any>(`${environment.fileUploadServer}/api/upload`, formData)
  

  }

  uploadFileMissing(files,data){
    // const uid = uuid.v4();
    // this.uploader.upload(file, {data: uid} );
    console.log(files)
    let formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i].name);
    }
    formData.append("data", JSON.stringify(data));
    console.log(formData)
    return this.http.post<any>(`${environment.fileUploadServer}/api/upload/missing`, formData)
  

  }
  disConnectSocketIo(){
    this.socket.disconnect();
  }
  getInitialCandidates(callback: Function){
    this.socket.on('initial-candidates', callback);
  }
  getInitialJobOpenings(callback: Function){
    this.socket.on('initial-job-openings', callback);
  }
  getInitialEmployee(callback: Function){
    this.socket.on('initial-employee', callback);
  }
  getUserConnected(callback: Function){
     // New socket connected, display new count on page
     this.socket.on('users connected', callback)
  }
  addCandidate(data, callback: Function){
    this.socket.emit('add-candidate', data, callback);
  }
  addEmployee(data, callback: Function){
    this.socket.emit('add-employee', data, callback);
  }
  updateEmployee(data, callback: Function){
    this.socket.emit('edit-employee', data, callback);
  }

  addJobOpening(data, callback: Function){
    this.socket.emit('add-job-opening', data, callback);
  }
  updateJobOpening(data, callback: Function){
    this.socket.emit('update-job-opening', data, callback);
  }
  // updateCandidateStatus(data, callback: Function) {
  //   this.socket.emit('update-status-candidate', data, callback);
  // }
  // updateCandidateStage(data, callback: Function) {
  //   this.socket.emit('update-stage-candidate', data, callback);
  // }
  updateCandidate(data, callback: Function, type) {
    this.socket.emit(`update-${type}-candidate`, data, callback);
  }

  deleteJobOpening(id, callback: Function){
    this.socket.emit('delete-job-opening', id, callback);
  }
  deleteCandidate(id, callback: Function ){
    this.socket.emit('delete-candidate', id, callback);
  }
  getNewEmployeeRealTime(callback: Function){
    this.socket.on('add-employee', callback);
  }
  getNewJobOpeningsRealTime(callback: Function){
    this.socket.on('add-job-opening', callback);
  }
  getNewEditedJobOpeningsRealTime(callback: Function){
    this.socket.on('update-job-opening', callback);
  }
  getNewDeletedJobOpeningsRealTime(callback: Function){
    this.socket.on('delete-job-opening', callback);
  }

  getNewCandidateRealTime(callback: Function){
    this.socket.on('add-candidate', callback);
  }
  logIn(user, callback: Function) {
    this.socket.emit('log-in',user, callback);
  }
  logOut() {
    this.clearUser();
  }
  downloadAllFiles(data, callback: Function) {
    this.socket.emit('download-profile', data, callback);
  }
  addStage(stage, callback: Function) {
    this.socket.emit('add-stage', stage, callback);
  }

  addCandidateUid(id, callback: Function) {
    this.socket.emit('add-uid', id, callback);
  }
  getNewStageAdded(callback: Function){
    this.socket.on('new-stage', callback);
  }
  getAllStages(callback: Function) {
    this.socket.emit('get-stages',{}, callback)
  }
  getDepartments(callback: Function) {
    this.socket.emit('get-departments',{}, callback)
  }
  addDepartment(department, callback: Function) {
    this.socket.emit('add-department', department, callback);
  }
  deleteDepartment(id, callback: Function) {
    this.socket.emit('delete-department', id, callback);
  }
  getCandidateDetails(id,callback: Function) {
    this.socket.emit('get-candidate', id, callback);
  }
  getCandidateDetailsByUid(uid,callback: Function) {
    this.socket.emit('get-candidate-by-uid', uid, callback);
  }
  getJobStages(id, callback: Function) {
    this.socket.emit('get-job-stages', id, callback);
  }
  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user) {
    return localStorage.setItem('user',JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      const user = this.getUser();
      if(user){
        // this.logIn(user, result => {
        //   if(result.error){
        //     reject();
        //   } else {
        //     this.user = result[0];
        //     resolve(this.user);
        //   }
        // } )
        this.user = user;
        resolve(this.user);

      } else {
        reject();
      }
    });
  }

}
