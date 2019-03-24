chrome.browserAction.onClicked.addListener(function(activeTab)
{
    //var newURL = "/bookmarks.html";
    //chrome.tabs.create({ url: newURL });
    chrome.bookmarks.search("private",
        function(bookmarkTreeNodes){
            var nodes = bookmarkTreeNodes
            if(nodes.length>0){
                console.log(nodes[0].id)
                chrome.bookmarks.getSubTree(nodes[0].id,function(result){
                    saveFolder(result);
                });
                removeFolder(nodes[0].id);
            }else{
                console.log("no nodes")
                chrome.storage.local.get('private',function(saves){
                    chrome.bookmarks.create({
                        title: 'private',
                    },function(result){
                        addFolder(saves.private['0'],result.id)
                    });
                });
            }
        });
});

function saveFolder(folder){
    chrome.storage.local.set({private:folder});
}


function removeFolder(folderID){
    chrome.bookmarks.removeTree(folderID)
}

function addFolder(folder,id){
    console.log(folder);
    //iterate through all sub nodes
    //for(node in folder.children){
    for(var i=0;i<folder.children.length;i++){
        const node = Object.assign({},folder.children[i]);
        console.log("node:")
        console.log(node)
        //if bookmark
        if(node.children==null){
            chrome.bookmarks.create({
                title: node.title,
                parentId: id,
                url: node.url
            });
        }else{ // if folder
            //var temp = Object.assign({},node);
            console.log('this is a folder'+node.title);
            chrome.bookmarks.create({
                title: node.title,
                parentId: id
            }, function(result){addFolder(node,result.id)});
        }
    }
}