const fs = require('fs');
const path = require('path');

const emojis = {
  header:['✨','🌟','💫','🔥','💖','🎀','🌸','🦋','💕','🌺'],
  bullet:['✅','💡','📌','👉','🔸','🔹','⭐','💎','🎯','📝'],
  end:['👇','💬','🏷️','📢','🎉','🌈','✨','💫']
};
const styleConfigs = {
  recommendation:{openings:['姐妹們！今天一定要跟你們分享一個超好用的{product}！','救命！怎麼現在才發現這個宝藏好物啊😭'],closings:['真的超推！姐妹們衝就對了！！','不騙你們！用過就回不去了😭']},
  sharing:{openings:['今天來跟大家分享一下我的{topic}心得～','累積了這麼多天的經驗，終於可以來分享啦！'],closings:['希望對大家有幫助～','覺得有用記得點個收藏哦～']},
  review:{openings:['今天來一波真實測評！{topic}到底值不值得買？','不吹不黑！{topic}真實測評來啦'],closings:['總之性價比還不錯，值得入手👍','個人感覺還可以，看大家需求啦～']},
  daily:{openings:['今天又是美好的一天呀～來分享下日常🌸','記錄一下今天的日常碎片🧩'],closings:['明天也要開心呀～拜拜💕','日常碎片收集成功✌️']}
};
const tagPool = {
  recommendation:['#好物推薦','#必買清單','#平價好物','#宝藏好物'],
  sharing:['#经验分享','#心得分享','#實用技巧','#新手必看'],
  review:['#真實測評','#好物測評','#拔草','#性價比'],
  daily:['#日常碎片','#生活記錄','#今天的心情','#生活美學']
};

export async function POST(request) {
  const { topic, style } = await request.json();
  if (!topic || !style) {
    return Response.json({ error: '請提供主題和風格' }, { status: 400 });
  }
  const cfg = styleConfigs[style];
  const opening = cfg.openings[Math.floor(Math.random()*cfg.openings.length)].replace('{topic}',topic).replace('{product}',topic);
  const paras = [];
  const details = ['質感超級好，完全不像這個價位的產品。','效果真的很明顯，用了之後變化很大。','不管是外觀還是實用性都滿分。','朋友看到都問我在哪裡買的哈哈哈。','已經推薦給身邊所有姐妹了！','性價比太高了，感覺以前花的錢都是白費。'];
  const phrases = ['首先這個'+topic+'的品質真的很不錯，完全超出預期，','用了一段時間之後發現，','最讓我驚喜的是','而且價格也很合理，'];
  for (let i = 0; i < 3+Math.floor(Math.random()*3); i++) {
    paras.push(emojis.bullet[i%emojis.bullet.length]+' '+phrases[Math.floor(Math.random()*phrases.length)]+details[Math.floor(Math.random()*details.length)]);
  }
  const te = emojis.header[Math.floor(Math.random()*emojis.header.length)];
  const titles = [te+' '+topic+'推薦｜用過就回不去了！',te+' 求你們去買'+topic+'！！真的太好用了',te+' '+topic+'測評｜不藏了，分享給你們'];
  const title = titles[Math.floor(Math.random()*titles.length)];
  const cl = cfg.closings[Math.floor(Math.random()*cfg.closings.length)];
  const ee = emojis.end[Math.floor(Math.random()*emojis.end.length)];
  const tags = tagPool[style].sort(()=>Math.random()-0.5).slice(0,4).join(' ');
  const note = { title, content: opening+'\n\n'+paras.join('\n\n')+'\n\n'+cl+' '+ee, tags };
  return Response.json({ success: true, note });
}
// Updated for Vercel
// Updated for Vercel
