import {AtelierAtmosphere} from './atmosphere.js?v=4.8';
import {InkCompanion} from './ink.js?v=4.8';
import {works,availableDesigns,whatsappNumber} from './content.js?v=4.8';

const gsap=window.gsap;
export function initAtelier({wind,scroller,getWorkIndex,showWork}){
 const scene=document.querySelector('.scene'),viewer=document.querySelector('#art-viewer');
 const atmosphere=new AtelierAtmosphere(document.querySelector('#water-atmosphere'),scene);
 const ink=new InkCompanion(document.querySelector('#ink-companion'),scroller);
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
 const chapters=[...scroller.children];
 const seen=new Set();let chapter=0,opener=null,pool=[],viewerIndex=0,closing=false;
 const timelines=new Set();
 const enabled=()=>!wind.paused&&!wind.reduced.matches;
 const canMove=()=>enabled()&&!document.hidden&&!viewer.open&&!document.body.classList.contains('menu-open');
 const own=tl=>{timelines.add(tl);tl.eventCallback('onComplete',()=>timelines.delete(tl));return tl;};
 function sync(){
  const active=canMove();
  atmosphere.setEnabled(active&&chapter===0);wind.sync();
  document.documentElement.classList.toggle('atelier-still',!active);
  if(!active){for(const tl of timelines)tl.progress(1).kill();timelines.clear();gsap.set(scene,{'--gaze-x':'0px','--gaze-y':'0px'});}
  ink.setState({active:!document.hidden&&!viewer.open&&!document.body.classList.contains('menu-open'),animate:enabled()});
 }
 function reveal(index){
  const section=chapters[index];
  if(!section||seen.has(index)||!enabled())return;
  seen.add(index);
  const title=index===0?section.querySelectorAll('.quiet-quote>span,.quiet-quote>em'):section.querySelectorAll('.section-heading h2');
  const details=section.querySelectorAll('.section-number,.section-heading>p,.home-kicker,.side-note,.hero-explore,.process-invitation,.available-invitation');
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.fromTo(title,{y:34,opacity:0,rotate:1.2},{y:0,opacity:1,rotate:0,duration:.95,stagger:.1,clearProps:'transform,opacity'},0)
   .fromTo(details,{y:12,opacity:0},{y:0,opacity:1,duration:.65,stagger:.035,clearProps:'transform,opacity'},.18)
   .fromTo(section.querySelectorAll('.fine-rule'),{scaleX:0},{scaleX:1,transformOrigin:'left',duration:.8,clearProps:'transform'},.3);
  if(index===4)tl.fromTo(section.querySelectorAll('.available-group:first-child a'),{opacity:0,y:25},{opacity:1,y:0,duration:.8,stagger:.09,clearProps:'opacity,transform'},.13);
  own(tl);
 }
 function onChapter(index,progress){
  ink.setChapter(index);
  if(index!==chapter){chapter=index;sync();reveal(index);}
  chapters.forEach((s,i)=>s.classList.toggle('chapter-current',i===index));
  document.querySelectorAll('.chapter-rail a').forEach((a,i)=>a.toggleAttribute('data-active',i===index));
  scene.style.setProperty('--passage',Math.min(1,progress));
 }
 function onWork(){
  if(!canMove())return;
  const img=document.querySelector('#work-image');
  gsap.killTweensOf(img);
  own(gsap.timeline().fromTo(img,{clipPath:'inset(0 0 0 100%)',scale:1.04},{clipPath:'inset(0 0 0 0%)',scale:1,duration:.65,ease:'power3.inOut',clearProps:'clipPath,transform'}).fromTo('.work-name,.work-detail',{opacity:0,y:7},{opacity:1,y:0,duration:.4,stagger:.05,clearProps:'transform,opacity'},.2));
 }
 scene.addEventListener('pointermove',e=>{
  if(!canMove()||!finePointer.matches)return;
  const r=scene.getBoundingClientRect();
  gsap.to(scene,{'--gaze-x':((e.clientX-r.left)/r.width-.5)*-12+'px','--gaze-y':((e.clientY-r.top)/r.height-.5)*-8+'px',duration:1.25,ease:'power2.out',overwrite:true});
 },{passive:true});
 scene.addEventListener('pointerleave',()=>gsap.to(scene,{'--gaze-x':'0px','--gaze-y':'0px',duration:1,overwrite:true}));
 scene.addEventListener('pointerdown',e=>{if(!canMove()||e.target.closest('a,button'))return;const r=scene.getBoundingClientRect();atmosphere.burst(e.clientX-r.left,e.clientY-r.top);},{passive:true});
 const ritual=document.querySelector('#wind-ritual');
 ritual.addEventListener('click',()=>{
  if(!enabled()){document.querySelector('#page-status').textContent='O movimento está pausado. Você pode ativá-lo no menu.';return;}
  wind.impulse=4.7;atmosphere.burst(scene.clientWidth*.67,scene.clientHeight*.84);
  gsap.fromTo(ritual.querySelector('.wind-symbol'),{rotate:-12},{rotate:0,duration:1.1,ease:'elastic.out(1,.4)'});
 });
 for(const sheet of document.querySelectorAll('.available-surface a')){
  let box;
  sheet.addEventListener('pointerenter',()=>{box=sheet.getBoundingClientRect();if(canMove()&&finePointer.matches)gsap.to(sheet,{'--lift':'-8px',duration:.35});});
  sheet.addEventListener('pointermove',e=>{if(!box||!canMove()||!finePointer.matches)return;gsap.to(sheet,{'--rx':((e.clientY-box.top)/box.height-.5)*-8+'deg','--ry':((e.clientX-box.left)/box.width-.5)*8+'deg',duration:.35,overwrite:'auto'});},{passive:true});
  sheet.addEventListener('pointerleave',()=>gsap.to(sheet,{'--lift':'0px','--rx':'0deg','--ry':'0deg',duration:.55,overwrite:true}));
 }
 const stages=[['on-paper','Desenho original e materiais da artista','PESQUISA','43% 65%'],['study-faces','Estudo original de figuras femininas','DESENHO','50% 50%'],['study-dragon','Composição original com figura feminina e dragões','COMPOSIÇÃO','50% 50%'],['composition','Composição real acompanhando a lateral do corpo','ADAPTAÇÃO','50% 50%'],['artist-session','Shimizu tatuando no estúdio','EXECUÇÃO','50% 45%']];
 for(const button of document.querySelectorAll('[data-process]'))button.addEventListener('click',()=>{
  const index=Number(button.dataset.process),data=stages[index],img=document.querySelector('.process-materials img');
  document.querySelectorAll('[data-process]').forEach(b=>{const selected=b===button;b.setAttribute('aria-pressed',selected);b.closest('li').classList.toggle('process-selected',selected);});
  img.src='assets/art/'+data[0]+'.webp';img.alt=data[1];img.style.objectPosition=data[3];
  document.querySelector('.process-active-label').textContent=String(index+1).padStart(2,'0')+' / '+data[2];
  if(canMove()){gsap.killTweensOf(img);gsap.fromTo(img,{opacity:.15,scale:1.025},{opacity:1,scale:1,duration:.65,clearProps:'transform,opacity'});}
 });
 document.querySelector('[data-process="0"]').closest('li').classList.add('process-selected');
 function updateViewer(){
  const item=pool[viewerIndex],img=document.querySelector('#viewer-image');
  img.src='assets/art/'+item.image+'.webp';img.alt=item.alt;
  document.querySelector('#viewer-title').textContent=item.title||item.name;
  document.querySelector('#viewer-description').textContent=item.detail||item.text;
  document.querySelector('#viewer-count').textContent=String(viewerIndex+1).padStart(2,'0')+' / '+String(pool.length).padStart(2,'0');
  const flash=viewer.dataset.kind==='design';
  document.querySelector('.viewer-eyebrow').textContent=flash?'DESENHO AUTORAL':'TATUAGEM POR SHIMIZU';
  document.querySelector('.viewer-note').textContent=flash?'Disponibilidade, tamanho e região do corpo sob consulta.':'Uma referência para começar a sua própria história.';
  const cta=document.querySelector('#viewer-contact');cta.firstChild.textContent=flash?'CONSULTAR ESTE DESENHO':'CONVERSAR SOBRE UMA IDEIA';
  cta.href='https://wa.me/'+whatsappNumber+'?text='+encodeURIComponent(flash?'Olá, Shimizu! Gostaria de consultar o desenho '+item.name+'.':'Olá, Shimizu! Gostei do trabalho '+item.title+' e gostaria de conversar sobre uma tatuagem.');
  if(enabled())gsap.fromTo(img,{opacity:.3,scale:.98},{opacity:1,scale:1,duration:.35,clearProps:'opacity,transform'});
 }
 function openViewer(kind,index,trigger){
  opener=trigger;viewer.dataset.kind=kind;
  pool=kind==='work'?works:[...document.querySelectorAll('[data-design]')].map(a=>availableDesigns[Number(a.dataset.design)]);
  viewerIndex=kind==='work'?index:pool.indexOf(availableDesigns[index]);
  updateViewer();viewer.showModal();closing=false;sync();
  if(enabled())gsap.fromTo(viewer.querySelector('.viewer-surface'),{opacity:0,y:24},{opacity:1,y:0,duration:.45,ease:'power3.out',clearProps:'opacity,transform'});
  document.querySelector('.viewer-close').focus({preventScroll:true});
 }
 function closeViewer(){
  if(closing)return;closing=true;
  const finish=()=>{viewer.close();closing=false;sync();opener?.focus({preventScroll:true});};
  if(enabled())gsap.to(viewer.querySelector('.viewer-surface'),{opacity:0,y:12,duration:.2,onComplete:()=>{gsap.set(viewer.querySelector('.viewer-surface'),{clearProps:'opacity,transform'});finish();}});else finish();
 }
 document.querySelector('[data-open-work]').addEventListener('click',e=>openViewer('work',getWorkIndex(),e.currentTarget));
 for(const link of document.querySelectorAll('[data-design]'))link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();openViewer('design',Number(link.dataset.design),link);});
 document.querySelector('.viewer-close').addEventListener('click',closeViewer);
 viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
 viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});
 function stepViewer(direction){viewerIndex=(viewerIndex+direction+pool.length)%pool.length;updateViewer();if(viewer.dataset.kind==='work')showWork(viewerIndex);}
 document.querySelector('#viewer-next').addEventListener('click',()=>stepViewer(1));
 document.querySelector('#viewer-prev').addEventListener('click',()=>stepViewer(-1));
 viewer.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();stepViewer(e.key==='ArrowRight'?1:-1);}});
 document.addEventListener('visibilitychange',sync);
 document.fonts.ready.then(()=>{if(!location.hash||location.hash==='#inicio')reveal(0);});
 sync();
 return{onChapter,onWork,sync,atmosphere,ink,viewer,openViewer,closeViewer};
}
