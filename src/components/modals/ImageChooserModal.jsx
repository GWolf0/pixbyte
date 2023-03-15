import { useEffect, useRef, useState } from "react";
import AppService from "../../services/appService";
import Helper from "../../services/helper";

const ACCEPTED_TYPES=["jpg","jpeg","png","gif"];
const MAX_SIZE=256;//kB

function ImageChooserModal({onClose}){
const loggedUser=AppService.isLogged();
//refs
const fileInputRef=useRef();
//states
const [images,setImages]=useState([]);
const [selectedImages,setSelectedImages]=useState([]);
//effects
useEffect(()=>{//console.log(AppService.userImages)
    setImages(AppService.userImages);
},[]);
//methods
function onClickOnImageItem(idx){
    if(selectedImages.includes(idx)){
        setSelectedImages(prev=>prev.filter(num=>num!==idx));
    }else{
        setSelectedImages(prev=>[idx,...prev]);
    }
}
function onAddImage(){
    fileInputRef.current.click();
}
async function onInputFileChanged(){
    let selectedFiles=fileInputRef.current.files;
    let imageFiles=[];
    for(let i=0;i<selectedFiles.length;i++){
        const file=selectedFiles[i];
        const fileName=file.name;
        const fileExt=fileName.split(".").at(-1);
        const fileSize=file.size/1000;
        if(!ACCEPTED_TYPES.includes(fileExt.toLowerCase())){
            return alert(`This file type ${fileExt} is not allowed!`);
        }
        if(fileSize>MAX_SIZE){
            return alert(`Max allowed file size is ${MAX_SIZE}!`);
        }
        const imageUrl=URL.createObjectURL(file);
        const image=await setupImageObject(imageUrl);
        const imageDataUrl=Helper.getImageUrl(image);
        const newImageFile=AppService.insertImageFile(loggedUser.id,fileName,fileSize,imageDataUrl);
        imageFiles.push(newImageFile);
    }
    setImages(prev=>[...prev,...imageFiles]);
}
function setupImageObject(imageUrl){
    return new Promise((resolve)=>{
        const image=new Image();
        image.onload=()=>{
            resolve(image);
        }
        image.src=imageUrl;
    });
}
function _onClose(){
    onClose();
    Helper.resolveBlockingInterval([]);
}
function onChooseImages(){
    onClose();
    Helper.resolveBlockingInterval(selectedImages.map(idx=>images[idx]));
}
function onRemoveImages(){
    AppService.removeImagesFiles(selectedImages.map(idx=>images[idx].id));
    setImages(prev=>prev.filter((img,i)=>!selectedImages.includes(i)));
    setSelectedImages([]);
}


return(
<div className="z-20 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded overflow-hidden bg-lighter dark:bg-darkest shadow grid" style={{gridAutoRows:'48px minmax(0,auto) 48px',width:'min(95vw,720px)',height:'min(99vh,480px)'}}>
    <section className="flex items-center px-2 md:px-4 border-b border-semitrans dark:border-dark">
        <p className="text-dark dark:text-light font-semibold">Image Chooser</p>
        <button onClick={_onClose} className="p-2 text-dark dark:text-light hover:opacity-70 ml-auto">&times;</button>
    </section>
    <section className="p-2 grid grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto">
        <input ref={fileInputRef} onChange={onInputFileChanged} type="file" multiple accept="image/*" hidden={true} />
        <button onClick={onAddImage} className={`rounded overflow-hidden bg-light dark:bg-darker text-dark dark:text-light text-5xl hover:opacity-70`} style={{height:'156px'}}>
            <i className="bi-plus"></i>
        </button>
        {
            images.map((img,i)=>(
                <div key={img.id} onClick={()=>onClickOnImageItem(i)} className={`rounded overflow-hidden bg-light dark:bg-darker border-2 ${selectedImages.includes(i)?'border-accent':'border-transparent'} cursor-pointer hover:opacity-70`} style={{height:'156px'}}>
                    <img className="w-full h-full object-contain" src={img.url} />
                </div>
            ))
        }
    </section>
    <section className="flex items-center px-2 md:px-4 border-t border-semitrans dark:border-dark">
        {selectedImages.length>0&&<button onClick={onRemoveImages} className="rounded px-2 py-1 text-sm bg-secondary text-darkest hover:opacity-70">Remove</button>}
        {selectedImages.length>0&&<button onClick={onChooseImages} className="rounded px-2 py-1 text-sm bg-primary text-light hover:opacity-70 ml-auto">Choose</button>}
    </section>
</div>
);
}

export default ImageChooserModal;