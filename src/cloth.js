// Lightweight Verlet mesh with a sewn, immovable top edge.
export class ClothFlag {
  constructor(el,index){
    this.el=el;this.index=index;this.image=el.querySelector('img');this.paper=el.querySelector('.paper');
    this.canvas=document.createElement('canvas');this.canvas.className='flag-cloth';this.ctx=this.canvas.getContext('2d');
    if(!this.ctx)return;
    el.append(this.canvas);this.cols=3;this.rows=9;this.ready=false;
    this.image.decode().then(()=>{this.ready=true;this.resize();}).catch(()=>{});
  }
  resize(){
    if(!this.ready)return;
    const width=this.el.clientWidth,height=this.paper.clientHeight,dpr=Math.min(devicePixelRatio||1,1.5);
    if(!width||!height)return;
    // Fonts, image load and ResizeObserver may mount the same geometry repeatedly.
    // Preserve the mesh and its velocity until the actual canvas size changes.
    if(this.texture&&this.width===width&&this.height===height&&this.dpr===dpr)return;
    this.width=width;this.height=height;this.ratio=height/width;this.dpr=dpr;
    this.canvas.width=Math.ceil(this.width*2*this.dpr);this.canvas.height=Math.ceil(this.height*1.15*this.dpr);
    const texture=document.createElement('canvas');texture.width=Math.ceil(this.width*2);texture.height=Math.ceil(this.height*2);
    const c=texture.getContext('2d');if(!c){this.ready=false;return;}
    const scale=Math.max(texture.width/this.image.naturalWidth,texture.height/this.image.naturalHeight);
    c.drawImage(this.image,(texture.width-this.image.naturalWidth*scale)/2,(texture.height-this.image.naturalHeight*scale)/2,this.image.naturalWidth*scale,this.image.naturalHeight*scale);
    c.fillStyle='rgba(143,103,58,.12)';c.globalCompositeOperation='multiply';c.fillRect(0,0,texture.width,texture.height);
    this.texture=texture;this.points=[];this.links=[];
    for(let y=0;y<=this.rows;y++)for(let x=0;x<=this.cols;x++){
      const u=x/this.cols,v=y/this.rows;this.points.push({x:u,y:v*this.ratio,z:0,px:u,py:v*this.ratio,pz:0,u,v,pin:y===0});
    }
    const link=(a,b,stiffness=1)=>{const p=this.points[a],q=this.points[b];this.links.push({a,b,length:Math.hypot(p.x-q.x,p.y-q.y),stiffness});};
    for(let y=0;y<=this.rows;y++)for(let x=0;x<=this.cols;x++){
      const i=y*(this.cols+1)+x;
      if(x<this.cols)link(i,i+1);if(y<this.rows)link(i,i+this.cols+1);
      if(x<this.cols&&y<this.rows){link(i,i+this.cols+2,.8);link(i+1,i+this.cols+1,.8);}
      if(y<this.rows-1)link(i,i+2*(this.cols+1),.35);
    }
    this.draw();
  }
  reset(){if(!this.points)return;for(const p of this.points){p.x=p.px=p.u;p.y=p.py=p.v*this.ratio;p.z=p.pz=0;}this.draw();}
  step(dt,time,breeze){
    if(!this.ready||!this.points)return;
    const phase=this.index*1.43,mass=1+this.index*.13;
    for(const p of this.points){
      if(p.pin)continue;
      const vx=(p.x-p.px)*.985,vy=(p.y-p.py)*.985,vz=(p.z-p.pz)*.977;p.px=p.x;p.py=p.y;p.pz=p.z;
      const ripple=Math.sin(time*3.3-p.v*5.2+phase+p.u*2.4);
      p.x+=vx+(breeze*7+ripple*1.6)*p.v*dt*dt/mass;p.y+=vy+14*dt*dt;p.z+=vz+(breeze*4+ripple*3.3)*p.v*dt*dt/mass;
    }
    for(let pass=0;pass<5;pass++){
      for(const l of this.links){
        const p=this.points[l.a],q=this.points[l.b],dx=q.x-p.x,dy=q.y-p.y,dz=q.z-p.z,length=Math.hypot(dx,dy,dz)||1;
        const weight=(length-l.length)/length*l.stiffness,split=p.pin||q.pin?1:.5;
        if(!p.pin){p.x+=dx*weight*split;p.y+=dy*weight*split;p.z+=dz*weight*split;}
        if(!q.pin){q.x-=dx*weight*split;q.y-=dy*weight*split;q.z-=dz*weight*split;}
      }
      for(const p of this.points)if(p.pin){p.x=p.u;p.y=0;p.z=0;}
    }
  }
  triangle(points){
    const q=points.map(p=>({x:p.u*this.texture.width,y:p.v*this.texture.height}));
    const p=points.map(n=>({x:(n.x+n.z*.34+.5)*this.width,y:(n.y-n.z*.08)*this.width}));
    const ux=q[1].x-q[0].x,uy=q[1].y-q[0].y,vx=q[2].x-q[0].x,vy=q[2].y-q[0].y,det=ux*vy-uy*vx;
    const a=((p[1].x-p[0].x)*vy-(p[2].x-p[0].x)*uy)/det,b=((p[1].y-p[0].y)*vy-(p[2].y-p[0].y)*uy)/det;
    const c=((p[2].x-p[0].x)*ux-(p[1].x-p[0].x)*vx)/det,d=((p[2].y-p[0].y)*ux-(p[1].y-p[0].y)*vx)/det;
    const ctx=this.ctx,s=this.dpr;ctx.save();ctx.setTransform(s,0,0,s,0,0);ctx.beginPath();
    const cx=(p[0].x+p[1].x+p[2].x)/3,cy=(p[0].y+p[1].y+p[2].y)/3;
    // Tiny overlap prevents seams between adjacent triangles.
    p.forEach((n,i)=>{const dx=n.x-cx,dy=n.y-cy,l=Math.hypot(dx,dy)||1;ctx[i?'lineTo':'moveTo'](n.x+dx/l*1.1,n.y+dy/l*1.1);});
    ctx.closePath();ctx.clip();ctx.setTransform(s*a,s*b,s*c,s*d,s*(p[0].x-a*q[0].x-c*q[0].y),s*(p[0].y-b*q[0].x-d*q[0].y));ctx.drawImage(this.texture,0,0);
    const shade=Math.min(.18,Math.abs(points[2].z-points[0].z)*.2);if(shade>.005){ctx.fillStyle=`rgba(30,15,10,${shade})`;ctx.fillRect(0,0,this.texture.width,this.texture.height);}ctx.restore();
  }
  draw(){
    if(!this.ready||!this.points)return;
    this.ctx.setTransform(1,0,0,1,0,0);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for(let y=0;y<this.rows;y++)for(let x=0;x<this.cols;x++){
      const i=y*(this.cols+1)+x,p=this.points;this.triangle([p[i],p[i+1],p[i+this.cols+1]]);this.triangle([p[i+1],p[i+this.cols+2],p[i+this.cols+1]]);
    }
    this.el.classList.add('cloth-ready');
  }
}
