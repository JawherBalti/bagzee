import React , {useState} from 'react';
import { uploadFile } from 'react-s3';
import {Button, Upload} from "antd";


const S3_BUCKET ='bagzee';
const REGION ='us-east-1';
const ACCESS_KEY ='AKIAWNNX6P6PM5THZEOA';
const SECRET_ACCESS_KEY ='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';

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
}
window.Buffer = window.Buffer || require("buffer").Buffer;
const UploadImageToS3WithReactS3 = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        console.log(e.file.originFileObj)
        setSelectedFile(e.file.originFileObj);

    }

    const handleUpload = async (file) => {
        console.log(file)
        var fileExtension = '.' + file.name.split('.')[1];
        var prefix = file.name.split('.')[0];
        var name = prefix.replace(/[^A-Z]/gi, '') + Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
        var newFile = new File([file], name, {type: file.type});
        uploadFile(newFile, config)
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }

    return <div>
        <div>React S3 File Upload</div>

     <Upload onChange={handleFileInput}   listType="picture-card">
         <span className={"btnBlue"}>ajouter_bagage</span></Upload>
        <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button>
    </div>
}

export default UploadImageToS3WithReactS3;