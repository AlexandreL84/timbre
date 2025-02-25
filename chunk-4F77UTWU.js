import{A as ue,B as fe,C as de,D as ge,E as xe,F as he,G as _,a as Q,ba as ve,c as U,ca as _e,d as Z,da as ye,e as J,ea as we,f as K,fa as Le,g as X,ga as Me,h as ee,ha as be,ia as Ee,j as te,ja as Se,k as ie,ka as Fe,l as oe,n as re,o as ne,p as ae,q as me,r as se,v as le,y as pe,z as ce}from"./chunk-JTRB7IF6.js";import{Ab as v,Bb as B,Ga as d,Gc as Y,Ka as n,N as D,T as I,Ta as m,Tb as j,U as V,Ua as s,V as N,Va as f,Vb as z,Xc as F,Y as A,Yb as G,Z as c,Za as $,Zb as H,_ as u,_c as Ce,ab as M,cb as l,e as w,gc as q,hb as O,ib as P,ic as W,jb as R,mb as g,nb as x,pa as k,qb as b,ra as a,rb as E,sa as L,sb as S,tb as T,zb as h}from"./chunk-W6KRSCOZ.js";import"./chunk-65CH3ZW6.js";import"./chunk-GV7GV3NK.js";var y=class r{format;valueOfRegex;_onChange;validate(t){let e=!1,o="Format inconnu";if(F(t.value)||t.value==""||F(this.format)||this.format=="")return null;switch(this.format){case"date":Ce.isTypeDate(t.value)?e=!0:e=/(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/.test(t.value),o="Le format de cette date est incorrect, format attendu : DD/MM/YYYY";break;case"alfa_numeric":e=/^[a-zA-Z0-9-]*$/.test(t.value),o="Le format est incorrect, format attendu : valeur alphanum\xE9rique";break;case"numeric":e=/^[[0-9]|[-][0-9]*$/.test(t.value),o="Le format est incorrect, format attendu : valeur num\xE9rique";break;case"entier":e=/^[0-9]*$/.test(t.value),o="Le format est incorrect, format attendu : valeur entier";break;case"pourcent":e=/^[0-9]$|^[1-9][0-9]$|^(100)$/.test(t.value),o="Le format est incorrect, format attendu : pourcentage";break;case"phone":e=/^[0]{1}[0-9]{9}$/.test(t.value),o="Le format de ce num\xE9ro de t\xE9l\xE9phone est incorrect";break;case"phoneFixe":e=/^[0]{1}[1-5|8|9]{1}[0-9]{8}$/.test(t.value),o="Le format est incorrect";break;case"phoneMobile":e=/^[0]{1}[6|7]{1}[0-9]{8}$/.test(t.value),o="Le format est incorrect";break;case"mail":e=/^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,}$/.test(t.value),o="Le format du mail est incorrect";break}return e?null:{format:{message:o}}}registerOnValidatorChange(t){this._onChange=t}ngOnChanges(t){"valueOfRegex"in t&&this._onChange&&this._onChange()}static \u0275fac=function(e){return new(e||r)};static \u0275dir=N({type:r,selectors:[["","format","","formControlName",""],["","format","","formControl",""],["","format","","ngModel",""]],inputs:{format:"format",valueOfRegex:"valueOfRegex"},features:[T([{provide:oe,useExisting:r,multi:!0}]),A]})};var Ne=["formLogin"];function Ae(r,t){r&1&&f(0,"lib-spinner",6),r&2&&n("textSpec","Redirection en cours ...")("classSpinner","primary")}function ke(r,t){if(r&1&&(f(0,"mat-error",19),h(1,"async")),r&2){let e=l(2);n("innerHTML",v(1,1,e.messageError$),k)}}function $e(r,t){if(r&1){let e=$();m(0,"div",7)(1,"form",8,1),M("ngSubmit",function(){c(e);let i=l();return u(i.onSignIn())}),d(3,ke,2,3,"mat-error",9),h(4,"async"),m(5,"div",10)(6,"div",11)(7,"label"),x(8," Email "),s(),m(9,"input",12),S("ngModelChange",function(i){c(e);let p=l();return E(p.email,i)||(p.email=i),u(i)}),s()(),m(10,"div",11)(11,"label"),x(12," Mot de passe "),s(),m(13,"div",13)(14,"input",14,2),S("ngModelChange",function(i){c(e);let p=l();return E(p.password,i)||(p.password=i),u(i)}),s(),m(16,"lib-icon",15),M("click",function(){c(e);let i=l();return u(i.showPassword())}),s()(),f(17,"app-control-error",16),s()(),m(18,"div",17)(19,"button",18),x(20," Enregistrer "),s()()()()}if(r&2){let e=g(2),o=g(15),i=l();a(),n("ngClass",e!=null&&e.submitted?"red-color":"blue-color"),a(2),n("ngIf",v(4,8,i.messageError$)),a(6),b("ngModel",i.email),a(5),n("type",i.showPswd?"text":"password"),b("ngModel",i.password),a(2),n("classIcone","primary")("icone",i.showPswd?i.FontAwesomeEnum.EYE_SLASH:i.FontAwesomeEnum.EYE),a(),n("control",o)}}var C=class r{constructor(t,e){this.authService=t;this.router=e}formLogin;redirection$=new w(null);messageError$=new w(null);email;password;showPswd=!1;FontAwesomeEnum=ge;onSignIn(){this.messageError$.next(null),this.redirection$.next(null),this.formLogin?.valid&&this.authService.signIn(this.email,this.password).then(t=>{console.log("ok"),this.router.navigate(["/pays"]),this.redirection$.next(!0)}).catch(t=>{console.log(t),this.messageError$.next("Email ou mot de pase incorrect")})}showPassword(){this.showPswd=!this.showPswd}static \u0275fac=function(e){return new(e||r)(L(Y),L(q))};static \u0275cmp=I({type:r,selectors:[["app-login"]],viewQuery:function(e,o){if(e&1&&O(Ne,5),e&2){let i;P(i=R())&&(o.formLogin=i.first)}},decls:6,vars:5,consts:[["load",""],["formLogin","ngForm"],["passwordModel","ngModel"],["fxLayout","column","fxLayoutGap","20px"],[3,"titre"],[3,"ngIf","ngIfElse"],["fxFlexFill","",3,"textSpec","classSpinner"],["fxFlexFill","","fxLayout","column","fxLayoutAlign","center center","fxFlexOffset","40px"],["ngForm","formLogin","fxLayoutGap","20px","fxFlex","100","fxLayout","column","fxLayoutAlign","space-between stretch",1,"formulaire-box-elevation","height100",3,"ngSubmit","ngClass"],[3,"innerHTML",4,"ngIf"],["fxLayout","column","fxLayoutGap","30px"],["fxLayout","column",1,"form-input"],["name","email","type","text","format","mail","required","","zControl","",2,"max-width","400px","width","100%",3,"ngModelChange","ngModel"],["fxLayout","row","fxLayoutAlign","start center"],["name","password","required","",2,"max-width","400px","width","100%",3,"ngModelChange","type","ngModel"],["noEspace","",1,"eyeMdp","click",3,"click","classIcone","icone"],[3,"control"],["fxLayout","row","fxLayoutGap","10px","fxLayoutAlign","center end"],["type","submit","mat-raised-button","","color","accent",1,"rounded","large","color-white"],[3,"innerHTML"]],template:function(e,o){if(e&1&&(m(0,"div",3),f(1,"app-header",4),d(2,Ae,1,2,"ng-template",5),h(3,"async"),d(4,$e,21,10,"ng-template",null,0,B),s()),e&2){let i=g(5);a(),n("titre","Connexion"),a(),n("ngIf",v(3,3,o.redirection$)==!0)("ngIfElse",i)}},dependencies:[j,z,U,Z,ee,K,X,J,Q,se,ie,re,ne,le,me,ae,xe,ye,y,Le,_,he,Me,we,_e,G],styles:[".eyeMdp[_ngcontent-%COMP%]{width:20px!important;margin:0 0 0 -30px!important;z-index:1}"]})};var Oe=[{path:"",component:C}],Ie=class r{static \u0275fac=function(e){return new(e||r)};static \u0275mod=V({type:r});static \u0275inj=D({imports:[H,W.forChild(Oe),te,pe,ue,fe,de,ce,Ee,_,Fe,Se,be,ve]})};export{Ie as AuthentificationModule};
