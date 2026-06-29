const fs = require('fs');
const path = require('path');

const notes = [];
const DATA_FILE = path.join(process.cwd(), 'notes_data.json');

function load() {
  try { if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch(e) {}
  return [];
}
function save(n) { fs.writeFileSync(DATA_FILE, JSON.stringify(n, null, 2), 'utf8'); }
notes.push(...load());

const E = {
  h:['✨','🌟','💫','🔥','💖','🎀','🌸','🦋','💕','🌺'],
  b:['✅','💡','📌','👉','🔸','🔹','⭐','💎','🎯','📝'],
  e:['👇','💬','🏷️','📢','🎉','🌈','✨','💫']
};
const S = {
  recommendation:{o:['姐妹們！今天一定要跟你們分享一個超好用的{p}！','救命！怎麼現在才發現這個宝藏好物啊😭'],c:['真的超推！姐妹們衝就對了！！','不騙你們！用過就回不去了😭']},
  sharing:{o:['今天來跟大家分享一下我的心得～','累積了這麼多天的經驗，終於可以來分享啦！'],c:['希望對大家有幫助～','覺得有用記得點個收藏哦～']},
  review:{o:['今天來一波真實測評！到底值不值得買？','不吹不黑！真實測評來啦'],c:['總之性價比還不錯，值得入手👍','個人感覺還可以，看大家需求啦～']},
  daily:{o:['今天又是美好的一天呀～來分享下日常🌸','記錄一下今天的日常碎片🧩'],c:['明天也要開心呀～拜拜💕','日常碎片收集成功✌️']}
};
const T = {
  recommendation:['#好物推薦','#必買清單','#平價好物','#宝藏好物'],
  sharing:['#经验分享','#心得分享','#實用技巧','#新手必看'],
  review:['#真實測評','#好物測評','#拔草','#性價比'],
  daily:['#日常碎片','#生活記錄','#今天的心情','#生活美學']
};

module.exports = async (req, res) => {
  try {
    const { topic, style } = req.body;
    if (!topic || !style) return res.status(400).json({ error: '請提供主題和風格' });
    const cfg = S[style];
    const opening = cfg.o[Math.floor(Math.random()*cfg.o.length)].replace('{p}',topic);
    const paras = [];
    const d = ['質感超級好，完全不像這個價位的產品。','效果真的很明顯，用了之後變化很大。','不管是外觀還是實用性都滿分。','朋友看到都問我在哪裡買的哈哈哈。','已經推薦給身邊所有姐妹了！','性價比太高了。'];
    const p = ['首先這個品質真的很不錯，完全超出預期，','用了一段時間之後發現，','最讓我驚喜的是','而且價格也很合理，'];
    for (let i = 0; i < 3+Math.floor(Math.random()*3); i++) {
      paras.push(E.b[i%E.b.length]+' '+p[Math.floor(Math.random()*p.length)]+d[Math.floor(Math.random()*d.length)]);
    }
    const te = E.h[Math.floor(Math.random()*E.h.length)];
    const titles = [te+' '+topic+'推薦｜用過就回不去了！',te+' 求你們去買'+topic+'！！真的太好用了',te+' '+topic+'測評｜不藏了，分享給你們'];
    const title = titles[Math.floor(Math.random()*titles.length)];
    const cl = cfg.c[Math.floor(Math.random()*cfg.c.length)];
    const ee = E.e[Math.floor(Math.random()*E.e.length)];
    const tags = T[style].sort(()=>Math.random()-0.5).slice(0,4).join(' ');
    const note = { title, content: opening+'\n\n'+paras.join('\n\n')+'\n\n'+cl+' '+ee, tags };
    const record = { id: Date.now(), topic: topic.trim(), style, title, content: note.content, tags, created_at: new Date().toISOString() };
    notes.unshift(record);
    save(notes);
    res.json({ success: true, note });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
