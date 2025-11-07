word_bank = []
task_list = []
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
	$(".tasklist .tasks>h1").html(`<span id="tasks_backBtn" onclick='wap(2)'><</span>${title}-課題　<button id="newTaskBtn" onclick='new_task("${title}")'>+新規</button
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
	$('.newtask .tasks h1').html(`<span id="tasks_backBtn" onclick='wap(2)'><</span>${title}-課題の新規作成`)
	get_word_bank(title).content.forEach(x => {
		$('.newtask .tasks ul').append(`<li wordid='${x.id}' wordpt='${x.pt}'>
								<span class='col'>●</span>
								<span class='word'>${x.word}</span>
								<span class='pt'>習熟度：${x.pt}</span>
							</li>`)
	})
	$('#set_task_name').attr('placeholder', (title + " 課題 " + (task_list[title].length + 1)))
	let num = 0;
	$('.newtask .tasks ul li').on('click', function() {
		if ($(this).hasClass('selected')) num -= 1;
		else num += 1;
		$(this).toggleClass('selected')
		$('.newtask .newtask_right span#sel_num').text(num)
	})
	$('.newtask .newtask_right #newtask_submit')[0].onclick = () => {
		let all_selected_words = []
		$('.newtask .tasks ul li.selected').each(function(){
			all_selected_words.push($(this).attr('wordid'))
		})
		task_list[title].push({
			"task_title": $('#set_task_name').val() == '' ? (title + " 課題 " + (task_list[title].length +
				1)) : $('#set_task_name').val(),
			"content": all_selected_words
		})
		savedata()
		task_show(title)
	}
	$('.newtask .newtask_right #fast_select')[0].onclick = () => {
		$('.newtask .tasks ul li').removeClass('selected')
		let cnt = 0,
			number_limit = $('#newtask_number_limit').val()
		$('.newtask .tasks ul li').each(function() {
			if (parseInt($(this).attr('wordpt')) <= parseInt($('#newtask_mastery_limit').val())) {
				if (cnt < number_limit) {
					$(this).addClass('selected')
					cnt++
				}
			}
		})
	}

	wap(4)
}