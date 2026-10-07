import {chapters,works} from './content.js?v=3.0';
import {WindSystem,motionConfig} from './wind.js?v=3.0';

const $=s=>document.querySelector(s);
const wind=new WindSystem($('.scene'));
const sequence=$('.portal-sequence'),camera=$('.scene-camera');
const sections=[$('#inicio'),...chapters.map(c=>document.getElementById(c.id))];
let geometry=[],portalStart=0,portalTravel=1,queued=false,workIndex=2,menuOpen=false;
const clamp=v=>Math.max(0,Math.min(1,v));
const motionButton=$('#motion-toggle');
const menu=$('#chapter-index'),menuButton=$('.index-toggle');

function measure(){
 portalStart=sequence.offsetTop;portalTravel=Math.max(1,sequence.offsetHeight);
 geometry=sections.map(s=>s.offsetTop);
 requestPaint();
}
function paint(){
 queued=false;
 const y=window.scrollY,p=clamp((y-portalStart)/portalTravel);
 let active=0;for(let i=0;i<geometry.length;i++)if(y+$('.masthead').offsetHeight+1>=geometry[i])active=i;
 wind.setRegion(active);wind.progress=p*.25;
 document.body.dataset.chapter=sections[active].id;
 document.documentElement.classList.toggle('reduced-motion',wind.reduced.matches);
 camera.style.transform=wind.reduced.matches||wind.paused?'':'translate3d(0,'+(-p*2).toFixed(2)+'%,0) scale('+(1+p*motionConfig.portalZoom).toFixed(3)+')';
 sequence.dataset.progress=p.toFixed(3);
 document.querySelectorAll('.desktop-nav a').forEach(a=>{if(a.hash==='#'+sections[active].id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
function requestPaint(){if(!queued){queued=true;requestAnimationFrame(paint);}}
addEventListener('scroll',requestPaint,{passive:true});
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{measure();},100);},{passive:true});
const observer=new ResizeObserver(measure);sections.forEach(s=>observer.observe(s));
document.fonts.ready.then(measure);
addEventListener('load',measure,{once:true});

function closeMenu(restore=true){menuOpen=false;menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');document.body.classList.remove('menu-open');$('.desktop-nav').inert=false;$('#experience').inert=false;$('.site-footer').inert=false;if(restore)menuButton.focus({preventScroll:true});}
menuButton.addEventListener('click',()=>{if(menuOpen){closeMenu();return;}menuOpen=true;menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Fechar menu');document.body.classList.add('menu-open');$('.desktop-nav').inert=true;$('#experience').inert=true;$('.site-footer').inert=true;menu.querySelector('a').focus();});
menu.addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;closeMenu(false);const section=document.querySelector(link.hash);if(section){section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}});
document.addEventListener('keydown',e=>{
 if(menuOpen&&e.key==='Escape'){e.preventDefault();closeMenu();}
 if(menuOpen&&e.key==='Tab'){const focusables=[menuButton,...menu.querySelectorAll('a,button')],i=focusables.indexOf(document.activeElement);if((e.shiftKey&&i<=0)||(!e.shiftKey&&i===focusables.length-1)){e.preventDefault();focusables[e.shiftKey?focusables.length-1:0].focus();}}
});
function updateMotion(){const off=wind.paused||wind.reduced.matches;motionButton.textContent=wind.reduced.matches?'MOVIMENTO REDUZIDO':off?'ATIVAR MOVIMENTO':'PAUSAR MOVIMENTO';motionButton.setAttribute('aria-pressed',String(off));motionButton.setAttribute('aria-label',wind.reduced.matches?'Movimento reduzido pelo dispositivo':off?'Ativar movimento':'Pausar movimento');document.documentElement.classList.toggle('reduced-motion',wind.reduced.matches);measure();}
motionButton.addEventListener('click',()=>{if(!wind.reduced.matches)wind.toggle();updateMotion();});wind.onChange=updateMotion;

function showWork(index){
 workIndex=(index+works.length)%works.length;const w=works[workIndex],img=$('#work-image');
 img.src='assets/art/'+w.image+'.webp';img.alt=w.alt;
 const positions=['48% 39%','50% 38%','40% 40%','42% 38%','50% 43%','48% 47%','49% 45%','52% 37%','50% 43%'];img.style.objectPosition=positions[workIndex];
 $('.work-count').textContent=String(workIndex+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0');
 $('.work-title').textContent=w.title;
 document.querySelectorAll('[data-work-select]').forEach(b=>{if(Number(b.dataset.workSelect)===workIndex)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
 if(!wind.reduced.matches&&!wind.paused)img.animate([{opacity:.5,transform:'translateX(7px)'},{opacity:1,transform:'none'}],{duration:180,easing:'ease-out'});
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
updateMotion();measure();

