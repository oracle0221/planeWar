import config from './config';
import {loadImage} from './common';
import {gd} from './render';

const P_NUM = config.P_NUM, p_3 = config.p_3, k_id = config.k_id;

class Rect{
	top=0;
	left=0;
	bottom=0;
	right=0;
}

// 加载飞机图片
export async function plane_select_load(){
	
	await Promise.all([
		loadImage('role_s_bg'),
		loadImage('Fs_1'),
		loadImage('Fs_2'),
		loadImage('Fs_3'),
		loadImage('UI_F01'),
		loadImage('UI_F02'),
		loadImage('UI_F03'),
	]).then(data=>{
		config.Role_bg = data[0];
		config.F_S[0] = data[1];
		config.F_S[1] = data[2];
		config.F_S[2] = data[3];
		config.F_S[3] = data[4];
		config.F_S[4] = data[5];
		config.F_S[5] = data[6];
	});
}

export async function plane_bitmap_load(){
	await Promise.all([
		//红色飞机图
		loadImage('F_1'),
		// 绿色飞机
		loadImage('F_2'),
		// 蓝色飞机
		loadImage('F_0'),
	]).then(data=>{
		config.P_bitmap[0] = data[0];
		config.P_bitmap[1] = data[1];
		config.P_bitmap[2] = data[2];
	});
}

export function plane_generate(){
	for( let i = 0; i < P_NUM; i ++ ){
		
		if( !p_3[i] ){
			p_3[i] = {
				r:[ new Rect(), new Rect(), new Rect(), new Rect(), new Rect(), new Rect() ],
			};
			
			p_3[i].time = 0; //飞机各状态的延时
			p_3[i].p_x	  =0;
			p_3[i].p_y	  =300;
			p_3[i].w	  =110; //飞机的宽
			p_3[i].h	  =90; //飞机的高
			p_3[i].p_px	  =0;
			p_3[i].p_py	  =0;
			p_3[i].exist  =1;  //是否存在
			if(k_id==0)
				p_3[i].type	  =1; //飞机类型
			if(k_id==1)
				p_3[i].type	  =2;
			if(k_id==2)
				p_3[i].type	  =3;
			p_3[i].boold_count =18; // 飞机的生命值
			break;
		}
		
	} // for i over
	
}

export function plane1_move(){
	if( p_3[0].exist == 1 ){
		let which_img;
		if( p_3[0].type == 3 ){ //红色飞机
			which_img = 0;
		}
		
		if( p_3[0].type == 2 ){ //绿色飞机
			which_img = 1;
		}
		
		if( p_3[0].type == 1 ){ //蓝色飞机
			which_img = 2;
		}
		
		// 碰区的移动
		//碰区1
		p_3[0].r[0].left=p_3[0].p_x+8;
		p_3[0].r[0].top=p_3[0].p_y+10;
		p_3[0].r[0].right=p_3[0].p_x+16;
		p_3[0].r[0].bottom=p_3[0].p_y+23;
	  //碰区2
		p_3[0].r[1].left=p_3[0].p_x+17;
		p_3[0].r[1].top=p_3[0].p_y+17;
		p_3[0].r[1].right=p_3[0].p_x+25;
		p_3[0].r[1].bottom=p_3[0].p_y+23;
	  //碰区3
		p_3[0].r[2].left=p_3[0].p_x+12;
		p_3[0].r[2].top=p_3[0].p_y+26;
		p_3[0].r[2].right=p_3[0].p_x+48;
		p_3[0].r[2].bottom=p_3[0].p_y+36;
	  //碰区4
		p_3[0].r[3].left=p_3[0].p_x+51;
		p_3[0].r[3].top=p_3[0].p_y+30;
		p_3[0].r[3].right=p_3[0].p_x+103;
		p_3[0].r[3].bottom=p_3[0].p_y+40;
	  //碰区5
		p_3[0].r[4].left=p_3[0].p_x+30;
		p_3[0].r[4].top=p_3[0].p_y+40;
		p_3[0].r[4].right=p_3[0].p_x+63;
		p_3[0].r[4].bottom=p_3[0].p_y+44;
	  //碰区6
		p_3[0].r[5].left=p_3[0].p_x+48;
		p_3[0].r[5].top=p_3[0].p_y+45;
		p_3[0].r[5].right=p_3[0].p_x+62;
		p_3[0].r[5].bottom=p_3[0].p_y+58;
		
		gd.drawImage( config.P_bitmap[which_img], p_3[0].p_px,p_3[0].p_py, p_3[0].w, p_3[0].h, p_3[0].p_x, p_3[0].p_y,
						  p_3[0].w,   p_3[0].h );
	}
}