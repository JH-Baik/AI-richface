/*! The MIT License (MIT)
 * Copyright (c) 2022 Gerard Ferrandez (https://codepen.io/ge1doot/pen/LZdOwj)
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";function showTime(){const theLastExperience=noWorkers=>{"use strict";const struct={points:[{x:0,y:-4,f(s,d){this.y-=.01*s*ts}},{x:0,y:-16,f(s,d){this.y-=.02*s*d*ts}},{x:0,y:12,f(s,d){this.y+=.02*s*d*ts}},{x:-12,y:0},{x:12,y:0},{x:-3,y:34,f(s,d){if(d>0){this.x+=.01*s*ts;this.y-=.015*s*ts}else{this.y+=.02*s*ts}}},{x:3,y:34,f(s,d){if(d>0){this.y+=.02*s*ts}else{this.x-=.01*s*ts;this.y-=.015*s*ts}}},{x:-28,y:0,f(s,d){this.x+=this.vx*.025*ts;this.y-=.001*s*ts}},{x:28,y:0,f(s,d){this.x+=this.vx*.025*ts;this.y-=.001*s*ts}},{x:-3,y:64,f(s,d){this.y+=.015*s*ts;if(d>0){this.y-=.01*s*ts}else{this.y+=.05*s*ts}}},{x:3,y:64,f(s,d){this.y+=.015*s*ts;if(d>0){this.y+=.05*s*ts}else{this.y-=.01*s*ts}}}],links:[{p0:3,p1:7,size:12,lum:.5},{p0:1,p1:3,size:24,lum:.5},{p0:1,p1:0,size:60,lum:.5,disk:1},{p0:5,p1:9,size:16,lum:.5},{p0:2,p1:5,size:32,lum:.5},{p0:1,p1:2,size:50,lum:1},{p0:6,p1:10,size:16,lum:1.5},{p0:2,p1:6,size:32,lum:1.5},{p0:4,p1:8,size:12,lum:1.5},{p0:1,p1:4,size:24,lum:1.5}]};class Robot{constructor(color,light,size,x,y,struct){this.x=x;this.points=[];this.links=[];this.frame=0;this.dir=1;this.size=size;this.color=Math.round(color);this.light=light;for(const p of struct.points){this.points.push(new Robot.Point(size*p.x+x,size*p.y+y,p.f))}for(const link of struct.links){const p0=this.points[link.p0];const p1=this.points[link.p1];const dx=p0.x-p1.x;const dy=p0.y-p1.y;this.links.push(new Robot.Link(this,p0,p1,Math.sqrt(dx*dx+dy*dy),link.size*size/3,link.lum,link.force,link.disk))}}update(){if(++this.frame%Math.round(20/ts)===0)this.dir=-this.dir;if(this.frame>600)this.frame=0;for(const link of this.links)link.update();for(const point of this.points)point.update(this);for(const link of this.links){const p1=link.p1;if(p1.y>canvas.height*ground-link.size*.5){p1.y=canvas.height*ground-link.size*.5;p1.x-=p1.vx;p1.vx=0;p1.vy=0}}this.points[3].x+=(this.x-this.points[3].x)*.001}draw(){for(const link of this.links){if(link.size){const dx=link.p1.x-link.p0.x;const dy=link.p1.y-link.p0.y;const a=Math.atan2(dy,dx);ctx.save();ctx.translate(link.p0.x+link.size*.25,link.p0.y+link.size*.25);ctx.rotate(a);ctx.drawImage(link.shadow,-link.size*.5,-link.size*.5);ctx.restore();ctx.save();ctx.translate(link.p0.x,link.p0.y);ctx.rotate(a);ctx.drawImage(link.image,-link.size*.5,-link.size*.5);ctx.restore()}}}}Robot.Link=class Link{constructor(parent,p0,p1,dist,size,light,force,disk){this.p0=p0;this.p1=p1;this.distance=dist;this.size=size;this.light=light||1;this.force=force||.5;this.image=this.stroke("hsl("+parent.color+" ,30%, "+parent.light*this.light+"%)",true,disk,dist,size);this.shadow=this.stroke("rgba(0,0,0,0.5)",false,disk,dist,size)}update(){const p0=this.p0;const p1=this.p1;const dx=p1.x-p0.x;const dy=p1.y-p0.y;const dist=Math.sqrt(dx*dx+dy*dy);if(dist>0){const tw=p0.w+p1.w;const r1=p1.w/tw;const r0=p0.w/tw;const dz=(this.distance-dist)*this.force;const sx=dx/dist*dz;const sy=dy/dist*dz;p1.x+=sx*r0;p1.y+=sy*r0;p0.x-=sx*r1;p0.y-=sy*r1}}stroke(color,axis,disk,dist,size){let image;if(noWorkers){image=document.createElement("canvas");image.width=dist+size;image.height=size}else{image=new OffscreenCanvas(dist+size,size)}const ict=image.getContext("2d");ict.beginPath();ict.lineCap="round";ict.lineWidth=size;ict.strokeStyle=color;if(disk){ict.arc(size*.5+dist,size*.5,size*.5,0,2*Math.PI);ict.fillStyle=color;ict.fill()}else{ict.moveTo(size*.5,size*.5);ict.lineTo(size*.5+dist,size*.5);ict.stroke()}if(axis){const s=size/10;ict.fillStyle="#000";ict.fillRect(size*.5-s,size*.5-s,s*2,s*2);ict.fillRect(size*.5-s+dist,size*.5-s,s*2,s*2)}return image}};Robot.Point=class Point{constructor(x,y,fn,w){this.x=x;this.y=y;this.w=w||.5;this.fn=fn||null;this.px=x;this.py=y;this.vx=0;this.vy=0}update(robot){if(robot!==pointer.dancerDrag){this.fn&&this.fn(16*Math.sqrt(robot.size),robot.dir)}this.vx=this.x-this.px;this.vy=this.y-this.py;this.px=this.x;this.py=this.y;this.vx*=.995;this.vy*=.995;this.x+=this.vx;this.y+=this.vy+.01*ts}};const dancers=[];let ground=1;let canvas={width:0,height:0,resize:true};let ctx=null;let pointer={x:0,y:0,dancerDrag:null,pointDrag:null};let ts=1;let lastTime=0;const message=e=>{switch(e.data.msg){case"start":var scale=1;canvas.elem=e.data.elem;canvas.width=canvas.elem.width;canvas.height=canvas.elem.height*scale;ctx=canvas.elem.getContext("2d");initRobots();requestAnimationFrame(run);break;case"resize":canvas.width=e.data.width;canvas.height=e.data.height;canvas.resize=true;break}};const resize=()=>{canvas.elem.width=canvas.width;canvas.elem.height=canvas.height;canvas.resize=false;ground=1;for(let i=0;i<dancers.length;i++){dancers[i].x=(i+2)*canvas.width/(dancers.length+3)}};const run=time=>{requestAnimationFrame(run);if(canvas.resize===true)resize();if(lastTime!==0){const t=(time-lastTime)/16;ts+=(t-ts)*.1;if(ts>1)ts=1}lastTime=time;ctx.clearRect(0,0,canvas.width,canvas.height);for(const dancer of dancers){dancer.update();dancer.draw()}};const initRobots=()=>{ground=canvas.height>500?1:1;let num=4;if(canvas.width<576){num=3}else if(canvas.width>=1200){num=5}for(let i=0;i<num;i++){dancers.push(new Robot(i*360/num,80,Math.sqrt(Math.min(canvas.width,canvas.height))/18,(i+2)*canvas.width/(num+2.9),canvas.height*.5-100,struct))}};if(noWorkers){return{postMessage(data){message({data:data})}}}else{onmessage=message}};let worker=null;const createWorker=fn=>{const URL=window.URL||window.webkitURL;return new Worker(URL.createObjectURL(new Blob(["("+fn+")()"])))};const canvas=document.querySelector("canvas");canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;if(window.Worker&&window.OffscreenCanvas){worker=createWorker(theLastExperience);const offscreen=canvas.transferControlToOffscreen();worker.postMessage({msg:"start",elem:offscreen},[offscreen])}else{worker=theLastExperience(true);worker.postMessage({msg:"start",elem:canvas})}window.addEventListener("resize",()=>{worker.postMessage({msg:"resize",width:canvas.offsetWidth,height:canvas.offsetHeight})},false)}window.onload=()=>{showTime()};