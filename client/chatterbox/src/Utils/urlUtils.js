
export const isMainPage = ()=>{
    return window.location.href.includes("addchat") 
        || window.location.href.includes("addgroup") ?
         false : true;
}

export const isAddChatPage = ()=>{
        return window.location.href.includes("addchat") ? true : false ;
}

export const isAddGroupPage = ()=>{
        return window.location.href.includes("addgroup") ? true : false ;
}       