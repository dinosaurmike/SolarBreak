// Records the SolarBreak README header on a virtual clock (vclock.js) so every frame is exactly 100 ms.
// Serve the built app so it answers at /solar/ (e.g. a folder holding solar/ → python3 -m http.server 8731), then:
//   node record.js http://localhost:8731/solar/     → frames/f###.png
//   ffmpeg -framerate 10 -i frames/f%03d.png -vf "scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" -loop 0 ../solarbreak-header.gif
const {chromium}=require('playwright');const VC=require('./vclock.js');const fs=require('fs');
const DT=100;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:800}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(VC);await p.route(/googletagmanager|fonts\.g/,r=>r.fulfill({body:''}));
 fs.rmSync('frames',{recursive:true,force:true});fs.mkdirSync('frames');
 let f=0;const shot=async()=>{await p.screenshot({path:`frames/f${String(f++).padStart(3,'0')}.png`});};
 const tick=async()=>{await p.evaluate(dt=>__advance(dt),DT);await p.waitForTimeout(25);};
 const run=async(n,on)=>{for(let i=0;i<n;i++){if(on)await on(i);await tick();await shot();}};
 await p.goto(process.argv[2]||'http://localhost:8731/solar/',{waitUntil:'networkidle'});
 for(let i=0;i<4;i++)await tick();
 await run(22);                                            // landing page
 await p.click('text=Get My Free Estimate');
 for(let i=0;i<30&&!(await p.$('input[type=number]'));i++)await tick();
 await run(8);
 await p.click('input[type=number]');await p.keyboard.press('Control+A');
 await run(9,async i=>{if(i%3===0)await p.keyboard.type('220'[i/3]);}); // type the bill
 await run(5);
 await p.selectOption('select',{label:'Arizona'});
 await run(26);                                            // results animate in
 const Y=await p.evaluate(()=>{const h=[...document.querySelectorAll('h2,h3,div')].find(e=>e.textContent.trim().startsWith('Payback Over 25'));return h?h.getBoundingClientRect().top+scrollY-110:900});
 await run(16,async i=>{const t=(i+1)/16,e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;await p.evaluate(y=>scrollTo(0,y),Math.round(Y*e));});
 await run(22);                                            // payback chart
 await run(12,async i=>{const t=(i+1)/12,e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;await p.evaluate(y=>scrollTo(0,y),Math.round(Y*(1-e)));});
 await p.click('text=LOAN');
 await run(24);                                            // loan view
 console.log('frames',f,'errors',JSON.stringify(errs.slice(0,4)));await b.close();})();
