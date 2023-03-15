import Helper from "./helper";

class AppService{
    //posts liked by the connected user
    static likedPosts=[];
    //images files 'uploaded by the user'
    static userImages=[];

    static init(){//console.log("init appservice")
        //check theme
        const isDarkTheme=localStorage.getItem("darkTheme")==="true";
        if(isDarkTheme){
            document.body.classList.add("dark");
        }else{
            document.body.classList.remove("dark");
        }
        //check saved testdata
        const savedTestData=localStorage.getItem('testData');//console.log(savedTestData)
        if(savedTestData){
            AppService.testData=JSON.parse(savedTestData);
        }
        const connectedUser=AppService.isLogged();
        AppService.likedPosts=connectedUser?AppService.getLikedPostsIDs(connectedUser.id):[];
        AppService.userImages=connectedUser?AppService.getUserImages(connectedUser.id):[];
    }
    //
    static isLogged(){
        return AppService.testData.user;
    }

    //Login page things
    //return null if registered successfuly and an object of errors if any
    static register(email,password){
        let errors={};
        if(AppService.testData.users.find(u=>u.email===email)!=null){
            errors.email="This email exists!";
        }
        if(!Helper.checkEmail(email)){
            errors.email="Invalid email!";
        }
        if(password.length<6){
            errors.password="Password is too short (minimum 6 characters)!";
        }
        if(JSON.stringify(errors)!=="{}")return errors;
        const newID=Helper.randID();
        const newUser={id:newID,name:`User${newID}`,email:email,password:password,profileImg:null,createdAt:new Date(),signupMethod:'default'};
        AppService.testData.users.push(newUser);
        AppService.testData.user=newUser;
        localStorage.setItem('user',JSON.stringify(newUser));
        AppService.saveTestData();
        return null;
    }
    //return the user if login successful and null if not
    static login(email,password){
        const user=AppService.testData.users.find(u=>u.email===email&&u.password===password);
        if(user){
            AppService.testData.user=user;
            AppService.saveTestData();
            return user;
        }else{
            return null;
        }
    }
    //logout
    static logout(){
        AppService.testData.user=null;
        AppService.saveTestData();
    }

    //Home page things
    static getPosts(offs=0,count=10){
        const user=AppService.isLogged();
        //reminder: getUserLinks returns the user objects not the link objects
        const links=AppService.getUserLinks(user.id);//console.log(user,links)
        let posts=AppService.testData.posts.sort((a,b)=>a.createdAt>b.createdAt?-1:1).filter((p,i)=>
            (links.some(l=>l.id===p.user_id))||(p.user_id===user.id)
        );
        posts=posts.slice(offs,offs+count);
        return posts;
    }
    static getPostsCount(userID){
        return AppService.testData.posts.filter(p=>p.user_id===userID).length;
    }
    static postNewPost(text,media=[]){
        text=text.trim();
        const user=AppService.testData.user;
        const postTags=(text+" ").match(/#\w+\s/gi)?.map(res=>res.trim());
        const newPost={id:Helper.randID(),text:text,user_id:user.id,media:media,createdAt:new Date(),tags:postTags??[]};
        AppService.testData.posts.push(newPost);
        AppService.saveTestData();
        return newPost;
    }
    static editPost(id,text,media=[]){
        let post=AppService.getPostById(id);
        if(!post)return null;
        text=text.trim();
        const postTags=(text+" ").match(/#\w+\s/gi)?.map(res=>res.trim());
        const editedPost={...post,text:text,media:media,tags:postTags??[]};
        AppService.testData.posts=AppService.testData.posts.map(p=>p.id===post.id?editedPost:p);
        AppService.saveTestData();
        return editedPost;
    }
    static removePost(id){
        AppService.testData.posts=AppService.testData.posts.filter(p=>p.id!==id);
        AppService.saveTestData();
    }
    static getPostMedia(postID){
        const post=AppService.getPostById(postID);
        const media=post.media.map(m=>AppService.testData.images.find(img=>img.id===m));
        return media;
    }

    //helpers
    static saveTestData(){
        localStorage.setItem("testData",JSON.stringify(AppService.testData));
    }
    static getUserById(id){
        return AppService.testData.users.find(u=>u.id===id);
    }
    static getUserByName(username){
        return AppService.testData.users.find(u=>u.name===username);
    }
    static userNameExists(username){
        return AppService.testData.users.some(u=>u.name===username);
    }
    static getUserLinks(userID){
        const linkedUsers=AppService.testData.users.filter(u=>AppService.testData.links.findIndex(l=>l.user_id===userID&&l.linked_user_id===u.id)>-1);
        return linkedUsers;
    }
    static isLinkedByUser(userID,checkUserID){
        return AppService.testData.links.findIndex(l=>l.user_id===userID&&l.linked_user_id===checkUserID)>-1;
    }
    static toggleLink(userID,userToLinkID){
        const isLinked=AppService.isLinkedByUser(userID,userToLinkID);
        if(isLinked){
            AppService.testData.links=AppService.testData.links.filter(l=>l.user_id!==userID&&l.linked_user_id!==userToLinkID);
        }else{
            AppService.testData.links.push({id:Helper.randID(),user_id:userID,linked_user_id:userToLinkID,createdAt:new Date()});
        }
        AppService.saveTestData();
        return !isLinked;
    }
    static getPostById(id){
        return AppService.testData.posts.find(p=>p.id===id);
    }
    static getUserPosts(id,offs=0,count=10){
        let posts=AppService.testData.posts.filter(p=>p.user_id===id);
        posts=posts.slice(offs,offs+count);
        return posts;
    }
    static getPostComments(postID,offs=0,count=10){
        let comms=AppService.testData.comments.sort((a,b)=>a.createdAt>b.createdAt?-1:1).filter((c,i)=>c.post_id===postID);
        comms=comms.slice(offs,offs+count);
        return comms;
    }
    static getPostCommentsCount(postID){
        const comms=AppService.testData.comments.filter((c,i)=>c.post_id===postID);
        return comms.length;
    }
    static getPostLikesCount(postID){
        const likes=AppService.testData.likes.filter((l,i)=>l.post_id===postID);
        return likes.length;
    }
    static getCommentById(id){
        return AppService.testData.comments.find(c=>c.id==id);
    }
    static getCommentDetails(commentsID){
        const comment=AppService.getCommentById(commentsID);
        if(!comment)return [null,null];
        const commentUser=AppService.getUserById(comment.user_id);
        const commentPost=AppService.getPostById(comment.post_id);
        return [commentUser,commentPost];
    }
    static addComment(userId,postId,text){
        const newComment={id:Helper.randID(),text:text.trim().substr(0,Math.min(256,text.length)),user_id:userId,post_id:postId,createdAt:new Date()};
        AppService.testData.comments.push(newComment);
        AppService.saveTestData();
        return newComment;
    }
    static removeComment(commentId){
        AppService.testData.comments=AppService.testData.comments.filter(c=>c.id!==commentId);
        AppService.saveTestData();
    }
    static toggleLike(postID){
        let post=AppService.getPostById(postID);
        let loggedUser=AppService.isLogged();
        if(!post||!loggedUser)return;
        const liked=AppService.testData.likes.find(l=>l.user_id===loggedUser.id&&l.post_id===postID);
        if(liked){
            AppService.testData.likes=AppService.testData.likes.filter(l=>l.id!==liked.id);
            AppService.likedPosts=AppService.likedPosts.filter(id=>id!==postID);
        }else{
            AppService.testData.likes.push({id:Helper.randID(),user_id:loggedUser.id,post_id:postID});
            AppService.likedPosts.push(postID);
        }
        AppService.saveTestData();
        return liked==null;
    }
    static getLikedPostsIDs(userID){
        const likedPostsIDs=AppService.testData.likes.filter(l=>l.user_id===userID).map(l=>l.post_id);
        return likedPostsIDs;
    }
    static isPostLiked(postID){
        return AppService.likedPosts.includes(postID);
    }
    //
    static getUserImages(userID){
        return AppService.testData.images.filter(img=>img.user_id===userID);
    }
    //
    static getLinksSuggestions(user,count=6){
        const usersCount=AppService.testData.users.length;
        const offs=Math.floor(Math.random()*usersCount);
        const max=Math.min(offs+count,usersCount);
        return AppService.testData.users.filter((u,i)=>i>=offs&&i<max&&u.id!==user.id);
    }
    //settings
    static updateUsername(userID,newUsername){
        const user=AppService.getUserById(userID);
        if(!user)return;
        user.name=newUsername;
        const loggedUser=AppService.isLogged();
        if(loggedUser.id===user.id){
            AppService.testData.user=user;
        }
        AppService.saveTestData();
    }
    //messages things
    static getMessages(userID){
        return AppService.testData.messages.filter(m=>m.user_id===userID);
    }
    static disposeMessages(userID){
        AppService.testData.messages=AppService.testData.messages.filter(n=>n.user_id!==userID);
        AppService.saveTestData();
    }
    //notifications things
    static getNotifications(userID){
        return AppService.testData.notifications.filter(n=>n.user_id===userID);
    }
    static disposeNotifications(userID){
        AppService.testData.notifications=AppService.testData.notifications.filter(n=>n.user_id!==userID);
        AppService.saveTestData();
    }
    //image things
    static insertImageFile(userID,name,size,imageUrl){
        const newImageFile={id:Helper.randID(),user_id:userID,name:name,size:size,url:imageUrl,createdAt:new Date()};
        AppService.testData.images.push(newImageFile);
        AppService.uploadedImages.push(newImageFile);
        AppService.saveTestData();
        return newImageFile;
    }
    static removeImagesFiles(fileIDs){
        AppService.testData.images=AppService.testData.images.filter(img=>!fileIDs.includes(img.id));
        AppService.uploadedImages=AppService.uploadedImages.filter(img=>!fileIDs.includes(img.id));
        AppService.saveTestData();
    }

    //test data
    static testData={
        user:null,
        users:[
            // {id:1,name:'Kirito',email:'kirito@email.com',password:'123123',profileImg:'/assets/images/kiritoProfileImg.jpg',createdAt:new Date(),signupMethod:'default'},
            // {id:2,name:'Asuna',email:'asuna@email.com',password:'123123',profileImg:'/assets/images/asunaProfileImg.jpg',createdAt:new Date(),signupMethod:'default'}
            {id:1,name:'Link',email:'link@email.com',password:'123123',profileImg:'/assets/images/profiles/linkPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:2,name:'Zelda',email:'zelda@email.com',password:'123123',profileImg:'/assets/images/profiles/zeldaPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:3,name:'Saria',email:'saria@email.com',password:'123123',profileImg:'/assets/images/profiles/sariaPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:4,name:'Mido',email:'mido@email.com',password:'123123',profileImg:'/assets/images/profiles/midoPI.png',createdAt:new Date(),signupMethod:'default'},
            {id:5,name:'Navi',email:'navi@email.com',password:'123123',profileImg:'/assets/images/profiles/naviPI.gif',createdAt:new Date(),signupMethod:'default'},
            {id:6,name:'Epona',email:'epona@email.com',password:'123123',profileImg:'/assets/images/profiles/eponaPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:7,name:'Malon',email:'malon@email.com',password:'123123',profileImg:'/assets/images/profiles/malonPI.png',createdAt:new Date(),signupMethod:'default'},
            {id:8,name:'Talon',email:'talon@email.com',password:'123123',profileImg:'/assets/images/profiles/talonPI.png',createdAt:new Date(),signupMethod:'default'},
            {id:9,name:'Ingo',email:'ingo@email.com',password:'123123',profileImg:'/assets/images/profiles/ingoPI.png',createdAt:new Date(),signupMethod:'default'},
            {id:10,name:'Anju',email:'anju@email.com',password:'123123',profileImg:'/assets/images/profiles/anjuPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:11,name:'Darunia',email:'darunia@email.com',password:'123123',profileImg:'/assets/images/profiles/daruniaPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:12,name:'Ruto',email:'ruto@email.com',password:'123123',profileImg:'/assets/images/profiles/rutoPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:13,name:'ZoraKing',email:'zoraking@email.com',password:'123123',profileImg:'/assets/images/profiles/zorakingPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:14,name:'Rauru',email:'rauru@email.com',password:'123123',profileImg:'/assets/images/profiles/rauruPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:15,name:'goronLink',email:'linkgoron@email.com',password:'123123',profileImg:'/assets/images/profiles/linkgoronPI.png',createdAt:new Date(),signupMethod:'default'},
            {id:16,name:'Sheik',email:'sheik@email.com',password:'123123',profileImg:'/assets/images/profiles/sheikPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:17,name:'Ganondorf',email:'ganon@email.com',password:'123123',profileImg:'/assets/images/profiles/ganonPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:18,name:'Nabooru',email:'nabooru@email.com',password:'123123',profileImg:'/assets/images/profiles/nabooruPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:19,name:'Mutoh',email:'mutoh@email.com',password:'123123',profileImg:'/assets/images/profiles/mutohPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:20,name:'RunningMan',email:'runningman@email.com',password:'123123',profileImg:'/assets/images/profiles/runningmanPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:21,name:'Impa',email:'impa@email.com',password:'123123',profileImg:'/assets/images/profiles/impaPI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:22,name:'Dampe',email:'dampe@email.com',password:'123123',profileImg:'/assets/images/profiles/dampePI.jpg',createdAt:new Date(),signupMethod:'default'},
            {id:23,name:'GraveyardLad',email:'graveyardkid@email.com',password:'123123',profileImg:'/assets/images/profiles/graveyardkidPI.png',createdAt:new Date(),signupMethod:'default'},
        ],
        links:[
            {id:1,user_id:1,linked_user_id:2,createdAt:new Date()},
            {id:2,user_id:2,linked_user_id:1,createdAt:new Date()},
        ],
        posts:[
            {id:1,text:'Link post #link 1.',user_id:1,media:[],tags:["#link"],createdAt:new Date()},
            {id:2,text:'Link post #link 2.',user_id:1,media:[],tags:["#link"],createdAt:new Date()},
            {id:3,text:'Link post #link 3.',user_id:1,media:[],tags:["#link"],createdAt:new Date()},
            {id:4,text:'Zelda post #zelda 1.',user_id:2,media:[],tags:["#zelda"],createdAt:new Date()},
            {id:5,text:'Zelda post #zelda 2.',user_id:2,media:[],tags:["#zelda"],createdAt:new Date()},
            {id:6,text:'Saria post #saria 1.',user_id:3,media:[],tags:["#saria"],createdAt:new Date()},
            {id:7,text:'Saria post #saria 2.',user_id:3,media:[],tags:["#saria"],createdAt:new Date()},
            {id:8,text:'Saria post #saria 3.',user_id:3,media:[],tags:["#saria"],createdAt:new Date()},
            {id:9,text:'Mido post #mido 1.',user_id:4,media:[],tags:["#mido"],createdAt:new Date()},
            {id:10,text:'Mido post #mido 2.',user_id:4,media:[],tags:["#mido"],createdAt:new Date()},
            {id:11,text:'Navi post #navi #hey #listen 1.',user_id:5,media:[],tags:["#navi","#hey","#listen"],createdAt:new Date()},
            {id:12,text:'Navi post #navi #hey #listen 2.',user_id:5,media:[],tags:["#navi","#hey","#listen"],createdAt:new Date()},
            {id:13,text:'Navi post #navi #hey #listen 3.',user_id:5,media:[],tags:["#navi","#hey","#listen"],createdAt:new Date()},
        ],
        comments:[
            {id:1,text:'Comment 1.',user_id:1,post_id:1,createdAt:new Date()},
        ],
        likes:[
            {id:1,user_id:1,post_id:1,createdAt:new Date()},
        ],

        messages:[],
        notifications:[
            {id:1,user_id:1,text:'A test notification',type:'none',createdAt:new Date()}
        ],

        images:[
            {id:1,user_id:1,url:'/assets/images/bg.jpg',name:'bg.jpg',size:0,createdAt:new Date()},
        ]
    
    };
    static uploadedImages=[];

}

export default AppService;
