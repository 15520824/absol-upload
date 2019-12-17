import Context from 'absol/src/AppPattern/Context';

import Draggable from 'absol-acomp/js/Draggable';

import '../../css/UploadEditor.css';
import Fcore from '../core/FCore';
import Dom from 'absol/src/HTML5/Dom';

import R from '../R';
import { randomIdent } from 'absol/src/String/stringGenerate';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import BaseEditor from '../core/BaseEditor';
import sorttable from '../lib/sorttable';

var _ = Fcore._;
var $ = Fcore.$;

function UploadEditor() {
    BaseEditor.call(this);
    this.prefix = randomIdent(16) + "_";
    this.setContext(R.FORM_EDITOR, this);
    var self = this;
    this.style = {
        leftSizeWidth: 16,//em
        leftSizeMinWidth: 10,

        rightSizeWidth: 23,//em
        rightSizeMinWidth: 15,

    };
    this.sorttable = new sorttable();
}

Number.prototype.zeroPad = function(digits) {
    var loop = digits;
    var zeros = "";
    while (loop) {
      zeros += "0";
      loop--;
    }
    return (this.toString().length > digits) ?
      this.toString() : (zeros + this).slice(-digits);
}

Object.defineProperties(UploadEditor.prototype, Object.getOwnPropertyDescriptors(BaseEditor.prototype));
UploadEditor.prototype.constructor = UploadEditor;

UploadEditor.prototype.CONFIG_STORE_KEY = "AS_UploadEditor_config";
UploadEditor.prototype.onStart = function () {
};


UploadEditor.prototype.onStop = function () {
};


UploadEditor.prototype.onPause = function () {
};


UploadEditor.prototype.onResume = function () {
};


UploadEditor.prototype.config = {
    leftSiteWidthPercent: 15
};

UploadEditor.prototype.createModal = function(DOMElement){
    var self = this;
    self.modal = _({
        tag: "modal",
        child: [
        ]
      });
      return self.modal;
}

UploadEditor.prototype.processNavigation = function(value = 0)
{
    
    this.progressBar = _(
        {
            tag: "progress",
            class:
              "modal-upload-XML-body-drop-area-main-process-bar",
            props: {
              id: "progress-bar",
              max: "100",
              value: value
            }
        }
    );
    this.detailFiles = _({
        tag:"span",
        class:"as-upload-editor-upload-page-body-process-text-percent-content-1"
    });
    this.sizeFiles = _({
        tag:"span",
        class:"as-upload-editor-upload-page-body-process-text-percent-content-2"
    });
    this.startup = _({
        tag:"div",
        class:"as-upload-editor-upload-page-body-process-text",
        props:{
            innerHTML:"Đang tải file"
        }
    });
    this.processContainer = _({
        tag:"div",
        style:{
            display:"none"
        },
        class:"as-upload-editor-upload-page-body-process",
        child:[
            {
                tag:"div",
                class:"as-upload-editor-upload-page-body-process-container",
                child:[
                    this.startup,
                    {
                        tag:"div",
                        class:"as-upload-editor-upload-page-body-process-text-percent",
                        child:[
                            this.detailFiles,
                            this.sizeFiles
                        ]
                    }
                ]
            },
            this.progressBar
        ]

    });
    return this.processContainer;
}

UploadEditor.prototype.getView = function (DOMElement) {
    if (this.$view) return this.$view;
    var self=this;
    var doneButton;
    var closeButton;
    self.waittingForData = new Promise(function(resolve,reject){
        doneButton = _({
            tag: "iconbutton",
            on:{
                click: function(){
                    self.modal.parentNode.removeChild(self.modal);
                    var bodyTable = self.$tableList.getElementsByTagName("tbody");
                    if(bodyTable.length!==0)
                    bodyTable = bodyTable[0];
                    var final=[];
                    var arr = self.$tableList.getElementsByClassName("elementChoice")
                    for(var i=0;i<arr.length;i++)
                    {
                        final.push(arr[i].getUrl())
                    }
                    resolve(final);
                }
            },
            child: [{
                tag: 'i',
                class: 'material-icons',
                props: {
                    innerHTML: 'done'
                }
            },
            '<span>' + "Xong" + '</span>'
            ]
        });
        closeButton = _({
            tag: "i",
            class: [
              "modal-upload-XML-header-icon-close",
              "material-icons"
            ],
            props: {
              innerHTML: "close"
            },
            on: {
              click: function() {
                    self.modal.parentNode.removeChild(self.modal);
                    reject();
              }
            }
        });
    })
    DOMElement.addChild(this.createModal(DOMElement));
    var input = _({
        tag: "input",
        class: "modal-upload-XML-body-drop-area-main-form-input",
        props: {
          type: "file",
          multiple: "multiple",
          accept: "*.*",
          id: "fileElem"
        },
        on: {
          change: function() {
            self.handleFiles(this.files);
          }
        }
    });
    this.hiddenInput = _({
        tag:"div",
        style:{
            display:"none"
        },
        class:"as-upload-editor-upload-page-header-input-hidden",
        child:[
            {
                tag:"input",
                class:"as-upload-editor-upload-page-header-input-hidden-content"
            }
        ]
    });
    this.renameButton = _({
        tag: "iconbutton",
        on:{
            click: function(event){
                if(!this.classList.contains("holder-button")){
                    var bodyTable = self.$tableList.getElementsByTagName("tbody");
                        if(bodyTable.length!==0)
                            bodyTable = bodyTable[0];
                        var arr = self.$tableList.getElementsByClassName("selected")
                        if(arr.length==1)
                        arr=arr[0];

                    self.hiddenInput.childNodes[0].value = arr.getName();;
                    self.hiddenInput.style.display="flex";
                    this.classList.add("holder-button");
                }
                else{
                    var bodyTable = self.$tableList.getElementsByTagName("tbody");
                        if(bodyTable.length!==0)
                            bodyTable = bodyTable[0];
                        var arr = self.$tableList.getElementsByClassName("selected")
                        if(arr.length==1)
                        arr=arr[0];
                    arr.setName(self.hiddenInput.childNodes[0].value);
                    self.hiddenInput.style.display="none";
                    this.classList.remove("holder-button");
                }
                var arr = self.$view.getElementsByClassName("holder-button");
                if(arr.length!=0)
                {
                    for(var i=0;i<arr.length;i++)
                    if(arr[i]!==this)
                    arr[i].classList.remove("holder-button");
                }
            }
        },
        style:{
            display:"none"
        },
        child: [{
            tag: 'i',
            class: 'material-icons',
            props: {
                innerHTML: 'notes'
            }
        },
        '<span>' + "Đổi tên" + '</span>'
        ]
    });
    this.$tableList = this.tableList();
    this.$view = _({
        class: 'as-upload-editor',
        attr: {
            tabindex: '1'
        },
        child: [
            {
                tag:"div",
                class:"as-upload-editor-upload-page",
                child:[
                    {
                        tag:"div",
                        class:"as-upload-editor-upload-page-title",
                        child:[
                            {
                                tag: "div",
                                class: "modal-upload-XML-header-text",
                                props: {
                                  innerHTML: "Upload Files"
                                }
                              },
                              closeButton
                        ]
                    },
                    {
                        tag:"div",
                        class:"as-upload-editor-upload-page-header",
                        child:[
                            {
                                tag:"div",
                                class:"as-upload-editor-upload-page-header-top",
                                child:[
                                    {
                                        tag:"input",
                                        props:{
                                            placeholder:"Bộ lọc"
                                        },
                                        on:{
                                            input: function(event)
                                            {
                                                var bodyTable = self.$tableList.getElementsByTagName("tbody");
                                                if(bodyTable.length!==0)
                                                bodyTable = bodyTable[0];
                                                var arr = self.$tableList.getElementsByClassName("elementChoice")
                                                for(var i=0;i<arr.length;i++)
                                                {
                                                    if(arr[i].getUrl().name.toLowerCase().indexOf(this.value.toLowerCase())!==-1)
                                                    arr[i].style.display = "table-row";
                                                    else
                                                    arr[i].style.display = "none";
                                                }
                                            }
                                        }
                                    },
                                    {
                                        tag: 'i',
                                        class: 'material-icons',
                                        props: {
                                            innerHTML: 'settings_applications'
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"as-upload-editor-upload-page-header-bottom",
                                child:[
                                    doneButton,
                                    {
                                        tag: "iconbutton",
                                        on:{
                                            click: function(){
                                                input.click();
                                            }
                                        },
                                        child: [{
                                            tag: 'i',
                                            class: 'material-icons',
                                            props: {
                                                innerHTML: 'publish'
                                            }
                                        },
                                        '<span>' + "Tải lên" + '</span>'
                                        ]
                                    },
                                    {
                                        tag: "iconbutton",
                                        on:{
                                            click: function(event)
                                            {
                                                var bodyTable = self.$tableList.getElementsByTagName("tbody");
                                                if(bodyTable.length!==0)
                                                bodyTable = bodyTable[0];
                                                var arr = self.$tableList.getElementsByClassName("selected")
                                                for(var i=0;i<arr.length;i++)
                                                {
                                                    self.Download(arr[i].getUrl())
                                                }
                                            }
                                        },
                                        child: [{
                                            tag: 'i',
                                            class: 'material-icons',
                                            props: {
                                                innerHTML: 'save_alt'
                                            }
                                        },
                                        '<span>' + "Tải xuống" + '</span>'
                                        ]
                                    },
                                    {
                                        tag: "iconbutton",
                                        on:{
                                            click: function(event){
                                                if(!this.classList.contains("holder-button")){
                                                    self.hiddenInput.childNodes[0].value="";
                                                    self.hiddenInput.style.display="flex";
                                                    this.classList.add("holder-button");
                                                }
                                                else{
                                                    self.downloadFileFromUrl(self.hiddenInput.childNodes[0].value);
                                                    self.hiddenInput.style.display="none";
                                                    this.classList.remove("holder-button");
                                                }
                                                var arr = self.$view.getElementsByClassName("holder-button");
                                                if(arr.length!=0)
                                                {
                                                    for(var i=0;i<arr.length;i++)
                                                    if(arr[i]!==this)
                                                    arr[i].classList.remove("holder-button");
                                                }
                                            }
                                        },
                                        child: [{
                                            tag: 'i',
                                            class: 'material-icons',
                                            props: {
                                                innerHTML: 'link'
                                            }
                                        },
                                        '<span>' + "Thêm link" + '</span>'
                                        ]
                                    },
                                    this.renameButton,
                                    {
                                        tag: "iconbutton",
                                        on:{
                                            click: function(event)
                                            {
                                                var bodyTable = self.$tableList.getElementsByTagName("tbody");
                                                if(bodyTable.length!==0)
                                                bodyTable = bodyTable[0];
                                                var arr = self.$tableList.getElementsByClassName("selected");
                                                for(var i=arr.length-1;i>=0;i--)
                                                {
                                                    arr[i].parentNode.removeChild(arr[i]);
                                                }
                                            }
                                        },
                                        child: [{
                                            tag: 'i',
                                            class: 'material-icons',
                                            props: {
                                                innerHTML: 'delete'
                                            }
                                        },
                                        '<span>' + "Xóa" + '</span>'
                                        ]
                                    },
                                ]
                            },
                            this.hiddenInput
                        ]
                    },
                    {
                        tag:"div",
                        class:"as-upload-editor-upload-page-body",
                        child:[
                            {
                                tag:"div",
                                class:"as-upload-editor-upload-page-body-right",
                                child:[
                                    {
                                        tag:"div",
                                        class:"as-upload-editor-upload-page-body-content",
                                        child:[
                                            this.processNavigation(),
                                            input,
                                            {
                                                tag:"div",
                                                class:"as-upload-editor-upload-page-body-list",
                                                child:[
                                                    this.$tableList
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
    });
    this.modal.addChild(this.$view);
    this.sorttable.init();

    return this.$view;
};

UploadEditor.prototype.handleFiles = function(files) {
    var self = this;
    files = [...files];
    self.initializeProgress(files);
    for (var i = 0; i < files.length; i++) {
      self.uploadFile(files,i).then(function(result){
        self.previewFile(result);
      })
    }
}

UploadEditor.prototype.updateVisiableRename = function()
{
    var bodyTable = this.$tableList.getElementsByTagName("tbody");
        if(bodyTable.length!==0)
        bodyTable = bodyTable[0];
    var arr = this.$tableList.getElementsByClassName("selected");
    console.log(arr.length)
    if(arr.length==1)
    this.renameButton.style.display="inline-block";
    else
    this.renameButton.style.display="none";
}

UploadEditor.prototype.downloadFileFromUrl = function(url){
    var self = this;
    fetch(url)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
        var file = self.blobToFile(blob,url.substring(url.lastIndexOf('/')+1));
        var files = [file];
        for (var i = 0; i < files.length; i++) {
            self.uploadFile(files,i).then(function(result){
              self.previewFile(result);
            })
          }
    // Here's where you get access to the blob
    // And you can use it for whatever you want
    // Like calling ref().put(blob)

    // Here, I use it to make an image appear on the page
   
    });
}

UploadEditor.prototype.initializeProgress = function(files) {
    var self = this;
    this.processContainer.display="block";
    this.startup.innerHTML = "Đang tải file";
    self.progressBar.setAttribute("value",0);
    self.detailFiles.innerHTML = "Uploaded files: 0 of "+files.length;
    self.detailFiles.total = files.length;
    var Total = 0;
    for(var i=0;i<files.length;i++)
        Total+=files[i].size;
    self.sizeFiles.innerHTML = "(0 KB of "+Total/1000+" KB)";
    self.sizeFiles.total = Total/1000;
};

UploadEditor.prototype.ev_resize = function () {

};


UploadEditor.prototype.setLeftSiteWidthPercent = function (value) {
    if (value > 8) {
        this.config.leftSiteWidthPercent = value;
        this.saveConfig();
        if (this.$view) {
            this.$leftSiteCtn.addStyle('width', 'calc(' + this.config.leftSiteWidthPercent + "% - 3em)");
            this.$editorSpaceCtn.addStyle('left', this.config.leftSiteWidthPercent + '%');
            this.$emptySpace.addStyle('left', this.config.leftSiteWidthPercent + '%');

            if (this._dragLeftMovingData) {
                this.$leftSiteResizer.addStyle({
                    left: 'calc(' + this.config.leftSiteWidthPercent + '% - 8em)'
                });
            }
            else
                this.$leftSiteResizer.addStyle('left', 'calc(' + this.config.leftSiteWidthPercent + "% - 0.1em)");
        }
    }
}

UploadEditor.prototype.tableList = function()
{
    var bodyTable = _({
        tag:"tbody"
    });
    var list = _({
        tag:"table",
        class:"sortable",
        child:[
            {
                tag:"thead",
                child:[
                    {
                        tag:"tr",
                        props:{
                            height: "41px"
                        },
                        child:[
                            {
                                tag:"th",
                                style:{
                                    textAlign: "left",
                                    width:"50%"
                                },
                                child:[
                                    {
                                        tag:"span",
                                        style:{
                                            marginLeft:"calc(30px + 1.5em)"
                                        },
                                        props:{
                                            innerHTML:"File Name"
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"th",
                                style:{
                                    width:"25%"
                                },
                                props:{
                                    innerHTML:"File Size"
                                }
                            },
                            {
                                tag:"th",
                                style:{
                                    textAlign: "right",
                                    width: "25%"
                                },
                                props:{
                                    innerHTML:"Date"
                                }
                            },
                        ]
                    }
                ]
            },
            bodyTable
        ]
    })
    list.addChildElement = function(elementItem){
        bodyTable.addChild(elementItem);
    }
    window.addEventListener("keydown",function(e){
        if(e.ctrlKey==true&&e.code=="KeyA")
        {
            // e.preventDefault();
            var arr = bodyTable.getElementsByClassName("elementChoice");
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i].style.display!=="none")
                if(!arr[i].classList.contains("selected"))
                arr[i].classList.add("selected");
            }
        }
    })
    return list;
}

UploadEditor.prototype.elementItem = function(object)
{
    var self=this;
    var urlIcon = "/image/"+object.name.slice(object.name.lastIndexOf('.')+1).toLowerCase()+".png";
    var nameTd = _({
        tag:"td",
        child:[
            {
                tag:"div",
                child:[
                    {
                        tag:"img",
                        style:{
                            width:"30px",
                            height:"24px",
                            marginLeft: "1em"
                        },
                        props:{
                            src:urlIcon
                        }
                    },{
                        tag:"span",
                        style:{
                            marginLeft: "0.5em"
                        },
                        props:{
                            innerHTML:object.name
                        }
                    }
                ]
            }]
    })
    var sizeTd = _({
        tag:"td",
        style:{
            textAlign:"center"
        },
        props:{
            innerHTML:object.size/1000 + " KB"
        }
    });
    var dateTd = _(
        {
            tag:"td",
            style:{
                textAlign:"right"
            },
            child:[
                {
                    tag:"div",
                    child:[
                        {
                            tag:"span",
                            props:{
                                innerHTML:this.formatDate(object.lastModifiedDate)
                            }
                        },
                        {
                            tag:"span",
                            style:{
                                width: "80px",
                                display: "inline-block"
                            },
                            props:{
                                innerHTML:this.formatHour(object.lastModifiedDate)
                            }
                        }
                    ]
                }
            ]
        }
    )
    var item = _({
        tag:"tr",
        class:"elementChoice",
        on:{
            click: function(event){
                if(event.ctrlKey==false){
                    var arr = [...self.$tableList.getElementsByClassName("selected")];
                    for(var i=0;i<arr.length;i++)
                    {
                        arr[i].classList.remove("selected");
                    }
                }
                if(!this.classList.contains("selected"))
                this.classList.add("selected");
                else
                if(event.ctrlKey==true)
                this.classList.remove("selected");
                self.updateVisiableRename();
            }
        },
        child:[
            nameTd,
            sizeTd,
            dateTd
        ]
    });
    sizeTd.setAttribute("sorttable_customkey",object.size.zeroPad(10));
    dateTd.setAttribute("sorttable_customkey",this.formatDateTime(object.lastModifiedDate));
    item.file = object;
    item.getUrl = function(){
        return item.file;
    }
    item.setName = function(text){
        var blob = item.file.slice(0, item.file.size, item.file.style); 
        item.file= blob;
        nameTd.childNodes[0].childNodes[1].innerHTML = text;
    }
    item.getName = function()
    {
        return item.file.name;
    }
    return item;
}

UploadEditor.prototype.formatDateTime = function(date)
{
    var tempString="";
    tempString+=date.getFullYear();

    if((date.getMonth()-date.getMonth()%10)/10 == 0)
    tempString+="0"+date.getMonth();
    else
    tempString+=date.getMonth();

    if((date.getDate()-date.getDate()%10)/10 == 0)
    tempString+="0"+date.getDate();
    else
    tempString+=date.getDate();

    if((date.getHours()-date.getHours()%10)/10 == 0)
    tempString+="0"+date.getHours();
    else
    tempString+=date.getHours();

    if((date.getMinutes()-date.getMinutes()%10)/10 == 0)
    tempString+="0"+date.getMinutes();
    else
    tempString+=date.getMinutes();
    return tempString;
}

UploadEditor.prototype.formatDate = function(date)
{
    var tempString="";
    tempString+=date.getDate()+"/";

    if((date.getMonth()-date.getMonth()%10)/10 == 0)
    tempString+="0"+date.getMonth()+"/";
    else
    tempString+=date.getMonth()+"/";

    tempString+=date.getFullYear();
    return tempString;
}

UploadEditor.prototype.Download = function(url)
{
    var file = url;
    var fr = new FileReader();
        fr.readAsDataURL(file);

        var blob = new Blob([file], { type: "application/pdf" });

        var objectURL = window.URL.createObjectURL(blob);
        console.log(objectURL);

        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            window.navigator.msSaveOrOpenBlob(blob, url.name);
        } else {
            var link = document.createElement('a');
            link.href = objectURL;
            link.download = url.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
    }
}

UploadEditor.prototype.formatHour = function(date)
{
    var tempString="";
    tempString+=date.getHours()%12+":";
    if((date.getMinutes()-date.getMinutes()%10)/10 == 0)
    tempString+="0"+date.getMinutes();
    else
    tempString+=date.getMinutes();
    if((date.getHours()-date.getHours()%12)/12==1)
    tempString+=" PM";
    else
    tempString+=" AM";
    return tempString;
}

UploadEditor.prototype.uploadFile = function(files, i) {
    var self=this;
    return new Promise(function(resolve,reject){
        self.updateProgress((i+1)/files.length*100);
        resolve(files[i])
    })  
}

UploadEditor.prototype.updateProgress = function(percent) {
    var self=this;
    self.progressBar.setAttribute("value",percent);

    self.detailFiles.innerHTML = "Uploaded files: "+self.detailFiles.total*percent+" of "+self.detailFiles.total;
    self.sizeFiles.innerHTML = "("+self.sizeFiles.total*percent+" KB of "+self.sizeFiles.total+" KB)";
    if(percent==100)
    {
        this.startup.innerHTML="Đã tải xong";
        this.processContainer.display="block";
    };
};

UploadEditor.prototype.previewFile = function(file)
{
    this.$tableList.addChildElement(this.elementItem(file));
}

UploadEditor.prototype.blobToFile = function(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export default UploadEditor; 