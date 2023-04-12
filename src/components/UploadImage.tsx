import React, { useState, useContext } from "react";
import { UserContext } from "../App.tsx";
import AWS from "aws-sdk";
import "./UploadImage.css"
import TwineButton from "./TwineButton.tsx";
import {v4 as uuidv4} from 'uuid';
import { CircularProgress } from "@mui/joy";

interface UploaderProps {
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  hideComponent: () => Promise<void>;
}
function UploadImage({
  bucketName,
  accessKeyId,
  secretAccessKey,
  region,
  hideComponent,
}: UploaderProps) {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgsrc, setImgSrc] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const context: object = useContext(UserContext);
  const user: User = context['user'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (!file) {  
      return;
    }
    previewFile(file);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgSrc(reader.result);
    };
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
        signatureVersion: 'v4',
      });

      let imgName = uuidv4() + "." + selectedFile.name.split('.').pop();

      const params = {
        Bucket: bucketName,
        Key: imgName,
        Body: selectedFile,
      };

      user.profileImg = imgName ;

      setLoading(true);
      await s3.upload(params).promise();
      setLoading(false);
      hideComponent();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again later.");
      setLoading(false);
      hideComponent();
    }
  };

  return (
    <div>
      <div className="popup-overlay"> 
        <div className="popup-content">
          <h2>Upload Image</h2>
          <div>
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png"/>
          </div>
          <div>
            {(imgsrc != null) && <img src={imgsrc as string} width="128" height="128"/>}
          </div>
          <div>
            <TwineButton name={"Upload"} action={handleUpload} />
            <TwineButton name={"Close"} action={hideComponent} />
          </div>
          {loading && 
          <div className="loading">
          <CircularProgress />
          </div>}
          
        </div>
        
        </div>
      </div>
      
  );
}

export default UploadImage;
