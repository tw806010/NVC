import assert from 'node:assert/strict';
import worker,{validateResult} from '../worker/index.mjs';
import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const sample={observation:'組員未提供資料。',feelings:['擔心'],needs:['合作'],request:'今晚告訴我進度',draft:'我想確認進度。',questions:[],advice:'請確認是否符合你的情況。',safetyConcern:false};
const env={GEMINI_API_KEY:'test-only-secret',AI_RATE_LIMITER:{limit:async()=>({success:true})}};
const origin='https://tw806010.github.io';
const req=(body={text:'這是虛構的溝通練習文字。',consent:true,adult:true},headers={})=>new Request('https://example.test/analyze',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...headers},body:JSON.stringify(body)});
const originalFetch=globalThis.fetch;let calls=0;
globalThis.fetch=async(url,options)=>{calls++;assert.ok(!url.includes(env.GEMINI_API_KEY));assert.equal(options.headers['x-goog-api-key'],env.GEMINI_API_KEY);return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(sample)}]}}]});};
try{
assert.equal((await worker.fetch(req(),env)).status,200);
assert.equal(calls,1);
let response=await worker.fetch(req({}, {Origin:'https://evil.test'}),env);assert.equal(response.status,403);assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
assert.equal((await worker.fetch(req({text:'太短',adult:true,consent:true}),env)).status,400);
assert.equal((await worker.fetch(req({text:'這是測試文字。',adult:true,consent:false}),env)).status,400);
assert.equal((await worker.fetch(req({text:'字'.repeat(1201),adult:true,consent:true}),env)).status,400);
assert.equal((await worker.fetch(req(),{...env,AI_RATE_LIMITER:undefined})).status,503);
assert.equal((await worker.fetch(req(),{...env,AI_ENABLED:'false'})).status,503);
assert.equal((await worker.fetch(req(),{...env,AI_RATE_LIMITER:{limit:async()=>({success:false})}})).status,429);
assert.equal(calls,1,'拒絕的請求不得呼叫 Gemini');
const pre=await worker.fetch(new Request('https://example.test/analyze',{method:'OPTIONS',headers:{Origin:origin}}),env);assert.equal(pre.status,204);
globalThis.fetch=async()=>new Response('quota',{status:429});response=await worker.fetch(req(),env);assert.equal(response.status,429);assert.ok(!(await response.text()).includes('test-only-secret'));
globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:'bad json'}]}}]});assert.equal((await worker.fetch(req(),env)).status,502);
globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({...sample,safetyConcern:true})}]}}]});response=await worker.fetch(req(),env);const data=await response.json();assert.equal(data.result.draft,'');assert.equal(data.result.request,'');
assert.equal(validateResult({...sample,feelings:'bad'}),false);
assert.equal(validateResult({...sample,draft:'x'.repeat(1801)}),false);
console.log('通過：來源、同意、字數、停用、限流、金鑰隔離、預檢、上游額度、格式驗證及安全建議。');
}finally{globalThis.fetch=originalFetch;}
