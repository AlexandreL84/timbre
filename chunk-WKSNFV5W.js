import{a as W,b as Y,c as Z}from"./chunk-63NGQDNP.js";import{a as P,c as l,d as q,e as a,g as z,h as J,i as K,j as Q,k as V,l as ee}from"./chunk-2V66HSNH.js";import{c as G,d as k,o as _}from"./chunk-CQLLUQKO.js";import{A as X}from"./chunk-D65VTY3F.js";import{b as j,f as B,g as O}from"./chunk-XX3VSMOT.js";import{b as h}from"./chunk-JT5OSJNC.js";import{Cb as D,Db as U,Eb as R,Ha as T,Ja as C,K as M,L as t,Qa as b,Qc as N,R as y,Sc as H,Tb as $,Ub as w,W as u,X as d,Y as p,Yb as E,bb as v,l as f,q as m,qb as L,rb as g,tb as I,u as S,v as n,xb as x,yb as F,zb as A}from"./chunk-JRN57LZL.js";import"./chunk-65CH3ZW6.js";import"./chunk-GV7GV3NK.js";var s=class i{constructor(r,e,o,oe){this.authService=r;this.headerService=e;this.timbreService=o;this.timbreUtilsService=oe}FontAwesomeTypeEnum=L;FontAwesomeEnum=g;ngOnInit(){this.timbreService.timbres$.next(null),this.headerService.titre$.next("TIMBRES"),this.timbreUtilsService.timbreCritereModel=new P,this.authService.userSelect$.pipe(f(r=>v(r))).subscribe(r=>{this.timbreUtilsService.getAnneesAsync("/timbres").pipe(f(e=>v(e)&&e?.length>0)).subscribe(e=>{this.timbreUtilsService.timbreCritereModel.setAnnees([e[0]]),this.timbreService.getTimbres(this.timbreUtilsService.timbreCritereModel)})})}static \u0275fac=function(e){return new(e||i)(t(h),t(I),t(a),t(l))};static \u0275cmp=S({type:i,selectors:[["app-timbre-layout"]],decls:6,vars:3,consts:[["fxLayout","row","fxLayoutAlign","space-between stretch"],["fxFlex","5"],["fxFlex","","fxLayout","column","fxLayoutGap","20px"],[3,"load$","timbres$","total$"]],template:function(e,o){e&1&&(u(0,"div",0),p(1,"div",1),u(2,"div",2),p(3,"app-menu")(4,"app-timbre-resultat",3),d(),p(5,"div",1),d()),e&2&&(M(4),y("load$",o.timbreService.load$)("timbres$",o.timbreService.timbres$)("total$",o.timbreService.total$))},dependencies:[x,F,D,A,V,K]})};var te=[{path:"",component:s},{path:"importer",component:Q},{path:"resume",component:J}],c=class i{static \u0275fac=function(e){return new(e||i)};static \u0275mod=n({type:i});static \u0275inj=m({imports:[b.forChild(te),b]})};var re=class i{static \u0275fac=function(e){return new(e||i)};static \u0275mod=n({type:i});static \u0275inj=m({providers:[k,l,a,q,z,G,C()],imports:[N,c,T,U,R,$,B,H,Y,O,E,j,W,Z,_,X,ee,w]})};export{re as TimbreModule};
