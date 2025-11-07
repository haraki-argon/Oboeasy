/**
 * 获取 GitHub Pages 文件（带缓存和重试）
 * @param {string} url - 文件URL
 * @param {number} maxRetries - 最大重试次数
 * @param {number} timeout - 超时时间(毫秒)
 * @returns {Promise<string>} 文件内容
 */
async function fetchdata(url, maxRetries = 3, timeout = 10000) {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response = await fetch(url, {
				signal: controller.signal,
				cache: 'force-cache' // 使用缓存
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.text();

		} catch (error) {
			console.warn(`第 ${attempt} 次尝试失败:`, error.message);

			if (attempt === maxRetries) {
				throw new Error(`获取文件失败，已重试 ${maxRetries} 次: ${error.message}`);
			}

			// 指数退避
			await new Promise(resolve =>
				setTimeout(resolve, 1000 * Math.pow(2, attempt))
			);
		}
	}
}
var data_list_json;
function load_wordbank() {
	$('.download .worddata .download_left ul').html('')
	fetchdata('https://haraki-argon.github.io/Oboeasy/data_list.json')
		.then(content => {
			let content_struct=JSON.parse(content)
			data_list_json=content_struct
			content_struct.forEach((x,n)=>{
				$('.download .worddata .download_left ul').append(`<li onclick='goon_download(${n})'>
				<span>${x.title}</span>
				</li>`)
			})
			
		})
		.catch(error => {
			console.error('错误:', error);
		});
	
}
wap_callback[5]=load_wordbank

function goon_download(n){
	$('.download .worddata .download_left ul li').eq(n).addClass("selected").siblings().removeClass("selected")
	$('.download_right p.title').text(data_list_json[n].title)
	$('.download_right p.detail').text(data_list_json[n].detail)
	$('.download_right p.word_number').text("単語数："+data_list_json[n].word_number)
	$('.download_right #download_submitBtn')[0].onclick=()=>{
		fetchdata('https://haraki-argon.github.io/Oboeasy/data/'+data_list_json[n].filename)
		.then(content=>{
			let content_struct=JSON.parse(content)
			word_bank.push(content_struct)
			task_list[content_struct.title]=[]
			savedata()
			wap(2)
		})
		
	}
}