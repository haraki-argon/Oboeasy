
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
	word_bank = []
	task_list = {
	}
	savedata()
	//临时用
}
