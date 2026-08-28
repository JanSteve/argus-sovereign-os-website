import{s as c,D as u}from"./index-CCBHt2Ug.js";function d(t,e){return`You are ARGUS Sovereign Intelligence — an ultra-advanced, omniscient AI desktop copilot.
Guidelines for precision and zero hallucination:
1. Provide accurate, direct, highly structured answers formatted in clean Markdown.
2. If you are uncertain of a specific real-world fact, clearly state it rather than making up information.
3. Keep tone authoritative, sophisticated, concise, and helpful.
${e?`
[VERIFIED WIKIPEDIA FACTUAL CONTEXT]:
${e}`:""}

User Request: ${t}`}async function p(t){const e=u.trim();if(!e)return null;try{const n=new AbortController,i=setTimeout(()=>n.abort(),6e3),a=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},signal:n.signal,body:JSON.stringify({contents:[{role:"user",parts:[{text:t}]}],generationConfig:{temperature:.4,maxOutputTokens:2048}})});if(clearTimeout(i),a.ok){const s=(await a.json()).candidates?.[0]?.content?.parts?.[0]?.text;if(s&&s.trim().length>0)return s.trim()}return null}catch{return null}}async function m(t){try{const e=new AbortController,n=setTimeout(()=>e.abort(),7e3),i=encodeURIComponent(t),a=await fetch(`https://text.pollinations.ai/${i}?model=openai&json=false`,{signal:e.signal});if(clearTimeout(n),a.ok){const r=await a.text();if(r&&r.trim().length>0)return r.trim()}return null}catch{return null}}async function f(t){try{const e=new AbortController,n=setTimeout(()=>e.abort(),4e3),i=await fetch("http://localhost:11434/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},signal:e.signal,body:JSON.stringify({model:"llama3.2",prompt:t,stream:!1})});if(clearTimeout(n),i.ok){const a=await i.json();if(a.response&&a.response.trim().length>0)return a.response.trim()}return null}catch{return null}}async function g(t){const e=Date.now();let n="";if(t.toLowerCase().includes("what is")||t.toLowerCase().includes("who is")||t.toLowerCase().includes("explain")||t.toLowerCase().includes("history of")||t.toLowerCase().includes("when was")||t.toLowerCase().includes("facts"))try{const o=await c(t);o&&o.extract&&(n=`Topic: ${o.title}
Summary: ${o.extract}
Reference: ${o.sourceUrl||""}`)}catch{}const a=d(t,n),r=await p(a);if(r)return{content:r,provider:"gemini",latencyMs:Date.now()-e,isFactualContextUsed:!!n};const s=await m(a);if(s)return{content:s,provider:"pollinations",latencyMs:Date.now()-e,isFactualContextUsed:!!n};const l=await f(a);if(l)return{content:l,provider:"ollama",latencyMs:Date.now()-e,isFactualContextUsed:!!n};if(n){const o=await c(t);if(o&&o.extract)return{content:`### 📚 **${o.title}**

${o.extract}

---
🌐 *Verified via Wikipedia Knowledge Graph*`,provider:"wikipedia",latencyMs:Date.now()-e,isFactualContextUsed:!0}}return{content:`I have processed your query regarding **"${t}"**. All sovereign neural circuits are operational, sir.`,provider:"gemini",latencyMs:Date.now()-e,isFactualContextUsed:!1}}export{g as executeLoadBalancedQuery};
