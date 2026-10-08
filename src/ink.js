// Original brush drawing, revealed after the opening in five quiet stages.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const noise=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
const strokes=[
 // 01: ground and the first gestures of the lantern.
 [0,3,'M12 326 Q65 315 115 326 M35 334 Q83 330 144 337'],
 [0,4,'M19 108 Q7 149 18 196 Q29 207 60 201 Q78 175 64 117'],
 [0,2,'M17 113 Q43 103 66 114 M13 123 Q41 116 70 125'],
 [0,2,'M22 136 Q16 158 22 183 M61 133 Q68 157 61 185'],
 // 02: ribs, cap and hanging cord.
 [1,3,'M19 198 Q41 215 61 198 M28 211 L26 222 L53 222 L51 211'],
 [1,3,'M18 106 L24 99 L56 98 L67 108 M26 97 L28 89 L54 89 L57 99'],
 [1,2,'M40 89 Q43 70 42 52'],
 [1,1.3,'M19 137 Q42 143 68 136 M17 154 Q43 160 70 152 M19 173 Q42 179 67 172 M22 187 Q41 192 62 185'],
 [1,1.2,'M33 127 Q27 158 34 195 M47 125 Q56 160 48 196'],
 [1,2,'M25 227 Q39 232 55 228 M31 232 L26 250 M39 234 L38 263 M47 232 L54 254'],
 // 03: the temple roof, drawn in decisive dry-brush gestures.
 [2,4,'M99 185 Q120 180 137 163 L194 162 Q211 180 232 184'],
 [2,3.5,'M97 184 Q118 201 159 204 Q202 208 233 183'],
 [2,2,'M134 163 Q165 169 197 163 M105 193 Q165 219 226 194'],
 [2,1.3,'M137 167 L118 190 M147 168 L135 197 M158 170 L154 199 M171 169 L172 201 M182 167 L191 197 M193 168 L212 192'],
 // 04: columns and a second roof.
 [3,2.4,'M124 211 L125 238 M205 209 L203 240 M143 215 L144 236 M186 216 L186 236'],
 [3,3.8,'M87 247 Q115 242 127 231 Q165 244 207 231 Q219 244 245 248'],
 [3,3.2,'M87 247 Q111 268 163 272 Q209 272 244 248'],
 [3,1.4,'M121 240 L109 255 M136 244 L129 263 M151 248 L149 268 M170 247 L173 268 M187 245 L198 265 M207 240 L224 258'],
 [3,1.2,'M115 258 Q171 281 231 257'],
 // 05: structure, doors and steps.
 [4,3,'M114 275 L113 311 L217 311 L215 275'],
 [4,2,'M133 280 L133 308 M195 280 L196 308 M151 308 L151 285 Q164 282 177 285 L177 309'],
 [4,1.3,'M161 286 L161 308 M168 286 L168 308 M130 288 L115 287 M197 289 L214 287'],
 [4,2.5,'M103 315 Q165 320 226 314 M98 321 L232 321 M91 328 Q165 332 239 326'],
 // 06: plum branch, petals, horizon and the finishing seal.
 [5,4,'M-9 68 Q27 28 92 47 Q128 57 157 30'],
 [5,2.1,'M17 47 Q40 48 59 22 M63 41 Q79 16 102 16 M90 47 Q116 71 131 67'],
 [5,1.4,'M112 44 L121 21 L135 11 M128 67 L146 61 M37 46 L24 21'],
 [5,1.2,'M207 136 Q226 124 241 132 M218 147 Q232 143 247 145'],
 [5,1,'M178 332 Q207 334 244 329 M194 339 L227 339'],
];
function sample(d){
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);
 // Split subpaths so the dry brush never joins separate structural lines.
 return d.match(/M[^M]+/g).map(part=>{path.setAttribute('d',part);const length=path.getTotalLength(),n=Math.max(8,Math.ceil(length/2));return Array.from({length:n+1},(_,i)=>{const distance=length*i/n,p=path.getPointAtLength(distance),a=path.getPointAtLength(Math.max(0,distance-.5)),b=path.getPointAtLength(Math.min(length,distance+.5)),size=Math.hypot(b.x-a.x,b.y-a.y)||1;return{x:p.x,y:p.y,t:i/n,nx:-(b.y-a.y)/size,ny:(b.x-a.x)/size};});});
}
export class InkCompanion{
 constructor(canvas,scroller){
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});this.scroller=scroller;
  this.chapter=0;this.progress=0;this.target=0;this.paper=0;this.paperTarget=0;this.frame=0;this.last=0;this.lastDraw=0;this.time=0;this.drawCount=0;this.active=false;this.animate=true;this.placedChapter=-1;
  this.strokes=strokes.map(([stage,width,d],i)=>({stage:i===0?3:Math.max(0,stage-1),width,paths:sample(d),seed:i*17}));
  this.strokes.forEach(s=>{const peers=this.strokes.filter(a=>a.stage===s.stage);s.count=peers.length;s.order=peers.indexOf(s);});
  this.boxes=[];this.protectUntil=0;this.lastProtect=0;this.tick=this.tick.bind(this);this.onResize=()=>{this.resize();this.protect();this.place();this.draw();};
  this.onScroll=()=>{if(this.measureFrame)return;this.measureFrame=requestAnimationFrame(()=>{this.measureFrame=0;this.protect();if(this.chapter>0&&this.placedChapter!==this.chapter&&Math.abs(this.scroller.scrollTop-this.scroller.children[this.chapter].offsetTop)<2)this.place();if(!this.animate)this.draw();});};
  addEventListener('resize',this.onResize,{passive:true});scroller.addEventListener('scroll',this.onScroll,{passive:true,capture:true});
  this.textObserver=new MutationObserver(()=>{this.protectUntil=performance.now()+800;this.onScroll();});this.textObserver.observe(scroller,{childList:true,characterData:true,subtree:true});
  this.resize();this.protect();document.fonts.ready.then(()=>{this.protectUntil=performance.now()+1400;this.protect();this.place();this.draw();});
 }
 resize(){
  this.width=innerWidth;this.height=innerHeight;this.mobile=this.width<=1000;this.dpr=Math.min(devicePixelRatio||1,this.mobile?1.25:1.5);
  this.canvas.width=Math.round(this.width*this.dpr);this.canvas.height=Math.round(this.height*this.dpr);
  // Preserve the original discreet size; placement seeks unoccupied margins.
  this.scale=this.mobile?Math.min(.43,this.height/1650):Math.min(.68,this.height/1300);
  this.x=this.mobile?8:18;this.y=this.height-355*this.scale-62;this.placedChapter=-1;
 }
 protect(){
  // Protect photographs and full hit targets, as well as individual text lines.
  const walker=document.createTreeWalker(this.scroller,NodeFilter.SHOW_TEXT),range=document.createRange(),boxes=[],movingText=performance.now()<this.protectUntil,paddingY=movingText?9:3;
  let node;
  while(node=walker.nextNode()){
   if(!node.textContent.trim()||node.parentElement.closest('.sr-only,[hidden],script,style,canvas'))continue;
   range.selectNodeContents(node);
   for(const r of range.getClientRects()){
    if(r.width<1||r.height<1||r.bottom<=0||r.top>=this.height||r.right<=0||r.left>=this.width)continue;
    const left=Math.max(0,r.left-4),top=Math.max(0,r.top-paddingY),right=Math.min(this.width,r.right+4),bottom=Math.min(this.height,r.bottom+paddingY);
    boxes.push({x:left,y:top,w:right-left,h:bottom-top});
   }
  }
  const elements=[...this.scroller.querySelectorAll('img:not(.ornament),a,button'),...document.querySelectorAll('.masthead,#whatsapp-floating,.chapter-rail')];
  for(const el of elements){
   if(el.closest('.contact-landscape,.environment,[hidden],.sr-only'))continue;
   const r=el.getBoundingClientRect(),gallery=el.closest('.available-gallery,.work-fragments'),clip=gallery?.getBoundingClientRect();
   const left=Math.max(0,r.left-5,clip?.left??0),top=Math.max(0,r.top-5,clip?.top??0),right=Math.min(this.width,r.right+5,clip?.right??this.width),bottom=Math.min(this.height,r.bottom+5,clip?.bottom??this.height);
   if(right>left&&bottom>top)boxes.push({x:left,y:top,w:right-left,h:bottom-top});
  }
  this.boxes=boxes;
  this.lastProtect=performance.now();
 }
 place(){
  if(!this.chapter)return;
  // Test the actual marks, so a narrow lantern can fit beside a wider gallery.
  const points=this.strokes.filter(s=>s.stage<this.target).flatMap(s=>s.paths.flatMap(path=>path.filter((p,i)=>i%6===0))),scale=this.scale;
  const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
  const x0=this.mobile?8:18,y0=this.height-355*scale-62;
  const xs=[x0,8-minX*scale,this.width*.08,this.width*.22,this.width*.42,this.width*.63,this.width-maxX*scale-10];
  const ys=[y0,this.height-maxY*scale-10,this.height-maxY*scale-48,y0-65,y0-130,this.height*.14,this.height*.3,this.height*.46,this.height*.62];
  let best={x:x0,y:y0,score:-Infinity,visible:0};
  for(const x of xs)for(const y of ys){
   if(x+minX*scale<4||x+maxX*scale>this.width-8||y+minY*scale<80||y+maxY*scale>this.height-8)continue;
   let visible=0;
   for(const p of points){const px=x+p.x*scale,py=y+p.y*scale;if(!this.boxes.some(b=>px>b.x-2&&px<b.x+b.w+2&&py>b.y-2&&py<b.y+b.h+2))visible++;}
   const fraction=visible/points.length,score=fraction-Math.hypot((x-x0)/this.width,(y-y0)/this.height)*.08;
   if(score>best.score)best={x,y,score,visible:fraction};
  }
  this.x=best.x;this.y=best.y;this.visibleFraction=best.visible;this.placedChapter=this.chapter;
 }
 setChapter(index){
  if(index===this.chapter)return;
  this.chapter=index;this.target=index;this.paperTarget=index===3?1:0;this.placedChapter=-1;
  this.protectUntil=performance.now()+1400;
  this.progress=Math.max(Math.max(0,index-1),this.progress);
  if(this.progress>this.target||!this.animate)this.progress=this.target;
  if(!this.animate)this.paper=this.paperTarget;
  this.protect();if(Math.abs(this.scroller.scrollTop-this.scroller.children[index].offsetTop)<2)this.place();this.draw();
 }
 setState({active,animate}){
  this.active=Boolean(active&&this.chapter>0&&this.ctx);this.animate=Boolean(animate);this.canvas.hidden=!this.active;
  if(!this.active||!this.animate){cancelAnimationFrame(this.frame);this.frame=0;this.last=0;if(!this.animate){this.progress=this.target;this.paper=this.paperTarget;}this.protect();this.draw();return;}
  if(!this.frame){this.last=0;this.frame=requestAnimationFrame(this.tick);}
 }
 tick(now){
  this.frame=0;if(!this.active||!this.animate)return;
  const dt=this.last?Math.min((now-this.last)/1000,.05):1/60;this.last=now;this.time+=dt;
  this.progress=Math.min(this.target,this.progress+dt/6);
  this.paper+=(this.paperTarget-this.paper)*(1-Math.exp(-dt*5));
  if(now-this.lastDraw>=40){if(now<this.protectUntil)this.protect();this.draw();this.lastDraw=now;}
  this.frame=requestAnimationFrame(this.tick);
 }
 draw(){
  if(!this.ctx)return;const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.width,this.height);
  c.save();c.translate(this.x,this.y);c.scale(this.scale,this.scale);
  const p=this.paper,breath=this.animate?.97+Math.sin(this.time*.36)*.03:1;
  c.strokeStyle=`rgb(${Math.round(205-177*p)},${Math.round(195-172*p)},${Math.round(176-156*p)})`;c.lineCap='round';
  for(const s of this.strokes){
   const amount=clamp((this.progress-s.stage)*s.count-s.order);
   if(!amount)continue;
   for(let b=0;b<15;b++){
    c.lineWidth=.48+noise(s.seed+b)*.65;c.globalAlpha=(.38+noise(s.seed+b+8)*.32)*breath;
    c.beginPath();
    for(const points of s.paths){let pen=false;
     for(let j=0;j<points.length*amount;j++){
      const point=points[j],pressure=.34+Math.pow(Math.sin(point.t*Math.PI),.55)*.9;
      if(noise(s.seed+b*71+Math.floor(j/2))<.1){pen=false;continue;}
      const offset=(b/14-.5)*s.width*pressure*1.9;
      const x=point.x+point.nx*offset+(noise(s.seed+j)-.5)*1.4;
      const y=point.y+point.ny*offset+(noise(s.seed+b*3+j)-.5)*1.3;
      if(pen)c.lineTo(x,y);else{c.moveTo(x,y);pen=true;}
     }
    }c.stroke();
   }
  }
  // A few original vermilion blossom gestures complete the sixth chapter.
  const finish=clamp(this.progress-4);
  if(finish){
   c.fillStyle=p>.5?'#8e2d23':'#b74d3b';
   [[27,21],[58,23],[101,17],[122,22],[145,61],[129,67],[84,41]].forEach(([x,y],i)=>{
    c.globalAlpha=smooth(finish*1.8-i*.1)*.72*breath;
    for(let petal=0;petal<5;petal++){const a=petal*Math.PI*.4;c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.ellipse(0,-3.5,2.3,4.4,0,0,Math.PI*2);c.fill();c.restore();}
   });
   c.globalAlpha=finish*.65;c.strokeStyle='#ad4936';c.lineWidth=1.8;c.strokeRect(222,295,16,21);c.beginPath();c.moveTo(234,300);c.bezierCurveTo(220,296,226,310,234,307);c.bezierCurveTo(239,314,224,316,227,311);c.stroke();
  }
  c.restore();c.globalAlpha=1;c.globalCompositeOperation='destination-out';
  for(const b of this.boxes)c.fillRect(b.x,b.y,b.w,b.h);
  c.globalCompositeOperation='source-over';this.drawCount++;
 }
 destroy(){this.setState({active:false,animate:false});this.textObserver.disconnect();cancelAnimationFrame(this.measureFrame);removeEventListener('resize',this.onResize);this.scroller.removeEventListener('scroll',this.onScroll,true);}
}
