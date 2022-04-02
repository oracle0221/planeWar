import {rand} from './common';
import {gd} from './render';

let star = Array(100).fill({}).map(_=>({
	x:null,y:null, //星星的x, y坐标
	w:null, h: null, //星星的宽和高
	vx:null, vy:null,
	exist: 0, // 星星是否存在
	life:0,
	type:null,
}));

// 游戏中的粒子, 流星
export function Generate_particle(){
	for( let i = 0; i < star.length; i ++ ){
		if( star[i].exist == 0 ){
			star[i].exist = 1;
			star[i].x = rand(800);
			star[i].y = rand(600);
			
			
			if( rand(10) == 5 ){
				star[i].type = 1; // 圆圈
			}else{
				star[i].type = 0; // 打点
			}
		}
	} // for i over
}

export function particle_move(){
	
	for( let i = 0; i < star.length; i ++ ){
		
		if( star[i].exist == 1 ){
			
			if( star[i].x > 0 ){
				if( star[i].type == 0 ){
					star[i].x = star[i].x - 5;
				}else{
					star[i].x = star[i].x - 1;
				}
			}else{
				star[i].exist = 0;
			}
			
			if( star[i].exist == 1 ){
				if( rand(2) == 0 ){
					star[i].w=.5;
					star[i].h=.5;
				}else{
					star[i].w=1;
					star[i].h=1;
				}
			}
			
			if( star[i].exist == 1 ){
				if( star[i].type == 1 ){
					// circle
					gd.beginPath();
					gd.fillStyle = 'rgba(255, 255, 255, 0.6)';
					gd.arc( star[i].x, star[i].y, star[i].w, 0, Math.PI * 2 );
					gd.fill();
				}
				
				if( star[i].type == 0 ){
					// point
					gd.beginPath();
					gd.fillStyle = 'rgba(255, 255, 255, 0.6)';
					gd.arc( star[i].x, star[i].y, star[i].w, 0, Math.PI * 2 );
					gd.fill();
				}
			}
			
		} // end if star[i].exist
		
	} // for i over
}