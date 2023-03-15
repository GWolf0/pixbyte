import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppService from "../services/appService";
import ProfilePic from "./ProfilePic";

//timeout for limiting search request by waiting a certain delay before sending user search input request
let searchTimeout;
const SEARCH_REQUEST_DELAY=1500;

//component
function SearchBox({smallScreen,onDispose}){
//refs
const searchInputRef=useRef();
//states
const [searchLResultOn,setSearchResultOn]=useState(false);
const [searchType,setSearchType]=useState("people");
const [searchRes,setSearchRes]=useState([]);
const [isLoading,setIsLoading]=useState(false);

//effects
useEffect(()=>{
    searchInputRef.current.focus();
},[searchType]);

//methods
function onInputChange(e){
    const val=e.target.value;
    if(val.length>2){
        setSearchResultOn(true);
        startSearchInterval(val);
    }else{
        setSearchResultOn(false);
        setSearchRes([]);
    }
}
function getSearchResultsForTerm(term){
    setIsLoading(true);
    return new Promise((resolve)=>{
        let res=[];
        if(searchType=="people"){
            const re=new RegExp(`${term}`,'gi');
            res=AppService.testData.users.filter((user)=>re.test(user.name));
        }else{
            const re=new RegExp(`#${term}`,'gi');//console.log(AppService.testData.posts.sort((a,b)=>a.createdAt<b.createdAt?-1:1))
            res=AppService.testData.posts.sort((a,b)=>a.createdAt<b.createdAt?-1:1).filter((post)=>{
                //console.log(typeof(post.tags),post.tags,post.tags.some((tag)=>re.test(tag)))
                return post.tags.some((tag)=>tag.search(term)>-1)
            });
        }
        setTimeout(()=>{
            setIsLoading(false);
            resolve(res.slice(0,Math.min(30,res.length)));
        },1500);
    });
}
function startSearchInterval(term){
    if(searchTimeout){
        clearTimeout(searchTimeout);
    }
    searchTimeout=setTimeout(()=>{
        clearTimeout(searchTimeout);
        getSearchResultsForTerm(term).then(res=>{//console.log("Getting search result for term",term);
            setSearchRes(res);
        });
    },SEARCH_REQUEST_DELAY);
}
function _setSearchType(val){
    clearSearchTerm();
    setSearchType(val);
}
function clearSearchTerm(){
    searchInputRef.current.value="";
    setSearchRes([]);
}

return (
<div id="searchBox" className={smallScreen?`fixed left-0 top-0 w-screen z-10 bg-inherit`:`relative hidden md:block grow mx-4 py-2 h-full bg-inherit`} style={{height:`${smallScreen?'60px':'100%'}`}}>
    <div id="searchInputContainer" className="w-full h-full px-4 flex items-center border border-dark rounded">
        <button onClick={onDispose} className="h-full pr-2 text-dark text-2xl hover:opacity-70"><i className="bi-arrow-left-short"></i></button>
        <input ref={searchInputRef} onChange={onInputChange} onFocus={()=>setSearchResultOn(true)} className="bg-inherit basis-0 grow h-full text-darker dark:text-light outline-none" placeholder="search.." type="text" />
        <button onClick={clearSearchTerm} className="p-2 text-dark">&times;</button>
    </div>
    <div hidden={!searchLResultOn} id="searchResultBox" className="absolute top-0 left-0 w-full overflow-y-auto py-2 bg-light dark:bg-darkest border border-dark" style={{height:'calc(100vh - 60px)',marginTop:'60px'}}>
        <ul className="py-1.5 bg-light dark:bg-darkest">
            <button onClick={()=>_setSearchType('people')} className={`px-3 py-1 ${searchType=="people"?'text-primary':'text-dark dark:text-light'} border-r border-dark text-xs hover:text-accent`}>People</button>
            <button onClick={()=>_setSearchType('posts')} className={`px-3 py-1 ${searchType=="posts"?'text-primary':'text-dark dark:text-light'} border-0 border-dark text-xs hover:text-accent`}>Posts</button>
        </ul>
        {
            isLoading?<p className="bg-light dark:bg-darkest w-full py-2 px-4 text-xs text-dark dark:text-light">Loading..</p>:
            <ul className="bg-lighter dark:bg-darker">
                {
                    searchRes.length>0?searchRes.map((res,i)=>(
                        <li key={i} className="py-1.5 border-b border-light dark:border-dark cursor-pointer hover:opacity-70">
                            {
                                searchType=="people"?
                                <a href={`/profile/${res.name}`}>
                                    <div className="py-1 px-2 flex items-center">
                                        <ProfilePic imgUrl={res.profileImg} username={res.name} />
                                        <p className="text-sm text-dark dark:text-light ml-4">{res.name}</p>
                                    </div>
                                </a>
                                    :
                                <Link to={`/post/${res.id}`}>
                                    <div className="py-1 px-2">
                                        <p className="text-sm text-dark dark:text-light">{res.text.substr(0,Math.max(res.text.length,25))}</p>
                                    </div>
                                </Link>
                            }
                        </li>
                    )):
                    <p className="bg-light dark:bg-darkest w-full py-2 px-4 text-xs text-dark dark:text-light">No results</p>
                }
            </ul>
        }
        
    </div>
</div>
);
}

SearchBox.defaultProps={
    smallScreen:false,
};

export default SearchBox;