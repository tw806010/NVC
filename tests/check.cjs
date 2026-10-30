const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements={};
const sandbox={document:{getElementById(id){return elements[id]??={innerHTML:'',addEventListener(){}};}},console,setTimeout};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('app.js','utf8'),sandbox);
vm.runInContext(`
if(lessons.length!==8||scenarios.length!==6)throw Error('內容數量不符');
step=1;if(validStep())throw Error('空白觀察不應通過');
state.observation='今天資料尚未送達。';if(!validStep())throw Error('觀察驗證失敗');
step=2;if(validStep())throw Error('空白感受不應通過');
state.feelings=['擔心'];if(!validStep())throw Error('感受驗證失敗');
step=3;state.extraNeed='合作';if(!validStep())throw Error('自訂需要驗證失敗');
step=4;if(validStep())throw Error('空白請求不應通過');
state.request='告訴我預計時間？';if(!validStep())throw Error('請求驗證失敗');
if(!resultText().includes('你願意告訴我預計時間嗎？'))throw Error('請求標點錯誤');
if(esc('<img onerror="bad">').includes('<img'))throw Error('輸入轉義失敗');
for(let i=0;i<8;i++)showLesson(i);
for(let i=0;i<=5;i++){step=i;renderPractice();}
const fakeCtx={measureText:t=>({width:t.length*10})};
if(wrapText(fakeCtx,'甲乙丙丁',20).join('|')!=='甲乙|丙丁')throw Error('圖卡換行失敗');
`,sandbox);
const html=fs.readFileSync('index.html','utf8');for(const name of ['style.css','app.js'])assert.ok(fs.existsSync(name));
for(const id of ['home','learn','scenarios','practice'])assert.ok(html.includes(`id="${id}"`));
console.log('通過：八張教學卡、六個情境、步驟驗證、輸入轉義、表達文字、圖卡換行與頁面連結。');
