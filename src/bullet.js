import config from './config';
import {E_A_NUM, E_A} from './enemy';
import {loadImage, Point} from './common';
import {gd} from './render';

export const BULLET0_NUM = 20;  // 常态子弹数量

let p_bulletA = Array(BULLET0_NUM).fill({}).map(_=>({
	x:0, y:0,
	w: 0, h:0, // 常态子弹宽与高
	type: 0, 
	exist:0, 
	p:[{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}],
}));

let generate_delay=0;			//常态子弹产生的延时


export async function bullet_bitmap_load(){
	
	await Promise.all([
		loadImage('B_2'),
		loadImage('G_B1'),
		loadImage('G_B2'),
	]).then(data=>{
		config.bullet_bitmap[0] = data[0];
		config.bullet_bitmap[1] = data[1];
		config.bullet_bitmap[2] = data[2];
	});
}

export function bullet_generate(){
	const {p_3} = config;
	let i = 0;
	
	for( let k = 0; k < BULLET0_NUM; k ++ ){
		
		if( ( p_bulletA[k].exist == 0 ) && ( generate_delay%10==0 ) ){
			   p_bulletA[k].exist=1;
			   p_bulletA[k].x=p_3[i].p_x+p_3[i].w-15;
			   p_bulletA[k].y=p_3[i].p_y+p_3[i].h/4+10;
			   p_bulletA[k].w=49;
			   p_bulletA[k].h=27;
			   p_bulletA[k].type=1;
			   break;
		}
		
	} // for k over
	
	if(generate_delay<10)
	   generate_delay++;
	else
	   generate_delay=1;
}


//============
//子弹的移动
//============
export function bullet1_move(){
	
	// 子弹图片
	const bulletImg = config.bullet_bitmap[0];
	
	for( let k = 0; k < BULLET0_NUM; k ++ ){
		
		if(p_bulletA[k].exist==1){
			if(p_bulletA[k].x<700){
				p_bulletA[k].x=p_bulletA[k].x+5;
				
				//碰点1
   					p_bulletA[k].p[0].x  =p_bulletA[k].x+39;
					p_bulletA[k].p[0].y  =p_bulletA[k].y+6;
				//碰点2
					p_bulletA[k].p[1].x  =p_bulletA[k].x+44;
					p_bulletA[k].p[1].y  =p_bulletA[k].y+13;
				//碰点3
					p_bulletA[k].p[2].x  =p_bulletA[k].x+40;
					p_bulletA[k].p[2].y  =p_bulletA[k].y+21;
				//碰点4
					p_bulletA[k].p[3].x  =p_bulletA[k].x+28;
					p_bulletA[k].p[3].y  =p_bulletA[k].y+23;
				//碰点5
					p_bulletA[k].p[4].x  =p_bulletA[k].x+27;
					p_bulletA[k].p[4].y  =p_bulletA[k].y+4;
				//碰点6
					p_bulletA[k].p[5].x  =p_bulletA[k].x+13;
					p_bulletA[k].p[5].y  =p_bulletA[k].y+19;
				//碰点7
					p_bulletA[k].p[6].x  =p_bulletA[k].x+13;
					p_bulletA[k].p[6].y  =p_bulletA[k].y+7;
				//碰点8
					p_bulletA[k].p[7].x  =p_bulletA[k].x+14;
					p_bulletA[k].p[7].y  =p_bulletA[k].y+14;
				
				gd.drawImage(
					bulletImg,
					0, 0, p_bulletA[k].w,p_bulletA[k].h,
					p_bulletA[k].x,p_bulletA[k].y,
					p_bulletA[k].w,p_bulletA[k].h,
				);
			}else{
				p_bulletA[k].exist = 0;
			}
		}
		
	} // for k over
	
}

//==================
//飞机子弹击中敌人
//==================

export function plane_bullet_hit_enemy(){
	
	for( let i = 0; i < BULLET0_NUM; i ++ ){
		
		if( p_bulletA[i].exist == 1 ){ // 飞机子弹存在
			
			for( let j = 0; j < E_A_NUM; j ++ ){
				
				if( E_A[j].exist == 1 ){ // 敌人存在
					// 遍历子弹碰区 8个
					for( let k = 0; k < 8; k ++ ){
						
						if(
							( p_bulletA[i].p[k].x > E_A[j].x )	&&
							( p_bulletA[i].p[k].x < E_A[j].x + E_A[j].w) &&
							( p_bulletA[i].p[k].y > E_A[j].y ) &&
							( p_bulletA[i].p[k].y < E_A[j].y + E_A[j].h)
						){
							E_A[j].exist=0;	
							E_A[j].dead=1;	
							p_bulletA[i].exist=0;
          					config.E_A_count--;
							config.score ++;
						}
						
					} // for k over
				}
				
				if( p_bulletA[i].exist == 0 ){
					break;
				}
				
			} // for j over
			
		}
		
	} // for i over
	
}