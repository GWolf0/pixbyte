import { useEffect, useRef, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Logo from "../components/Logo";
import MCheckBox from "../components/MCheckBox";
import AppService from "../services/appService";
//import GoogleAuthService from "../services/googleSignInService";

function LoginPage(){
const navigate=useNavigate();
const loggedUser=AppService.isLogged();
//refs
const reg_emailRef=useRef();
const reg_pwdRef=useRef();
const log_emailRef=useRef();
const log_pwdRef=useRef();
//states
const [loginSection,setLoginSection]=useState("login");
const [tosChecked,setTosChecked]=useState(false);
const [regErrors,setRegErrors]=useState({});
const [logErrors,setLogErrors]=useState(false);
//effects
useEffect(()=>{
    if(loggedUser!=null)return navigate(`/profile/${loggedUser.name}`);
    // GoogleAuthService.init();
    // window.addEventListener('ongauthlogin',onGoogleLogin);
    // return ()=>{
    //     window.removeEventListener('ongauthlogin',onGoogleLogin);
    // }
},[]);
//methods
function onRegister(){
    const email=reg_emailRef.current.value;
    const pwd=reg_pwdRef.current.value;
    if(email==""||pwd==""||!tosChecked)return;
    const res=AppService.register(email,pwd);
    if(res!==null){
        setRegErrors(res);
    }else{
        navigate('/');
        window.location.reload();
    }
}
function onLogin(){
    const email=log_emailRef.current.value;
    const pwd=log_pwdRef.current.value;
    if(email==""||pwd=="")return;
    const res=AppService.login(email,pwd);
    if(res!==null){
        navigate('/');
        window.location.reload();
    }else{
        setLogErrors(true);
    }
}
function onGoogleLogin(e){
    console.log("Got gauth creds",e.detail.credential);
}


return(
<div id="loginPage" className="relative isolate w-screen min-h-screen bg-lighter dark:bg-darkest">
    <div className="absolute -z-10 left-0 top-0 w-screen h-screen overflow-hidden">
        <img className="object-cover w-full h-full" src="./assets/images/bg.jpg" />
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-black to-darkest opacity-40"></div>
    </div>
    <Header isTransparent={true} />
    <main className="mx-auto px-4 py-6 flex items-center justify-center" style={{width:'min(100vw,1280px)',minHeight:'80vh'}}>
        <div id="loginBox" className="rounded overflow-hidden border-none border-light dark:border-dark bg-lighter dark:bg-darkest shadow" style={{width:'min(100%,480px)'}}>
            <div className="flex items-center border-none border-light dark:border-dark" style={{height:'60px'}}>
                <button onClick={()=>setLoginSection('login')} className={`${loginSection=='login'?'text-primary':'text-dark'} h-full px-6 hover:opacity-70`}>Login</button>
                <div className="h-1/2 mx-4 border-r border-light dark:border-dark"></div>
                <button onClick={()=>setLoginSection('register')} className={`${loginSection=='register'?'text-primary':'text-dark'} h-full px-6 hover:opacity-70`}>Register</button>
            </div>

            <div className="py-6 flex justify-center">
                <Logo noLink={true} />
            </div>

            <section id="loginSection" className="p-4" hidden={loginSection!="login"}>
                {logErrors&&
                    <p className="text-sm text-red-500 py-2">{`Unable to login!`}</p>
                }
                <div className="mb-4">
                    <input ref={log_emailRef} className="w-full p-2 bg-light text-darker dark:bg-darker dark:text-lighter text-sm outline-none border-primary focus:border-b" placeholder="email" type="email" />
                </div>
                <div className="mb-4">
                    <input ref={log_pwdRef} className="w-full p-2 bg-light text-darker dark:bg-darker dark:text-lighter text-sm outline-none border-primary focus:border-b" placeholder="password" type="password" />
                </div>
                <button onClick={onLogin} className="w-full py-2 bg-primary text-lighter rounded hover:opacity-70 mt-2">Login</button>
            </section>

            <section id="registerSection" className="p-4" hidden={loginSection!="register"}>
                <div className="mb-4">
                    <input ref={reg_emailRef} className="w-full p-2 bg-light text-darker dark:bg-darker dark:text-lighter text-sm outline-none border-primary focus:border-b" placeholder="email" type="email" />
                    {Object.prototype.hasOwnProperty.call(regErrors,"email")&&
                        <p className="text-sm text-red-500 py-2">{regErrors.email}</p>
                    }
                </div>
                <div className="mb-4">
                    <input ref={reg_pwdRef} className="w-full p-2 bg-light text-darker dark:bg-darker dark:text-lighter text-sm outline-none border-primary focus:border-b" placeholder="password" type="password" />
                    {Object.prototype.hasOwnProperty.call(regErrors,"password")&&
                        <p className="text-sm text-red-500 py-2">{regErrors.password}</p>
                    }
                </div>
                <div className="mb-4">
                    <label className="text-dark dark:text-light text-sm">
                        <MCheckBox value={tosChecked} onChange={()=>setTosChecked(prev=>!prev)} />
                        <span> I accept the </span> 
                    </label>
                    <a className="cursor-pointer font-light text-sm text-secondary hover:underline hover:opacity-70">terms of use</a>
                </div>
                <button onClick={onRegister} className="w-full py-2 bg-primary text-lighter rounded hover:opacity-70 mt-2">Register</button>
            </section>

            <section id="otherLoginOptions" className="p-4 border-none border-light dark:border-dark">
                <div className="text-center text-sm text-dark pb-4">--Or--</div>
                {/* <div id="gauthContainer" className="mb-4 py-2 flex items-center justify-center"></div> */}
                <button className="w-full py-2 bg-inherit text-primary border border-primary rounded hover:opacity-70 mb-4"><i className="bi-facebook mr-1.5"></i> Login With Facebook</button>
                <button className="w-full py-2 bg-inherit text-primary border border-primary rounded hover:opacity-70"><i className="bi-google mr-1.5"></i> Login With Google</button>
            </section>
        </div>
    </main>
</div>
);

}

export default LoginPage;
