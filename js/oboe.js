var oboe_word;
var selected_n = -1;

function oboe(word, count) {
	return new Promise((resolve) => {
		document.querySelector('.write .right p#yomikata').style.display = 'none'
		document.querySelector('.write .right p#kakikata').style.display = 'none'
		document.querySelector('.write .right p#hint').innerHTML = word.meaning
		document.querySelector('.write .right p#yomikata').innerHTML = word.yomikata
		document.querySelector('.write .right p#kakikata').innerHTML = word.word
		document.querySelectorAll('.write .left ul li').forEach(x => x.style.display = 'none')
		document.querySelector('.write #nextBtn').setAttribute('disabled', 'true')
		selected_n = -1;
		oboe_word = word;
		document.querySelector('.write #nextBtn').onclick = ()=>{resolve()}
	})
}
document.querySelector('.write .left li#remember').addEventListener('click', () => {
	document.querySelector('.write #nextBtn').removeAttribute('disabled')
	document.querySelectorAll('.write .left ul li').forEach(x => x.classList.remove('selected'))
	document.querySelector('.write .left li#remember').classList.add('selected')
	selected_n = 1
})
document.querySelector('.write .left li#tochuu').addEventListener('click', () => {
	document.querySelector('.write #nextBtn').removeAttribute('disabled')
	document.querySelectorAll('.write .left ul li').forEach(x => x.classList.remove('selected'))
	document.querySelector('.write .left li#tochuu').classList.add('selected')
	selected_n = 2
})
document.querySelector('.write .left li#forgot').addEventListener('click', () => {
	document.querySelector('.write #nextBtn').removeAttribute('disabled')
	document.querySelectorAll('.write .left ul li').forEach(x => x.classList.remove('selected'))
	document.querySelector('.write .left li#forgot').classList.add('selected')
	selected_n = 3
})
document.querySelector('.write #checkBtn').addEventListener('click', () => {
	document.querySelectorAll('.write .left ul li').forEach(x => x.style.display = 'inline-block')
	document.querySelector('.write .right p#yomikata').style.display = 'block'
	document.querySelector('.write .right p#kakikata').style.display = 'block'
})
//test
async function hajime() {
	for (let i = 0; i < n3.content.length; i++) {
		await oboe(n3.content[i], i)
		console.log(selected_n);
		clearCanvas()
		document.querySelectorAll('.write .left ul li').forEach(x => x.classList.remove('selected'))
	}
}
hajime()
