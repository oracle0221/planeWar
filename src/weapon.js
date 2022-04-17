import config from './config';
import {loadImage} from './common';
import {gd} from './render';

class Weapon{
	x = 0
	y = 0
	w = 0
	h = 0
	type = 0
	exist = 0
	px = 0
	py = 0
	change_delay = 0
}

export let wp = new Weapon();

export async function weapon_bitmap_load(){
	const {W} = config;
	
	await Promise.all([
		loadImage('Gun_0'),
		loadImage('Gun_2'),
		loadImage('Gun_3')
	]).then(data=>{
		W[0] = data[0]
		W[1] = data[1]
		W[2] = data[2]
	});
}


export function weapon_display(){
	const {p_3, W} = config;
	
	let i = 0;
	
	// let a = 0, b = 0;
	wp.exist = 1;
	
	//主角类型及武器的坐标
	if((p_3[i].exist==1)&&(wp.exist==1)){
		
		switch( wp.type ){
			case 1:
				wp.w = 100;
				wp.h = 20;  // 宽与高
				break;
			case 2:
				wp.w=75;
				wp.h=43;
				break;
			case 3:
				wp.w=50;
				wp.h=28;
				break;
		}
		
		wp.x=35;          //武器与飞机结合的位置
		wp.y=50;
		
		 //(武器图的出现)	
		 switch(wp.type){                    //每个主角的大小都不同所以武器的坐标也要相应的改变
			case 1:
				gd.drawImage(
					W[0],
					wp.px,wp.py,wp.w,wp.h,
					p_3[i].p_x+wp.x,p_3[i].p_y+wp.y,wp.w,wp.h
				);
			break;
			case 2:
				gd.drawImage(
					W[1],
					wp.px,wp.py,wp.w,wp.h,
					p_3[i].p_x+wp.x,p_3[i].p_y+wp.y,wp.w,wp.h
				);
			break;
			case 3:
				gd.drawImage(
					W[2],
					wp.px,wp.py,wp.w,wp.h,
					p_3[i].p_x+wp.x,p_3[i].p_y+wp.y,wp.w,wp.h
				);
			break;
		 }
	} // if((p_3[i].exist==1)&&(wp.exist==1))
	
}