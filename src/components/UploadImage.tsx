import React, { useState } from "react";
import AWS from "aws-sdk";
import "./UploadImage.css"
import TwineButton from "./TwineButton.tsx";

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

      const params = {
        Bucket: bucketName,
        Key: selectedFile.name,
        Body: selectedFile,
      };

      await s3.upload(params).promise();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again later.");
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
          
        </div>
      </div>
      
    </div>
  );
}

export default UploadImage;
