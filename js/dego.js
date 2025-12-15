var sekkai_cnt=0,fusekkai_cnt=0;
function degoWord(word) {
	return new Promise((resolve) => {
		let isResolved = false;
		const timeoutId = setTimeout(() => {
			if (!isResolved) {
				complete('timeout');
			}
		}, 10000);

		const complete = (reason) => {
			if (isResolved) return;
			isResolved = true;
			clearTimeout(timeoutId);
			$('.dego h1').removeClass('started');
			if (reason == 'correct') {
				playOneShotAnimation();
				sekkai_cnt++
				word.pt++
			}else{
				fusekkai_cnt++
				word.pt--
			}
			$('.dego .score span.sekkai').text(sekkai_cnt)
			$('.dego .score span.fusekkai').text(fusekkai_cnt)
			$('.dego .kaisetsu p.ks_word').text(word.word)
			$('.dego .kaisetsu p.ks_yomikata').text(word.yomikata)
			$('.dego .kaisetsu p.ks_meaning').text(word.meaning)
			$('.dego .kaisetsu').fadeIn('fast');
			resolve(reason);
		};

		// 键盘事件处理函数
		const keydownHandler = (e) => {
			if (e.key === 'q' || e.key === 'Q') {
				complete('timeout');
			}
		};

		// 显示单词
		$('.dego .kaisetsu').fadeOut('fast');
		$('.dego h1').removeClass('started').text(word.word).addClass('started');
		$('.dego input').val('');

		// 临时事件处理
		const inputHandler = () => {
			if ($('.dego input').val() === word.yomikata) {
				complete('correct');
			}
		};

		$('.dego input').off('input.dego').on('input.dego', inputHandler);
		
		// 添加键盘事件监听
		$(document).off('keydown.dego').on('keydown.dego', keydownHandler);

		// 清理事件
		const originalResolve = resolve;
		resolve = (reason) => {
			$('.dego input').off('input.dego');
			$(document).off('keydown.dego'); // 清理键盘事件
			originalResolve(reason);
		};
	});
}

function waitForEnter() {
	return new Promise(resolve => {
		const handler = (e) => {
			if (e.key === 'Enter') {
				document.removeEventListener('keydown', handler);
				resolve();
			}
		};
		document.addEventListener('keydown', handler);
	});
}
function isOnlyKanaAndSymbols(str) {
    const kanaAndSymbolsRegex = /^[\u3040-\u309F\u30A0-\u30FF\u3000-\u303F\uFF00-\uFFEF\s]*$/;
    return kanaAndSymbolsRegex.test(str);
}
async function degoList(title,random=true) {
	sekkai_cnt=0
	fusekkai_cnt=0
	$('.dego .kaisetsu').hide()
	let list=get_word_bank(title).content;
	let ava_list=[]
	if(random==true){
		for (let i = 0; i < list.length; i++) {
			word=list[i]
			if(isOnlyKanaAndSymbols(word.word))continue;
			ava_list.push(word)
		}
		ava_list.sort(()=> Math.random()-0.5)
		list=ava_list
	}
	for (let i = 0; i < list.length; i++) {
		word=list[i]
		if(isOnlyKanaAndSymbols(word.word))continue;
		await degoWord(word)
		await waitForEnter()
	}
}
function playOneShotAnimation(scale = 9) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '50%';
  canvas.style.left = '50%';
  canvas.style.transform = 'translate(-50%, -50%)';
  canvas.style.zIndex = '9999';
  canvas.style.imageRendering = 'auto';
  document.body.appendChild(canvas);

  const frames = [];
  let loadedCount = 0;
  const totalFrames = 20;
  let originalWidth, originalHeight;

  // 预加载所有图片
  for(let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `img/bomb/图层 ${i.toString()}.png`;
    img.onload = () => {
      loadedCount++;
      if(loadedCount === 1) {
        originalWidth = img.width;
        originalHeight = img.height;
        canvas.width = originalWidth * scale;
        canvas.height = originalHeight * scale;
      }
      if(loadedCount === totalFrames) {
        startAnimation();
      }
    };
    frames.push(img);
  }

  let currentFrame = 0;
  let animationId;
  let frameCounter = 0; // 添加帧计数器

  function startAnimation() {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    function animate(timestamp) {
      // 每两帧才更新一次图片
      if (frameCounter % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          frames[currentFrame], 
          0, 0, 
          canvas.width, canvas.height
        );
        currentFrame++;
      }
      frameCounter++;
      
      if(currentFrame < totalFrames) {
        animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
        document.body.removeChild(canvas);
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }
}