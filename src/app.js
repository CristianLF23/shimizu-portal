import {chapters,works,whatsappNumber} from './content.js?v=4.7';
import {WindSystem,motionConfig} from './wind.js?v=4.7';
import {initAtelier} from './atelier.js?v=4.7';

const $=s=>document.querySelector(s);
export const wind=new WindSystem($('.scene'));
const scroller=$('#experience');
const sequence=$('.portal-sequence'),camera=$('.scene-camera');
const sections=[$('#inicio'),...chapters.map(c=>document.getElementById(c.id))];
let geometry=[],portalStart=0,portalTravel=1,queued=false,workIndex=0,menuOpen=false;
let atelier;
const clamp=v=>Math.max(0,Math.min(1,v));
const motionButton=$('#motion-toggle');
const menu=$('#chapter-index'),menuButton=$('.index-toggle');

function measure(){
 const previousHeight=portalTravel,previousIndex=Math.round(scroller.scrollTop/previousHeight);
 portalStart=sequence.offsetTop;portalTravel=Math.max(1,sequence.offsetHeight);
 geometry=sections.map(s=>s.offsetTop);
 if(previousHeight>1&&Math.abs(previousHeight-portalTravel)>1)scroller.scrollTo({top:geometry[Math.min(previousIndex,sections.length-1)],behavior:'instant'});
 wind.mount();
 requestPaint();
}
function paint(){
 queued=false;
 const y=scroller.scrollTop,p=clamp((y-portalStart)/portalTravel);
 const active=Math.max(0,Math.min(sections.length-1,Math.round(y/portalTravel)));
 wind.setRegion(active);wind.progress=p*.25;
 document.body.dataset.chapter=sections[active].id;
 atelier?.onChapter(active,p);
 document.documentElement.classList.toggle('reduced-motion',wind.reduced.matches);
 camera.style.transform=wind.reduced.matches||wind.paused?'':'translate3d(0,'+(-p*2).toFixed(2)+'%,0) scale('+(1+p*motionConfig.portalZoom).toFixed(3)+')';
 sequence.dataset.progress=p.toFixed(3);
 document.querySelectorAll('.desktop-nav a,.chapter-rail a').forEach(a=>{if(a.hash==='#'+sections[active].id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
function requestPaint(){if(!queued){queued=true;requestAnimationFrame(paint);}}
let settleTimer,pointerDown=false;
function settle(){
 if(pointerDown||menuOpen||!geometry.length)return;
 const nearest=geometry.reduce((a,b)=>Math.abs(b-scroller.scrollTop)<Math.abs(a-scroller.scrollTop)?b:a);
 if(Math.abs(scroller.scrollTop-nearest)>1)scroller.scrollTo({top:nearest,behavior:wind.reduced.matches?'instant':'smooth'});
}
scroller.addEventListener('scroll',()=>{requestPaint();clearTimeout(settleTimer);settleTimer=setTimeout(settle,220);},{passive:true});
scroller.addEventListener('scrollend',settle);
scroller.addEventListener('pointerdown',()=>{pointerDown=true;},{passive:true});
addEventListener('pointerup',()=>{pointerDown=false;clearTimeout(settleTimer);settleTimer=setTimeout(settle,220);},{passive:true});
addEventListener('pointercancel',()=>{pointerDown=false;},{passive:true});
function navigate(section,instant=false){scroller.scrollTo({top:section.offsetTop,behavior:instant||wind.reduced.matches?'instant':'smooth'});}
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href^="#"]');if(!link)return;
 const section=sections.find(s=>'#'+s.id===link.hash);if(!section)return;
 e.preventDefault();if(menuOpen)closeMenu(false);
 history.pushState(null,'',link.hash);navigate(section);section.setAttribute('tabindex','-1');section.focus({preventScroll:true});
});
function restoreHash(){const section=sections.find(s=>'#'+s.id===location.hash);if(section)navigate(section,true);}
addEventListener('popstate',restoreHash);addEventListener('hashchange',restoreHash);
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{measure();},100);},{passive:true});
const observer=new ResizeObserver(measure);observer.observe(scroller);
document.fonts.ready.then(measure);
addEventListener('load',measure,{once:true});

const backdrop=$('#menu-backdrop');let menuCloseTimer;
function finishMenuClose(){if(!menuOpen){menu.hidden=true;backdrop.hidden=true;}}
function closeMenu(restore=true){
 menuOpen=false;menu.inert=true;menu.setAttribute('aria-hidden','true');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');
 document.body.classList.remove('menu-open');atelier?.sync();$('.desktop-nav').inert=false;scroller.inert=false;$('.site-footer').inert=false;$('#whatsapp-floating').inert=false;
 clearTimeout(menuCloseTimer);if(wind.reduced.matches)finishMenuClose();else menuCloseTimer=setTimeout(finishMenuClose,380);
 if(restore)menuButton.focus({preventScroll:true});
}
menu.addEventListener('transitionend',e=>{if(e.target===menu&&e.propertyName==='transform')finishMenuClose();});
backdrop.addEventListener('click',()=>closeMenu());
menuButton.addEventListener('click',()=>{if(menuOpen){closeMenu();return;}menuOpen=true;clearTimeout(menuCloseTimer);menu.hidden=false;backdrop.hidden=false;menu.inert=false;menu.removeAttribute('aria-hidden');menu.getBoundingClientRect();menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Fechar menu');document.body.classList.add('menu-open');atelier?.sync();$('.desktop-nav').inert=true;$('#experience').inert=true;$('.site-footer').inert=true;$('#whatsapp-floating').inert=true;menu.querySelector('a').focus({preventScroll:true});});
menu.addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;closeMenu(false);const section=document.querySelector(link.hash);if(section){section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}});
document.addEventListener('keydown',e=>{
 if(menuOpen&&e.key==='Escape'){e.preventDefault();closeMenu();}
 if(menuOpen&&e.key==='Tab'){const focusables=[menuButton,...menu.querySelectorAll('a,button')],i=focusables.indexOf(document.activeElement);if((e.shiftKey&&i<=0)||(!e.shiftKey&&i===focusables.length-1)){e.preventDefault();focusables[e.shiftKey?focusables.length-1:0].focus();}}
 if($('#art-viewer').open||menuOpen||e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 const keys=['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '];
 if(!keys.includes(e.key)||(e.key===' '&&e.target.closest('a,button')))return;
 e.preventDefault();const current=Math.round(scroller.scrollTop/portalTravel);
 const index=e.key==='Home'?0:e.key==='End'?sections.length-1:current+(['PageUp','ArrowUp'].includes(e.key)||e.key===' '&&e.shiftKey?-1:1);
 navigate(sections[Math.max(0,Math.min(sections.length-1,index))]);
});
function updateMotion(){atelier?.sync();const off=wind.paused||wind.reduced.matches;motionButton.textContent=wind.reduced.matches?'MOVIMENTO REDUZIDO':off?'ATIVAR MOVIMENTO':'PAUSAR MOVIMENTO';motionButton.setAttribute('aria-pressed',String(off));motionButton.setAttribute('aria-label',wind.reduced.matches?'Movimento reduzido pelo dispositivo':off?'Ativar movimento':'Pausar movimento');document.documentElement.classList.toggle('reduced-motion',wind.reduced.matches);measure();}
motionButton.addEventListener('click',()=>{if(!wind.reduced.matches)wind.toggle();updateMotion();});wind.onChange=updateMotion;

function showWork(index){
 workIndex=(index+works.length)%works.length;const w=works[workIndex],img=$('#work-image');
 img.src='assets/art/'+w.image+'.webp';img.alt=w.alt;
 img.style.objectPosition=w.position;
 $('.work-count').textContent=String(workIndex+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0');
 $('.work-title').textContent=w.title;
 $('.work-name').textContent=w.title;$('.work-detail').textContent=w.detail;
 atelier?.onWork(workIndex);
 document.querySelectorAll('[data-work-select]').forEach(b=>{if(Number(b.dataset.workSelect)===workIndex)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
 if(!atelier&&!wind.reduced.matches&&!wind.paused)img.animate([{opacity:.5,transform:'translateX(7px)'},{opacity:1,transform:'none'}],{duration:180,easing:'ease-out'});
 const selected=document.querySelector('[data-work-select="'+workIndex+'"]'),strip=$('.work-fragments');strip.scrollTo({left:selected.offsetLeft-strip.clientWidth/2+selected.clientWidth/2,behavior:wind.reduced.matches||wind.paused?'instant':'smooth'});
 $('#page-status').textContent='Trabalho '+(workIndex+1)+' de '+works.length+': '+w.title;
}
document.querySelectorAll('[data-work]').forEach(b=>b.addEventListener('click',()=>showWork(workIndex+Number(b.dataset.work))));
document.querySelectorAll('[data-work-select]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();showWork(Number(b.dataset.workSelect));if(innerWidth<=600&&$('.work-hero').getBoundingClientRect().bottom<100)$('#trabalhos').scrollIntoView({behavior:wind.reduced.matches?'instant':'smooth',block:'start'});}));
$('#trabalhos').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showWork(workIndex+(e.key==='ArrowRight'?1:-1));}});
let touchX=0,touchY=0;
$('.work-hero').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY;},{passive:true});
$('.work-hero').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.6)showWork(workIndex+(dx<0?1:-1));},{passive:true});
const designs=$('.available-gallery'),designNext=$('#available-next');
function changeDesignGroup(){const next=Math.round(designs.scrollLeft/designs.clientWidth)===0?1:0;designs.scrollTo({left:next*designs.clientWidth,behavior:wind.reduced.matches||wind.paused?'instant':'smooth'});}
designNext.addEventListener('click',changeDesignGroup);
designs.addEventListener('keydown',e=>{if(e.target!==designs)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();changeDesignGroup();}});
designs.addEventListener('scroll',()=>{const second=designs.scrollLeft>designs.clientWidth*.5;designNext.firstChild.textContent=second?'VER PRIMEIROS DISPONÍVEIS':'VER OUTROS DISPONÍVEIS';designNext.setAttribute('aria-label',second?'Ver primeiro conjunto de estudos':'Ver segundo conjunto de estudos');},{passive:true});
const whatsapp=$('#whatsapp-contact');
if(/^\d{10,15}$/.test(whatsappNumber)){
 whatsapp.href='https://wa.me/'+whatsappNumber+'?text='+encodeURIComponent('Olá, Shimizu! Gostaria de conversar sobre uma tatuagem.');whatsapp.hidden=false;
}
atelier=initAtelier({wind,scroller,getWorkIndex:()=>workIndex,showWork});
export {atelier};
updateMotion();measure();restoreHash();

