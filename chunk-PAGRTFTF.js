import{a as Ce,b as R,c as we,d as Ee,e as De,f as Le,k as Fe}from"./chunk-U3ZSWC23.js";import{g as Ae}from"./chunk-W3XNXTU3.js";import{a as xe,d as Te,e as Ie,h as Se}from"./chunk-LMRVNFCC.js";import{A as h,Aa as X,Ab as se,Ca as ee,Db as ae,Fa as te,Gb as me,Hb as ce,I as z,Ib as de,Jb as ue,K as c,Kb as pe,L as _,Lb as be,Mb as ge,Nb as fe,Ob as he,Pb as Me,Q as T,Qb as Be,R as d,W as a,X as u,Y as x,aa as H,ab as n,ba as C,c as M,ca as g,ea as P,f as y,fa as Q,fb as p,g as Z,ga as G,gb as j,gc as ve,ha as w,hb as q,hc as ye,ia as I,ja as K,jc as _e,ka as Y,l as b,ma as E,na as D,oa as L,ob as N,p as A,s as B,sb as ie,u as $,ua as F,va as O,vb as re,wa as J,wb as oe,xb as ne,z as f,zb as le}from"./chunk-EDS3JHJR.js";import{i as m}from"./chunk-GV7GV3NK.js";var s=class extends j{id;annee;monnaie;image;imageTable;imageZoom;timbreBlocAcquisModel;constructor(e,t,i,r,l,W,k){super(),this.id=e||null,this.annee=t||null,this.monnaie=i||null,this.image=r||null,this.imageTable=l||null,this.imageZoom=W||null,this.timbreBlocAcquisModel=k||null}getId(){return this.id}setId(e){this.id=e}getAnnee(){return this.annee}setAnnee(e){this.annee=e}getMonnaie(){return this.monnaie}setMonnaie(e){this.monnaie=e}getImage(){return this.image}setImage(e){this.image=e}getImageTable(){return this.imageTable}setImageTable(e){this.imageTable=e}getImageZoom(){return this.imageZoom}setImageZoom(e){this.imageZoom=e}getTimbreBlocAcquisModel(){return this.timbreBlocAcquisModel}setTimbreBlocAcquisModel(e){this.timbreBlocAcquisModel=e}};m([p("Identifiant")],s.prototype,"id",2),m([p("Ann\xE9e")],s.prototype,"annee",2),m([p("Monnaie")],s.prototype,"monnaie",2),m([p("Image")],s.prototype,"image",2),m([p("Image tableau")],s.prototype,"imageTable",2),m([p("Image zoom")],s.prototype,"imageZoom",2),m([p("v\xE9rif")],s.prototype,"timbreBlocAcquisModel",2);var U=class o{constructor(e,t,i){this.firestore=e;this.uploadService=t;this.utilsService=i}heigthTable=50;widthTimbre=100;heightTimbre=100;widthTimbreZoom=500;heightTimbreZoom=500;total$=new M(0);timbresBlocModel$=new M(null);upload(e,t){let i=this.widthTimbre,r=this.heightTimbre;return t=="table"?(i=i*(this.heigthTable/r),r=this.heigthTable):t=="zoom"&&(i=i*(this.heightTimbreZoom/r),r=this.heightTimbreZoom),this.uploadService.processAndUploadImage(e?.getImage(),i,r,"bloc",this.getDossier(e,t))}getTotal(e){this.total$.next(null),this.getAllBlocs(e).pipe(b()).subscribe(t=>{this.total$.next(t?.length)})}getBlocByIdAsync(e){return this.getTotal(),this.firestore.collection("/timbres_bloc",t=>t.where("id","==",e)).valueChanges().pipe(y(t=>q(s,t[0])))}getAllBlocs(e){return this.firestore.collection("/timbres_bloc",t=>{let i=t;return n(e)&&n(e.getAnnees())&&e.getAnnees()?.length>0&&(i=i.where("annee","in",e.getAnnees())),i}).valueChanges()}getBlocsAsync(e){return this.timbresBlocModel$.next(null),this.getAllBlocs(e).pipe(b(),y(t=>this.constructBlocs(t)))}constructBlocs(e){let t=[];return e?.length>0&&e.forEach(i=>{let r=q(s,i);t.push(r)}),this.timbresBlocModel$.next(t),t}ajouterSansId(e){this.utilsService.getMaxIdentAsync("/timbres_bloc").pipe(b()).subscribe(t=>{e.setId(t),this.ajouter(e)})}ajouter(e){this.firestore.collection("/timbres_bloc").add(Object.assign(new Object,e)),this.getBlocsAsync().pipe(b()).subscribe(t=>{})}modifier(e){this.firestore.collection("/timbres_bloc").ref.where("id","==",e.getId()).get().then(t=>{t.forEach(i=>{i.ref.update(Object.assign(new Object,e)),this.getBlocsAsync().pipe(b()).subscribe(r=>{})})}).catch(t=>{console.error("Erreur de mise \xE0 jour:",t)})}supprimer(e){this.firestore.collection("/timbres_bloc").ref.where("id","==",e.getId()).get().then(t=>{t.forEach(i=>{i.ref.delete(),this.getBlocsAsync().pipe(b()).subscribe(r=>{})})}).catch(t=>{console.error("Erreur de suppression :",t)})}getDossier(e,t){let i="timbre//"+e.getAnnee();return n(t)&&(i=i+"/"+t),i=i+"/bloc/"+e.getId(),i}getBouchon(){let e=new s;return e.setAnnee(new Date().getFullYear()),e.setMonnaie("E"),e}static \u0275fac=function(t){return new(t||o)(B(N),B(Ce),B(R))};static \u0275prov=A({token:o,factory:o.\u0275fac})};var je=class o{constructor(e){this.firestore=e}getAnneesAsync(e){return this.firestore.collection(e,t=>{let i=t;return i=i.orderBy("annee","desc"),i}).valueChanges().pipe(y(t=>{let i=t.map(r=>Number(r.annee)).filter(r=>n(r)&&r!=0);return Array.from(new Set(i))}))}static \u0275fac=function(t){return new(t||o)(B(N))};static \u0275prov=A({token:o,factory:o.\u0275fac})};var V=class{dossier;nom;alignLabel;detail;file;getDossier(){return this.dossier}setDossier(e){this.dossier=e}getNom(){return this.nom}setNom(e){this.nom=e}getAlignLabel(){return this.alignLabel}setAlignLabel(e){this.alignLabel=e}getDetail(){return this.detail}setDetail(e){this.detail=e}getFile(){return this.file}setFile(e){this.file=e}};var S=class{key;dossier;maxWidth;maxHeight;getKey(){return this.key}setKey(e){this.key=e}getDossier(){return this.dossier}setDossier(e){this.dossier=e}getMaxWidth(){return this.maxWidth}setMaxWidth(e){this.maxWidth=e}getMaxHeight(){return this.maxHeight}setMaxHeight(e){this.maxHeight=e}};var We=["canvas"];function ke(o,e){o&1&&x(0,"lib-spinner",5),o&2&&d("textSpec","Chargement en cours ...")}function Ze(o,e){if(o&1&&(x(0,"mat-error",18),F(1,"async")),o&2){let t=g(2);d("innerHTML",O(1,1,t.messageError$),z)}}function $e(o,e){if(o&1){let t=H();a(0,"div",10)(1,"label"),x(2,"lib-libelle-model",11),u(),a(3,"input",19),L("ngModelChange",function(r){f(t);let l=g(2);return D(l.timbreBlocModel.id,r)||(l.timbreBlocModel.id=r),h(r)}),u()()}if(o&2){let t=g(2);c(2),d("object",t.timbreBlocModel)("key","id"),c(),E("ngModel",t.timbreBlocModel.id),d("disabled",!!(t.timbreBlocModel!=null&&t.timbreBlocModel.getId()))}}function ze(o,e){if(o&1){let t=H();a(0,"form",6,1),C("ngSubmit",function(){f(t);let r=w(1),l=g();return h(l.valider(r))}),a(2,"div",7),T(3,Ze,2,3,"mat-error",8),F(4,"async"),T(5,$e,4,4,"div",9),a(6,"div",10)(7,"label"),x(8,"lib-libelle-model",11),u(),a(9,"input",12),L("ngModelChange",function(r){f(t);let l=g();return D(l.timbreBlocModel.annee,r)||(l.timbreBlocModel.annee=r),h(r)}),u()(),a(10,"div",10)(11,"label"),x(12,"lib-libelle-model",11),u(),a(13,"input",13),L("ngModelChange",function(r){f(t);let l=g();return D(l.timbreBlocModel.monnaie,r)||(l.timbreBlocModel.monnaie=r),h(r)}),u()(),a(14,"lib-upload",14),C("outPutObject",function(r){f(t);let l=g();return h(l.timbreBlocModel=r)}),u()(),a(15,"div",15)(16,"button",16),C("click",function(){f(t);let r=g();return h(r.close())}),I(17," Annuler "),u(),a(18,"button",17),I(19," Enregistrer "),u()()()}if(o&2){let t=w(1),i=g();d("ngClass",t!=null&&t.submitted?"red-color":"blue-color"),c(3),d("ngIf",O(4,15,i.messageError$)),c(2),d("ngIf",i.timbreBlocModel==null?null:i.timbreBlocModel.getId()),c(3),d("object",i.timbreBlocModel)("key","annee"),c(),E("ngModel",i.timbreBlocModel.annee),d("max",i.maxAnnee)("zMax",i.maxAnnee),c(3),d("object",i.timbreBlocModel)("key","monnaie"),c(),E("ngModel",i.timbreBlocModel.monnaie),c(),d("object",i.timbreBlocModel)("key","image")("maxWidth",i.timbreBlocService.widthTimbre)("maxHeight",i.timbreBlocService.heightTimbre)}}var Ne=class o{constructor(e,t,i,r){this.httpResponseHandlerService=e;this.dialogRef=t;this.utilsService=i;this.timbreBlocService=r}canvas;messageError$=new M(null);load$=new M(null);id;maxAnnee=new Date().getFullYear();timbreBlocModel=new s;fileUploadModel=new V;ngOnInit(){this.initUpload(),this.load$.next(!1),n(this.id)?this.timbreBlocService.getBlocByIdAsync(this.id).subscribe(e=>{this.timbreBlocModel=e,this.load$.next(!0)}):(this.timbreBlocModel.setAnnee(new Date().getFullYear()),this.timbreBlocModel.setMonnaie("E"),this.load$.next(!0))}initUpload(){this.fileUploadModel.setDossier("test"),this.fileUploadModel.setNom(new Date().getTime()?.toString());let e=new S;e.setMaxWidth(this.timbreBlocService.widthTimbre),e.setMaxHeight(this.timbreBlocService.heightTimbre),e.setDossier("autre");let t=new S;t.setMaxWidth(this.timbreBlocService.widthTimbreZoom),t.setMaxHeight(this.timbreBlocService.heightTimbreZoom),t.setDossier("zoom"),this.fileUploadModel.setDetail([e,t])}valider(e){if(this.messageError$.next(null),e?.valid)if(n(this.timbreBlocModel.getImage()))this.saveData();else{this.messageError$.next("Veuillez s\xE9lectionner une image");return}}saveData(){this.load$.next(!1),n(this.timbreBlocModel.getId())?this.save():this.ajouter()}ajouter(){this.utilsService.getMaxIdentAsync("/timbres_bloc").pipe(b()).subscribe(e=>{this.timbreBlocModel.setId(e),this.save(!0)})}save(e){try{Z([this.timbreBlocService.upload(this.timbreBlocModel,"autre"),this.timbreBlocService.upload(this.timbreBlocModel,"table"),this.timbreBlocService.upload(this.timbreBlocModel,"zoom")]).pipe(b(([t,i,r])=>n(t)&&n(r)&&n(i))).subscribe(([t,i,r])=>{n(i)&&i!="nok"&&this.timbreBlocModel.setImage(i),n(t)&&t!="nok"&&this.timbreBlocModel.setImageTable(t),n(r)&&r!="nok"&&this.timbreBlocModel.setImageZoom(r),e?this.timbreBlocService.ajouter(this.timbreBlocModel):this.timbreBlocService.modifier(this.timbreBlocModel),this.httpResponseHandlerService.showNotificationSuccess("Transaction termin\xE9e","Votre timbre a bien \xE9t\xE9 modifi\xE9e."),this.load$.next(!0),this.dialogRef.close()})}catch{this.httpResponseHandlerService.showNotificationError("Transaction non aboutie","Votre timbre n'a pas pu \xEAtre modifi\xE9."),this.load$.next(!0)}}close(){this.dialogRef.close()}static \u0275fac=function(t){return new(t||o)(_(Ae),_(_e),_(R),_(U))};static \u0275cmp=$({type:o,selectors:[["app-timbre-modifier-bloc"]],viewQuery:function(t,i){if(t&1&&P(We,5),t&2){let r;Q(r=G())&&(i.canvas=r.first)}},decls:10,vars:6,consts:[["load",""],["formModif","ngForm"],["fxFlexFill","","fxLayout","column","fxLayoutAlign","space-between stretch",1,"dialog-modal"],["fxLayout","row","fxLayoutGap","5px","fxLayoutAlign","start center",1,"titre-modal","bg-primary","color-white"],[3,"ngIf","ngIfElse"],["fxFlexFill","",3,"textSpec"],["ngForm","formModif","fxLayoutGap","20px","fxFlex","100","fxLayout","column","fxLayoutAlign","space-between stretch",1,"formulaire-box-elevation",3,"ngSubmit","ngClass"],["fxLayout","column","fxLayoutGap","20px",1,"bloc-modal"],[3,"innerHTML",4,"ngIf"],["fxLayout","column","class","form-input",4,"ngIf"],["fxLayout","column",1,"form-input"],[3,"object","key"],["name","page","type","number","minlength","4","maxlength","4","min","1900","zMin","1900","required","","zControl","",1,"annee",2,"width","60px !important",3,"ngModelChange","ngModel","max","zMax"],["name","monnaie","type","text","trim","","minlength","1","maxlength","2","required","","zControl","",2,"width","25px !important",3,"ngModelChange","ngModel"],[3,"outPutObject","object","key","maxWidth","maxHeight"],["fxLayout","row","fxLayoutGap","10px","fxLayoutAlign","end end",1,"bloc-bouton-modal"],["type","button","mat-raised-button","","color","primary",1,"rounded","large","color-white",3,"click"],["type","submit","mat-raised-button","","color","accent",1,"rounded","large","color-white"],[3,"innerHTML"],["name","code","type","text","trim","","upperCase","","noEspace","","required","","zControl","",3,"ngModelChange","ngModel","disabled"]],template:function(t,i){if(t&1&&(a(0,"div",2)(1,"div",3)(2,"span"),I(3),u(),a(4,"span"),I(5),u()(),T(6,ke,1,1,"ng-template",4),F(7,"async"),T(8,ze,20,17,"ng-template",null,0,J),u()),t&2){let r=w(9);c(3),Y("",i.timbreBlocModel!=null&&i.timbreBlocModel.getId()?"MODIFICATION":"AJOUT"," BLOC "),c(2),K(i.timbreBlocModel==null?null:i.timbreBlocModel.getId()),c(),d("ngIf",O(7,4,i.load$)==!1)("ngIfElse",r)}},dependencies:[ye,ve,X,ee,re,oe,se,le,ne,ie,pe,ae,be,me,ce,he,Me,Be,fe,ge,ue,de,Se,Ie,xe,Te,we,Ee,De,Fe,Le,te],encapsulation:2})};var v=class extends j{annees;acquis;doublon;bloc;getAnnees(){return this.annees}setAnnees(e){this.annees=e}getAcquis(){return this.acquis}setAcquis(e){this.acquis=e}getDoublon(){return this.doublon}setDoublon(e){this.doublon=e}getBloc(){return this.bloc}setBloc(e){this.bloc=e}};m([p("Ann\xE9e")],v.prototype,"annees",2),m([p("Acquis")],v.prototype,"acquis",2),m([p("Doublon")],v.prototype,"doublon",2),m([p("Bloc")],v.prototype,"bloc",2);export{V as a,S as b,v as c,s as d,U as e,je as f,Ne as g};
