import {loadImage} from './common';
import config from './config';
import {gd} from './render';


export async function bg_bitmap_load(){
	await Promise.all([
		loadImage('bg0'),
		loadImage('land_1A'),
		loadImage('land_1B'),
		loadImage('land_2A'),
		loadImage('land_2B'),
	]).then(data=>{
		config.bg_bit = data[0];
		config.land[0] = data[1];
		config.land[1] = data[2];
		config.land[2] = data[3];
		config.land[3] = data[4];
	});
}

let x_bg = 0;

// 背景移动
export function bg_move0(){
	const {bg_bit} = config;
	// gd.drawImage( bg_bit,0, 0, 800, 600 );
	
	gd.drawImage( bg_bit, 0, 0, 800, 600, x_bg, 0, 800, 600 );
	gd.drawImage( bg_bit, 800 - x_bg, 0, x_bg, 600, 0, 0, x_bg, 600 );
	
	x_bg = (x_bg + 1) % 800;
}

//背景地面移（大）
//----背景地面(大)----//
let		bg_2Ax=0;    
let		bg_2Bx=800;
let		a2=0;
let		c2=1;
let		bg2_delay=0;

export function bg_move2(){
	const {land} = config;
	let middle = 0;
	gd.drawImage( land[a2], 0, 0, 800 - bg_2Ax, 130, bg_2Ax, 470, 800 - bg_2Ax, 130 );
	
	if( bg_2Ax > 0 ){
		gd.drawImage( land[c2], bg_2Bx, 0, 800-bg_2Bx, 130,  0, 470, 800-bg_2Bx, 130 );
	}
	
	if( bg_2Ax >= 800 ){
	   bg_2Ax=0;
	   bg_2Bx=800;
	   middle=a2;
	   a2=c2;
	   c2=middle;
	   bg2_delay=0;
	}
	
	if( bg2_delay % 3 == 0 ){
		bg_2Ax = (bg_2Ax + 2)
		bg_2Bx = (bg_2Bx - 2);
		bg2_delay = 0;
	}
	bg2_delay ++;
}


//----背景地面(细)----//
let		bg_1Ax=0;    
let		bg_1Bx=797;
let		a1=2;
let		b1=3;
// config.land[2], config.land[3]

//------------------
//背景地面移（细）
//------------------
export function bg_move1(){
	let middle1 = 0;
	
	// 绘画
	gd.drawImage(
		config.land[a1],
		bg_1Ax,0, 800,70,
		0,530,800,70
	);
	
	if( bg_1Ax > 0 ){
		gd.drawImage(
			config.land[b1],
			0,0, 800,70,
			bg_1Bx,530,800, 70
		);
	}
	
	if( bg_1Ax >= 797 ){
		bg_1Ax = 0;
		bg_1Bx = 797;
		
		middle1 = a1;
		a1 = b1;
		b1 = middle1;
		
	}
	
	bg_1Bx -= 3;
	bg_1Ax += 3;
}