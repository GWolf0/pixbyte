import { createContext, useState, useEffect, useLayoutEffect } from "react";
import AppService from "../services/appService";

const globalContext=createContext();

function GlobalContextProvider({children}){
//states
const [isLoading,setIsLoading]=useState(true);
const [loggedUser,setLoggedUser]=useState(false);
const [isMobile,setIsMobile]=useState(window.innerWidth<720);
//effects
useEffect(()=>{
    //handlers
    function onResize(){
        setIsMobile(window.innerWidth<720);
    }
    //events
    window.addEventListener('resize',onResize);
    //init
    AppService.init();
    setLoggedUser(AppService.isLogged());
    setIsLoading(false);
    //remove events
    return ()=>{
        window.removeEventListener('resize',onResize);
    };
},[]);

//methods

return !isLoading?
(<globalContext.Provider value={{isMobile}}>
    {children}
</globalContext.Provider>):
(<div className="App w-screen h-screen bg-lighter dark:bg-darkest flex items-center justify-center">
    <p className="text-dark dark:text-light text-sm text-center">App Loading..</p>
</div>);
}

export {globalContext,GlobalContextProvider};
