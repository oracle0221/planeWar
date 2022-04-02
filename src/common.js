import {gd, canvas} from './render';

const imgRoot = window.location.origin+'/bmp/';

export function loadImage( url ){

	return new Promise((resolve, reject)=>{
		let oImg = new Image();
		oImg.onload = ()=>{
			resolve(oImg);
		};
		oImg.onerror = reject;
		oImg.src = imgRoot + url+'.png';
	});
}

// 创建临时画笔, 用于离屏渲染
export function getOffCanvas(w, h){
	const tmp_canvas = document.createElement('canvas');
	tmp_canvas.width = w;
	tmp_canvas.height = h;
	return tmp_canvas;
}

// 取随机数
export function rand(N){
	return Math.floor((N+1) * Math.random());
}

export class Point{
	x=0
	y=0
}