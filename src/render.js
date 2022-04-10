import config from './config';
import {Dx_keyboard_control} from './dinput';
import {getOffCanvas} from './common';
import {bg_move0, bg_move2} from './bg';
import {Generate_particle, particle_move} from './particle';
import {plane1_move} from './plane';
import {E_A_NUM, E_C_NUM, E_B_NUM, E_D_NUM, enemy_generate, enemy_move1,enemy_move3, enemy_explode, enemy_generate_C, enemy_move2, enemyC_explode, enemy_generate_B, enemy_generate_D, enemy_move4} from './enemy';
import {enemy_bullet_generateB, enemy_bullet_moveB, enemy_bullet_moveC, enemy_bullet_generate, enemy_bullet_move, enemy_bullet_generateC} from './enemy_bullet';
import {bullet1_move, plane_bullet_hit_enemy} from './bullet';

export const canvas = document.getElementById('game-canvas');
export const gd = canvas.getContext('2d'); // 主画布画笔导出

// 百叶窗延时变量
let shutter_cur = 0, shutter_frames = 16;

// 敌人出场的顺序变量
let E_appearance_sequence = 4;
// 控制要产生哪种敌人
let E_generate_now=4; 

export function update(){
	Dx_keyboard_control();
}

export function draw(){
	gd.clearRect(0, 0, canvas.width, canvas.height);
	
	
	switch( config.select_ok ){
		case 0:
			plane_select_display();
		break;
		case 1:
			shutter();
		break;
		case 2:
		// 背景部分
			bg_move0();
			bg_move2();
			
			// 粒子
			Generate_particle();
			particle_move();
			
			//===enemy explode===//
			enemy_explode();
			enemyC_explode();
			
			//===敌人出场的顺序===//
			switch (E_appearance_sequence){
				case 0: // 散弹
					if((E_generate_now==0)&&(config.E_A_count<E_A_NUM))	//限制敌人产生的数量
						enemy_generate();							//敌人
					else
						E_generate_now=1;
					
					enemy_move1();
					enemy_bullet_generateB(); //盾敌人散弹产生
					
					if(config.E_A_count==0)
						E_appearance_sequence=1;
				
				break;
				case 1: //盾普通子弹
					if((E_generate_now==1)&&(config.E_A_count<E_A_NUM))	//限制敌人产生的数量
						enemy_generate();							//敌人
					else
						E_generate_now=2;
					
					enemy_move1();
					enemy_bullet_generate();  //盾敌人普通子弹的产生
					
					if(config.E_A_count==0)
						E_appearance_sequence=2;
				break;
				case 2: //盾圆形
					if((E_generate_now==2)&&(config.E_A_count<E_C_NUM)){	//限制敌人产生的数量
						enemy_generate_C(); 
					}else{
						E_generate_now=3;
					}
					
					enemy_move2();
					
					if(config.E_A_count==0) E_appearance_sequence=3;
					
				break;
				case 3:  //飞机敌人
				if((E_generate_now==3)&&(config.E_A_count<E_B_NUM))	//限制敌人产生的数量
					enemy_generate_B(); 
				else
					E_generate_now=4;
				
				enemy_move3();
				if(config.E_A_count==0) E_appearance_sequence=4;
				
				break;
				case 4: //炮塔
				if((E_generate_now==4)&&(config.E_A_count<E_D_NUM))	//限制敌人产生的数量
					enemy_generate_D();
				else
					E_generate_now=5;
				
				enemy_move4();
				enemy_bullet_generateC();
				
				if( config.E_A_count == 0 ){
					E_appearance_sequence = 5;
				}
				
				break;
			}
			
			//==对象显示和移动==//
			enemy_bullet_moveC(); //炮塔子弹的移动
			enemy_bullet_moveB(); //盾敌人散弹移动
			enemy_bullet_move();	//盾敌人普通子弹的移动
			
			if( lim > 0.1 ){
				limpid();
			}else{
				plane1_move();
			}
			
			bullet1_move(); //飞机子弹的移动
			
			//==飞机子弹击中敌人==//
			plane_bullet_hit_enemy();
			
		break;
	}
	
}


function plane_select_display(){
	
	const {F_S, fs_x,fs_y,fs_w,fs_h} = config;
	
	// 飞机选择背景图
	gd.drawImage( config.Role_bg, 0, 0, 800, 600 );
	
	switch( config.k_id ){ // 代表选择了哪个飞机
		case 0:
		gd.drawImage( F_S[0], fs_x,fs_y,fs_w,fs_h ); // 小图
		gd.drawImage( F_S[3], 70,80,280,210 ); // 大图
		break;
		case 1:
		gd.drawImage( F_S[2], fs_x+250,fs_y,fs_w,fs_h );
		gd.drawImage( F_S[4], 70,80,280,210 );
		break;
		case 2:
		gd.drawImage( F_S[1], fs_x+500,fs_y,fs_w,fs_h );
		gd.drawImage( F_S[5], 70,80,280,210 );
		break;
	}
}


// 百叶窗效果
let leaf = 0;
let tmp_canvas;

function shutter(){
	const {bg_bit, land} = config;
	
	if( leaf == 0 ){
		tmp_canvas = getOffCanvas(canvas.width, canvas.height);
		let tmp_gd = tmp_canvas.getContext('2d');
		
		
		
		
		// 背景
		tmp_gd.drawImage(bg_bit, 0, 0, 800, 600);
		
		// 大地面
		tmp_gd.drawImage(land[0], 0, 470, 800, 130);
		
		// 小地面
		tmp_gd.drawImage(land[1], 0, 530, 800, 70);
		
		//
		
	}
	
	// 600 / 8高度等分成8份作百叶窗
		if( leaf <= 8 ){
			
			for( let y = leaf; y < 600; y += 8 ){
				gd.drawImage( tmp_canvas, 0, y, 800, leaf, 0, y, 800, leaf );
			} // for y over
			
			
			if( (shutter_cur % shutter_frames) == 0 ){			
				leaf ++;
			}
			
			shutter_cur = (shutter_cur+1) % shutter_frames;
			
		}else{
			config.select_ok = 2;
			leaf = 0;
		}
	
}

// 飞机淡入效果
let lim = 1;
let tmp_alpha_canvas;
let init = 0;
let px1Data, px2Data;
let originPixel;

function limpid(){
	const {p_3, P_bitmap} = config;
	
	originPixel = gd.getImageData( p_3[0].p_x, p_3[0].p_y, 110, 90 );
	px1Data = originPixel.data;
	
	if( init == 0 ){
		init = 1;
		// px1Data = gd.getImageData( p_3[0].p_x, p_3[0].p_y, 110, 90 ).data;
		
		
		tmp_alpha_canvas = getOffCanvas(110, 90);
		let tmp_gd = tmp_alpha_canvas.getContext('2d');
		
		if( p_3[0].type == 3 ){
			tmp_gd.drawImage( P_bitmap[0], p_3[0].p_px,p_3[0].p_py,110, 90, 0, 0, 110, 90 );
		}
		
		if( p_3[0].type == 2 ){
			tmp_gd.drawImage( P_bitmap[1], p_3[0].p_px,p_3[0].p_py, 110, 90,0, 0, 110, 90 );
		}
		
		if( p_3[0].type == 1 ){
			tmp_gd.drawImage( P_bitmap[2], p_3[0].p_px,p_3[0].p_py, 110, 90,0, 0, 110, 90 );
		}
		
		
		px2Data = tmp_gd.getImageData(0, 0, 110, 90 ).data;
	}
	
	const bmHeight = tmp_alpha_canvas.height, bmWidth = tmp_alpha_canvas.width;
	
	// 透明工作开始
	for( let yy = 0; yy < bmHeight; yy ++ ){
		for( let xx = 0; xx < bmWidth; xx ++ ){
			
			let startIndex = (yy * bmWidth + xx) * 4;
			let rr = startIndex + 0, gg = startIndex + 1, bb = startIndex + 2;
			if( px2Data[rr] > 1 && px2Data[gg] > 1 && px2Data[bb] > 1 ){
				px1Data[rr] = px2Data[rr] + (px1Data[rr] - px2Data[rr]) * lim;
				px1Data[gg] = px2Data[gg] + (px1Data[gg] - px2Data[gg]) * lim;
				px1Data[bb] = px2Data[bb] + (px1Data[bb] - px2Data[bb]) * lim;
			}
			
		} // for xx over
	} // for yy over
	
	gd.putImageData( originPixel,  p_3[0].p_x, p_3[0].p_y );
	
	if( lim > 0.1 ){
		lim -= 0.005;
	}
}