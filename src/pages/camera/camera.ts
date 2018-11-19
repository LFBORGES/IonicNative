import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from "@ionic-native/camera";

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {
  
  photoUri: string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public file: File,
    public filePath: FilePath,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform
    ) {}
    
    onActionSheet(): void {
      this.actionSheetCtrl.create({
        title: 'Select image source',
        buttons: [ 
          {
            text: 'load from library',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: 'Cancel'
          }
        ]
      }).present();
    }
    takePicture(sourceType: number): void {

      let cameraOpitions: CameraOptions = {
        correctOrientation: true,
        quality: 100,
        saveToPhotoAlbum: false,
        sourceType: sourceType        
      };
      
      this.camera.getPicture(cameraOpitions)
        .then((fileUri: string) => {
          console.log('Photo: ', fileUri);
          this.photoUri = fileUri;
        }).catch((err: Error) => console.log('Camera error: ', err));
    }

    correctPathAndGetFileName(fileUri: string, sourceType: number): Promise<{oldfilePath: string, oldfileName: string}> {
     
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
       
        return this.filePath.resolveNativePath(fileUri)
          .then((correctFileUri: string) =>{

            return {
              oldFilePath: correctFileUri.substr(0, (correctFileUri.lastIndexOf('/') + 1)),
              oldFileName: fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.lastIndexOf('?'))
            }
            
          }).catch(err => console.log('Erro ao corrigir path no android: ', err));

      }
      
      return Promise.resolve({
        oldFilePath: fileUri.substr(0, fileUri.lastIndexOf('/') + 1),
        oldfileName: fileUri.substr(fileUri.lastIndexOf('/') + 1)
      });

    }

}
