import { LightningElement, track } from 'lwc';
//import uploadToS3 from '@salesforce/apex/FileUploadController.uploadToS3';

export default class FileUploader extends LightningElement {
    @track acceptedFormats = ['.jpg', '.jpeg','.gif','.pdf','.png','.xls','.xlsx'];

    handleUpload(event) {
        const file = event.detail.files[0];
        alert('Uploaded successfully');
        /*const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const fileContents = reader.result;
            const base64Mark = 'base64,';
            const dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;
            const fileData = fileContents.substring(dataStart);
            uploadToS3({
                fileName: file.name,
                base64Data: encodeURIComponent(fileData),
                contentType: file.type
            })
            .then(data => {
                // handle successful upload
                console.log(data);
            })
            .catch(error => {
                // handle error
                console.error(error);
            });
        }*/
    }
}