import config from './config';
import {E_A_NUM, E_A, E_C_NUM, E_C} from './enemy';
import {loadImage, Point} from './common';
import {gd} from './render';
import {wp} from './weapon'

export const BULLET0_NUM = 20;  // 常态子弹数量
const FAST_BULLET0_NUM = 20    // 加速子弹数量
const S_BULLET0_NUM_I = 6; // 散弹
const S_BULLET0_NUM_J = 3;

let p_bulletA = Array(BULLET0_NUM).fill({}).map(_=>({
	x:0, y:0,
	w: 0, h:0, // 常态子弹宽与高
	type: 0, 
	exist:0, 
	p:[{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}],
}));

let p_fw_b = Array(BULLET0_NUM).fill({}).map(_=>({
	x:0, y:0,
	w: 0, h:0, // 加速子弹宽与高
	type: 0, 
	exist:0, 
	p:[{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}],
}));

let p_sw_b = Array( S_BULLET0_NUM_I ).fill([]).map(_=>Array(S_BULLET0_NUM_J).fill([]).map(_=>({
	x:0, y:0,
	w: 0, h:0, // 散弹宽与高
	type: 0, 
	exist:0, 
	p:[{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}],
})));

let generate_delay=0;			//常态子弹产生的延时
let fast_generate_delay=0;		//加速子弹产生的延时
let shotgun_generate_delay=0;	//散弹产生的延时

export let MB_total=900;			//加速子弹的数量
export let MB_total2=900;			//散弹的数量

export function MB_total_minus(){
	MB_total --;
}

export function MB_total2_minus(){
	MB_total2 --;
}

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
		
		//--是否击中盾2(圆形)--//
		if(p_bulletA[i].exist==1){	//飞机子弹存在
			
			for( let j = 0; j < E_C_NUM; j ++ ){
				
				if(E_C[j].exist==1){  //敌人存在
					
					for( let k = 0; k < 8; k ++ ){
						
						if(
								( p_bulletA[i].p[k].x > E_C[j].x )	&&
								( p_bulletA[i].p[k].x < E_C[j].x + E_C[j].w) &&
								( p_bulletA[i].p[k].y > E_C[j].y ) &&
								( p_bulletA[i].p[k].y < E_C[j].y + E_C[j].h)
						  ){
                    		E_C[j].exist=0;	
							E_C[j].dead=1;	
							p_bulletA[i].exist=0;
                     		config.E_A_count--;
							config.score++;
							break;
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

//============
//加速子弹产生
//============
export function fast_bullet_generate(){
	let i = 0;
	const {p_3} = config;
	
	if((MB_total>0)&&(wp.type==1)&&(fast_generate_delay%10==0)){
		
		for( let k = 0; k < FAST_BULLET0_NUM; k ++ ){
			
			if( p_fw_b[k].exist==0 ){
				p_fw_b[k].exist=1;
				p_fw_b[k].x=p_3[i].p_x+wp.w;
				p_fw_b[k].y=p_3[i].p_y+wp.y+wp.h/2-5;
				p_fw_b[k].w=49;
				p_fw_b[k].h=27;
				p_fw_b[k].type=2; // 代表加速子弹
				break;
			}
			
		} // for k over
		
	}
	
	if(fast_generate_delay<10)
	   fast_generate_delay++;
	else
	   fast_generate_delay=1;
	
}

//===============
//加速子弹的移动
//===============
export function fast_bullet1_move(){
	for( let k = 0; k < FAST_BULLET0_NUM; k ++ ){
		
		if(p_fw_b[k].exist==1){
			if(p_fw_b[k].x<800){
				p_fw_b[k].x=p_fw_b[k].x+5;
				
				gd.drawImage(
					config.bullet_bitmap[1],
					0,0,p_fw_b[k].w,p_fw_b[k].h,
					p_fw_b[k].x,p_fw_b[k].y, p_fw_b[k].w,p_fw_b[k].h
				);
			}else{
				p_fw_b[k].exist=0; // 子弹飞出边界了, exist置为0,从而生成后续的加速子弹
			}
		} // end if p_fw_b[k].exist==1
		
	} // for k over
}

//============
//散弹产生
//============
export function shotgun_bullet_generate(){
	let three_ok = 0; //标识现在找到3颗不存在子弹
	let i = 0;
	
	if( ( MB_total2 > 0 ) && ( wp.type == 2 ) && (shotgun_generate_delay % 60 == 0) ){
		for( let j = 0; j < S_BULLET0_NUM_I; j ++ ){
			for( let k = 0; k < S_BULLET0_NUM_J; k ++ ){
				if(p_sw_b[j][k].exist==0){
					//确保这一行中有3个空位
					three_ok ++;
				} 
			} // for k over
			
			if( three_ok >= 3 ){
				for( let k = 0; k < 3; k ++ ){
					p_sw_b[j][k].exist=1;
					p_sw_b[j][k].x=config.p_3[i].p_x+wp.w;
					p_sw_b[j][k].y=config.p_3[i].p_y+wp.y+wp.h/2-10;
					p_sw_b[j][k].w=40;
					p_sw_b[j][k].h=25;
					p_sw_b[j][k].type=3;
				} // for k over
				break;
			}
			
			three_ok = 0;
			
			
		} // for j over
	}
	
	if( shotgun_generate_delay < 60 ){
		shotgun_generate_delay ++;
	}else{
		shotgun_generate_delay = 1;
	}
}

//============
//散弹移动
//============
export function shotgun_bullet_move(){
	let xx = 0, yy = 0; //决定出现那一个散弹图
	
	for( let i = 0; i < S_BULLET0_NUM_I; i ++ ){
		for( let j = 0; j < S_BULLET0_NUM_J; j ++ ){
			if(p_sw_b[i][j].exist==1){
				// j: 决定子弹的方向
				switch( j ){
					case 0:
						p_sw_b[i][j].x=p_sw_b[i][j].x+2;
						p_sw_b[i][j].y=p_sw_b[i][j].y-1;
						xx=0;
					break;
					case 1:
						p_sw_b[i][j].x=p_sw_b[i][j].x+2;
						xx=40;
					break;
					case 2:
						p_sw_b[i][j].x=p_sw_b[i][j].x+2;
						p_sw_b[i][j].y=p_sw_b[i][j].y+1;
						xx=80;
					break;
				}
				
				if( p_sw_b[i][j].x >= 700 
					||
					p_sw_b[i][j].y < 100
					||
					p_sw_b[i][j].y > 500
				){
					p_sw_b[i][j].exist = 0;
				}
				
				// 绘制
				gd.drawImage(
					config.bullet_bitmap[2],
					xx, yy, p_sw_b[i][j].w,p_sw_b[i][j].h,
					p_sw_b[i][j].x,p_sw_b[i][j].y,
					p_sw_b[i][j].w,p_sw_b[i][j].h
				);
			}
		} // for j over
	}// for i over
	
}