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
			console.log(reason === 'correct' ? 666 : 888);
			if (false && reason == 'correct') {
				$('.dego img').attr('src', '')
				$('.dego img').attr('src', 'img/bomb.gif')
				$('.dego img').addClass('show')
				setInterval(() => {
					$('.dego img').removeClass('show')
				}, 400)
			}
			resolve(reason);
		};

		// 显示单词
		$('.dego h1').removeClass('started').text(word.word).addClass('started');
		$('.dego input').val('');

		// 临时事件处理
		const inputHandler = () => {
			if ($('.dego input').val() === word.yomikata) {
				complete('correct');
			}
		};

		$('.dego input').off('input.dego').on('input.dego', inputHandler);

		// 清理事件
		const originalResolve = resolve;
		resolve = (reason) => {
			$('.dego input').off('input.dego');
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

async function degoList(title) {
	let list=get_word_bank(title).content;
	for (let i = 0; i < list.length; i++) {
		word=list[i]
		await degoWord(word)
		await waitForEnter()
	}
}
