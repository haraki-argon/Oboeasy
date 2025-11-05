var oboe_word;
var selected_n = -1;

function oboe(word, count) {
	return new Promise((resolve) => {
		$('.write .right p#yomikata,.write .right p#kakikata').hide()
		$('.write .right p#hint').text(word.meaning)
		$('.write .right p#yomikata').text(word.yomikata)
		$('.write .right p#kakikata').text(word.word)
		$('.write .left ul li').fadeOut("fast")
		$('.write #nextBtn').attr('disabled', 'true')
		$('#num').text(String(count).padStart(3, '0'))
		selected_n = -1;
		oboe_word = word;
		document.querySelector('.write #nextBtn').onclick = ()=>{resolve()}
	})
}
['remember','tochuu','forgot'].forEach((s,n)=>{
	$('.write .left li#'+s).on('click', () => {
		$('.write #nextBtn').removeAttr('disabled')
		$('.write .left ul li').removeClass('selected')
		$('.write .left li#'+s).addClass('selected')
		selected_n = n
	})
})
$('.write #checkBtn').on('click', () => {
	$('.write .left ul li').fadeIn('fast')
	$('.write .left #clearBtn').attr('disabled','true')
	$('.write .right p#yomikata,.write .right p#kakikata').fadeIn('fast')
	ctx.strokeStyle = '#d3361a';
})
async function start_oboe(list,title){
	for(let i=0;i<list.length;i++){
		await oboe(list[i], i)
		console.log(selected_n);
		switch(selected_n){
			case 0:{
				list[i].pt+=3
				break
			}
			case 1:{
				list[i].pt+=1
				break
			}
			case 2:{
				list[i].pt+=-1
				break
			}
		}
		savedata()
		clearCanvas()
		$('.write .left ul li').removeClass('selected')
		$('.write .left #clearBtn').removeAttr('disabled')
		ctx.strokeStyle = 'black';
	}
	task_show(title)
}