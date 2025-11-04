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
		document.querySelector('#num').innerHTML=String(count).padStart(3, '0');
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
	document.querySelector('.write .left #clearBtn').setAttribute('disabled','true')
	document.querySelector('.write .right p#yomikata').style.display = 'block'
	document.querySelector('.write .right p#kakikata').style.display = 'block'
	ctx.strokeStyle = '#d3361a';
})
async function start_oboe(list){
	for(let i=0;i<list.length;i++){
		await oboe(list[i], i)
		console.log(selected_n);
		clearCanvas()
		document.querySelectorAll('.write .left ul li').forEach(x => x.classList.remove('selected'))
		document.querySelector('.write .left #clearBtn').removeAttribute('disabled')
		ctx.strokeStyle = 'black';
	}
}

start_oboe(lecture17.content)