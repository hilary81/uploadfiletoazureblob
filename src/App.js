/* eslint-disable no-unused-vars */
import React from 'react'
import './App.css';
import{Component} from 'react';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';



class App extends Component{
  constructor(props){
    super(props);
    this.state={
      file:null
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }
  onFileChange(event){
    //capture file into stat
    this.setState({file:event.target.files[0]});
  };
 
  async uploadFile(){
    let storageAccountName = 'carrentelstorage';
    const sasToken = process.env.REACT_APP_SAS_kEY;
 
    console.log(sasToken)
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    //get Container - full public read access
    const containerClient = blobService.getContainerClient('video');
    await containerClient.createIfNotExists({
      access: 'container',
    });

    //create blobClient for container

    const blobClient = containerClient.getBlockBlobClient(this.state.file.name);

    //set mimetype as determined from browser with file upload control

    const options = { blobHTTPHeader: { blobContentType: this.state.file.type}};

    //upload file
    await blobClient.uploadBrowserData(this.state.file,options);
  };
  render(){
   return (
    <div className="app">
      <div>
    
      <input onChange={this.onFileChange}  type="file" /> 
        <button onClick={() => this.uploadFile()}>Upload</button>
      </div>
     
    </div>
  );
} 
}
export default App;