import { LightningElement, track} from 'lwc';
 
export default class LWCWizard extends LightningElement {
 
    @track currentStep = '1';
 
    handleOnStepClick(event) {
        this.currentStep = event.target.value;
        console.log(this.currentStep);
    }
 
    get isStepOne() {
        return this.currentStep === "1";
    }
 
    get isStepTwo() {
        return this.currentStep === "2";
    }
 
    get isStepThree() {
        return this.currentStep === "3";
    }

    get isStepFour() {
        return this.currentStep === "4";
    }
 
    get isStepFive() {
        return this.currentStep === "5";
    }


 
    get isEnableNext() {
        return this.currentStep !== "5";
    }
 
    get isEnablePrev() {
        return this.currentStep !== "1";
    }
 
    get isEnableFinish() {
        return this.currentStep === "5";
    }

 
    handleNext(){
        if(this.currentStep == "1"){
            this.currentStep = "2";
        }
        else if(this.currentStep == "2"){
            this.currentStep = "3";
        }
        else if(this.currentStep == "3"){
            this.currentStep = "4";
        }
        else if(this.currentStep == "4"){
            this.currentStep = "5";
        }
    }
 
    handlePrev(){
        if(this.currentStep == "5"){
            this.currentStep = "4";
        }
        else if(this.currentStep == "4"){
            this.currentStep = "3";
        }
        else if(this.currentStep == "3"){
            this.currentStep = "2";
        }
        else if(this.currentStep == "2"){
            this.currentStep = "1";
        }
    }
 
    handleFinish(){
 
    }
}