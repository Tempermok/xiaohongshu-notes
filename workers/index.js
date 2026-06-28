export default {
  fetch: async (request, env) => {
    const url = new URL(request.url);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    if (request.method === 'OPTIONS') return new Response(null, { headers });

    if (request.method === 'GET' && url.pathname !== '/api/health') {
      try {
        const asset = await env.ASSETS.fetch(new Request(url.origin + url.pathname));
        if (asset.status === 200) return asset;
      } catch(e) {}
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      const { topic, style } = await request.json();
      if (!topic || !style) return new Response(JSON.stringify({error:'請提供主題和風格'}), {status:400, headers});
      const cfg = styleConfigs[style];
      const opening = cfg.openings[Math.floor(Math.random()*cfg.openings.length)].replace('{topic}',topic).replace('{product}',topic);
      const paras = [];
      for (let i = 0; i < 3+Math.floor(Math.random()*3); i++) {
        const phr = ['首先這個'+topic+'的品質真的很不錯，完全超出預期，','用了一段時間之後發現，','最讓我驚喜的是','而且價格也很合理，','使用起來非常順手，','細節方面也做得很好，'][Math.floor(Math.random()*6)];
        const det = ['質感超級好，完全不像這個價位的產品。','效果真的很明顯，用了之後變化很大。','不管是外觀還是實用性都滿分。','朋友看到都問我在哪裡買的哈哈哈。','已經推薦給身邊所有姐妹了！','真的是一種全新的體驗，打開了新世界的大門。','每次用的時候都會想到它的好，幸福感爆棚。','性價比太高了，感覺以前花的錢都是白費。'][Math.floor(Math.random()*8)];
        paras.push(emojis.bullet[i%emojis.bullet.length]+' '+phr+det);
      }
      const te = emojis.header[Math.floor(Math.random()*emojis.header.length)];
      const title = [te+' '+topic+'推薦｜用過就回不去了！',te+' 求你們去買'+topic+'！！真的太好用了',te+' '+topic+'測評｜不藏了，分享給你們',te+' '+topic+'到底怎麼選？一篇教你搞定',te+' 年度最愛'+topic+'TOP級別！'][Math.floor(Math.random()*5)];
      const cl = cfg.closings[Math.floor(Math.random()*cfg.closings.length)];
      const ee = emojis.end[Math.floor(Math.random()*emojis.end.length)];
      const tags = tagPool[style].sort(()=>Math.random()-0.5).slice(0,4).join(' ');
      return new Response(JSON.stringify({success:true,note:{title,content:opening+'\n\n'+paras.join('\n\n')+'\n\n'+cl+' '+ee,tags}}), {headers});
    }
    if (url.pathname === '/api/history' && request.method === 'GET') {
      return new Response(JSON.stringify({success:true,notes:[]}), {headers});
    }
    if ((url.pathname.startsWith('/api/notes/')||url.pathname==='/api/notes') && request.method==='DELETE') {
      return new Response(JSON.stringify({success:true}), {headers});
    }
    if (url.pathname==='/api/health') return new Response(JSON.stringify({status:'ok'}), {headers});
    return new Response('Not Found',{status:404,headers});
  }
};

const emojis = {
  header:['✨','🌟','💫','🔥','💖','🎀','🌸','🦋','💕','🌺'],
  bullet:['✅','💡','📌','👉','🔸','🔹','⭐','💎','🎯','📝'],
  end:['👇','💬','🏷️','📢','🎉','🌈','✨','💫']
};
const styleConfigs = {
  recommendation:{openings:['姐妹們！今天一定要跟你們分享一個超好用的{product}！','救命！怎麼現在才發現這個宝藏好物啊😭','按頭安利！這個{product}真的太好用了吧！！','誰懂啊！！這個{product}我真的要誇一萬遍'],closings:['真的超推！姐妹們衝就對了！！','不騙你們！用過就回不去了😭','已經重複購買第N次了，真心推薦！']},
  sharing:{openings:['今天來跟大家分享一下我的{topic}心得～','累積了這麼多天的經驗，終於可以來分享啦！','很多姐妹問我怎麼做到{topic}的，今天來分享下'],closings:['希望對大家有幫助～有任何問題歡迎留言💕','大家一起交流呀～愛你們😘','覺得有用記得點個收藏哦～']},
  review:{openings:['今天來一波真實測評！{topic}到底值不值得買？','花錢買了N天，終於來說說真實感受了...','不吹不黑！{topic}真實測評來啦'],closings:['總之性價比還不錯，值得入手👍','個人感覺還可以，看大家需求啦～','會繼續關注的！有新款再來測評']},
  daily:{openings:['今天又是美好的一天呀～來分享下日常🌸','記錄一下今天的日常碎片🧩','平淡但幸福的一天，分享給你們看看'],closings:['明天也要開心呀～拜拜💕','日常碎片收集成功✌️','期待下一天的分享哦～']}
};
const tagPool = {
  recommendation:['#好物推薦','#必買清單','#平價好物','#回购之王','#宝藏好物','#不踩雷'],
  sharing:['#经验分享','#心得分享','#實用技巧','#干货分享','#生活小妙招','#新手必看'],
  review:['#真實測評','#好物測評','#拔草','#種草','#性價比','#深度測評'],
  daily:['#日常碎片','#生活記錄','#今天的心情','#平凡的一天','#生活美學','#治愈系']
};
