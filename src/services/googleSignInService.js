import Helper from "./helper";

const CLIENT_ID="";
class GoogleAuthService{

  static init(){//console.log("ini gauth")
    window.handleCredentialResponse=(res)=>{
      function parseJWT(token){
        const base64URL=token.split(".")[1];
        const base64=decodeURIComponent(atob(base64URL).split('').map(c=>{
          return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(base64);
      }
      //console.log("gauth res",res);
      const credential=parseJWT(res.credential);
      //console.log(credential);
      window.dispatchEvent(new CustomEvent("ongauthlogin",{detail:{credential}}))
    };
    const script=document.createElement('script'); 
    script.async=true;
    script.defer=true;
    document.body.appendChild(script);
    script.onload=()=>{
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback:window.handleCredentialResponse
      });
      google.accounts.id.renderButton(document.getElementById("gauthContainer"),{
        theme:'filled_black',
        shape:'rectangular',
        size:'large',
        text:'signin_with',
        click_listener:()=>{}
      });
      //google.accounts.id.prompt();
      GoogleAuthService.isInitialized=true;
    };
    script.src='https://accounts.google.com/gsi/client?ver='+Helper.randID();
  }

  static revoke(email){
    google.accounts.id.revoke(email,done=>{
      console.log("GAUTH: Consent revoked!");
    });
  }

}

export default GoogleAuthService;
