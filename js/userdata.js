word_bank = []
task_list = []
getdata()
wap_callback[2] = (() => {
	$(".wordbank .bank ul").html('')
	word_bank.forEach(x => {
		$(".wordbank .bank ul").append(
			`<li>
			<div onclick="task_show('${x.title}')">
				<h2>${x.title}</h2>
				<div class="info">
					<h3>単語数 <span class="word_number">${x.content.length}</span></h3>
					<h3>習熟度 <span class="mastery">${mastery_v(x.content)}</span></h3>
					<h3>前回時間 <span class="last_time">2025/01/01</span></h3>
				</div>
			</div>
		</li>`);
	})
})


function task_show(title) {
	$(".tasklist .tasks ul").html("")
	$(".tasklist .tasks>h1").html(`<span id="tasks_backBtn" onclick='wap(2)'><</span>${title}-任務　<button id="newTaskBtn" onclick='new_task("${title}")'>+新規</button
>`)
	task_list[title].forEach((x, n) => {
		$(".tasklist .tasks ul").append(
			`<li>
			<div onclick="goon_task('${title}',${n})">
				<h2>${x.task_title}</h2>
				<div class="info">
					<h3>単語数 <span class="word_number">${x.content.length}</span></h3>
					<h3>習熟度 <span class="mastery">${mastery_v(get_task_list(title,n))}</span></h3>
					<h3>前回時間 <span class="last_time">2025/01/01</span></h3>
				</div>
			</div>
		</li>`);
	})
	wap(3)
}

function get_word_bank(title) {
	let target_word_bank
	word_bank.forEach(x => {
		if (x.title == title) target_word_bank = x
	})
	return target_word_bank
}

function get_task_list(title, n) {
	target_word_bank = get_word_bank(title)
	let target_task_list = task_list[title][n].content
	let target_word_list = []
	target_word_bank.content.forEach(x => {
		if (target_task_list.indexOf(x.id) != -1) {
			target_word_list.push(x)
		}
	})
	return target_word_list
}

function goon_task(title, n) {
	start_oboe(get_task_list(title, n), title)
	wap(1)
}

function mastery_v(word_list) {
	let tot = 0;
	word_list.forEach(x => tot += Math.min(x.pt, 9))
	return (tot / (word_list.length * 9) * 100).toFixed(1) + '%';
}
function new_task(title) {
	$('.newtask .tasks ul').html('')
	$('.newtask .tasks h1').html(`<span id="tasks_backBtn" onclick='wap(2)'><</span>${title}-新規任務`)
	get_word_bank(title).content.forEach(x => {
		$('.newtask .tasks ul').append(`<li wordid='${x.id}'>
								<span class='col'>●</span>
								<span class='word'>${x.word}</span>
								<span class='pt'>習熟度：${x.pt}</span>
							</li>`)
	})
	$('#set_task_name').attr('placeholder', (title + " 任務 " + (task_list[title].length + 1)))
	$('.newtask .tasks ul li').on('click', function() {
		$(this).toggleClass('selected')
		$('.newtask .newtask_right span#sel_num').text($('.newtask .tasks ul li.selected').length)
	})
	$('.newtask .newtask_right #newtask_submit').on('click', () => {
		let all_sel_words = []
		document.querySelectorAll('.newtask .tasks ul li.selected').forEach(x => {
			all_sel_words.push(x.getAttribute('wordid'))
		})
		task_list[title].push({
			"task_title": $('#set_task_name').val() == '' ? (title + " 任務 " + (task_list[title].length +
				1)) : $('#set_task_name').val(),
			"content": all_sel_words
		})
		savedata()
		task_show(title)
	})
	wap(4)
}

function savedata() {
	localStorage.setItem('Oboeasy_wordbank', JSON.stringify(word_bank))
	localStorage.setItem('Oboeasy_tasklist', JSON.stringify(task_list))
}

function getdata() {
	word_bank = JSON.parse(localStorage.getItem('Oboeasy_wordbank'))
	task_list = JSON.parse(localStorage.getItem('Oboeasy_tasklist'))
}


function reiji(){
	word_bank = [n3, lecture17, xinbiaori_zhong,lecture18]
	task_list = {
		"N3単語": [],
		"第17課": [],
		"新标日中级": [],
		"第18課": []
	}
	savedata()
	//临时用
}