
getdata()

function savedata() {
	localStorage.setItem('Oboeasy_wordbank', JSON.stringify(word_bank))
	localStorage.setItem('Oboeasy_tasklist', JSON.stringify(task_list))
}

function getdata() {
	word_bank = JSON.parse(localStorage.getItem('Oboeasy_wordbank'))
	task_list = JSON.parse(localStorage.getItem('Oboeasy_tasklist'))
}


function reiji() {
	word_bank = [n3, lecture17, xinbiaori_zhong, lecture18]
	task_list = {
		"N3単語": [],
		"第17課": [],
		"新标日中级": [],
		"第18課": []
	}
	savedata()
	//临时用
}
