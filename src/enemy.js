import {loadImage} from './common';
import config from './config';
import {gd} from './render';


export const E_A_NUM = 2; //盾的数量
export const E_C_NUM = 32	    //盾的数量(圆形)
export const E_B_NUM = 6		//飞机
export const  E_D_NUM = 3		//炮塔
export const E_BIT_NUM = 3;  // 敌人图片数量

class Point{
	x=0
	y=0
}

class Enemy_data{
	exist = 0 // 是否存在
	x=0
	y=0
	w=0
	h=0
	px=0
	py=0
	
	dead = 0 // 用于标识爆炸动画的开始
	A_delay= 0 //用于画动延时
	A_change= 0 //用于画动切换
	explode_delay= 0 //用于爆炸动画的延时
	explode_px= 0 //用于控制敌人爆炸的动画显示
	explode_py= 0
	
	p=[ new Point(), new Point(), new Point(), new Point(),new Point(), new Point(), new Point(), new Point(), ] // 碰撞区和碰撞点
	
	generate_delay=0
	
	r= 0  //圆形的半径
	angle= 0 //转动的角度
	run_type= 0 //飞机的运动路径
	pause= 0 //停留点
	move_delay= 0 //移动延时
	L=0 //炮塔向左
	R=0 //炮塔向右
}

let E_bitmap = [];
let E_explode = [];

let arrive	  = 0;			//走圆形路径的敌人是否全都到达集合的位置
let diffuse	  = 0;			//扩大缩小的标志


export let E_A = Array(E_A_NUM).fill({}).map(_=>new Enemy_data());

export let E_C = Array(E_C_NUM).fill({}).map(_=>new Enemy_data());


export async function enemy_bitmap_load(){
	await Promise.all([
		loadImage( 'E_0' ),
		loadImage( 'E_1' ),
		loadImage( 'E_5' ),
		loadImage( 'B1' ),
	]).then(data=>{
		//盾
		E_bitmap[0] = data[0];
		//飞机
		E_bitmap[1] = data[1];
		//炮塔
		E_bitmap[2] = data[2];
		//爆炸
		E_explode[0] = data[3];
	});
}

//--盾敌人--//
export function enemy_generate(){
	for( let i = 0; i <  E_A_NUM; i ++ ){
		if( E_A[i].exist == 0 && E_A[i].dead == 0 ){
			E_A[i].y=0;
			E_A[i].x=0;

		   if(i==0)                        //为了上下距离不要太近
			  E_A[i].y    =E_A[i].y+180;
		   else
			  E_A[i].y    =E_A[i].y+350;

			E_A[i].x	  =800;
			E_A[i].w	  =80;
			E_A[i].h	  =80;
			E_A[i].px	  =0;
			E_A[i].py	  =0;
			E_A[i].exist  =1;   
			E_A[i].generate_delay =1;
			E_A[i].A_delay =0;			//用于动画的延时
			E_A[i].A_change=0;			    //用于动画的切换
			E_A[i].explode_delay=0;		//爆炸动画的延时
			E_A[i].dead=0;				//用于标识爆炸
			config.E_A_count++;
		}
	}
}

//--盾敌人--//
export function enemy_move1(){
	
	for( let i = 0; i < E_A_NUM; i ++ ){
		if( E_A[i].exist == 1 ){
			if(E_A[i].x>550)
				 E_A[i].x=E_A[i].x-2;
			else{
				//盾敌人的动画控制
				if( E_A[i].A_delay%30==0 ){
					
					if( E_A[i].px < 480 && E_A[i].A_change == 0 ){
						E_A[i].px += E_A[i].w;
					}else{
						E_A[i].A_change = 1;
					}
					
					if( E_A[i].px > 240 && E_A[i].A_change == 1 ){
						E_A[i].px -= E_A[i].w;
					}else{
						E_A[i].A_change = 0;
					}
					
					E_A[i].A_delay = 0;
				}
				
				E_A[i].A_delay++;
			}
			
			// 显示敌人
			gd.drawImage( E_bitmap[0], 
				E_A[i].px, E_A[i].py, E_A[i].w, E_A[i].h,
				E_A[i].x, E_A[i].y,  E_A[i].w, E_A[i].h,
			);
			
			//碰点1
			  E_A[i].p[0].x=E_A[i].x+27;
			  E_A[i].p[0].y=E_A[i].y+7;
			  //碰点2
			  E_A[i].p[1].x=E_A[i].x+35;
			  E_A[i].p[1].y=E_A[i].y+67;
			  //碰点3
			  E_A[i].p[2].x=E_A[i].x+25;
			  E_A[i].p[2].y=E_A[i].y+32;
			  //碰点4
			  E_A[i].p[3].x=E_A[i].x+51;
			  E_A[i].p[3].y=E_A[i].y+31;
			  //碰点5
			  E_A[i].p[4].x=E_A[i].x+16;
			  E_A[i].p[4].y=E_A[i].y+31;
			  //碰点6
			  E_A[i].p[5].x=E_A[i].x+27;
			  E_A[i].p[5].y=E_A[i].y+51;
			  //碰点7
			  E_A[i].p[6].x=E_A[i].x+43;
			  E_A[i].p[6].y=E_A[i].y+46;
			  //碰点8
			  E_A[i].p[7].x=E_A[i].x+40;
			  E_A[i].p[7].y=E_A[i].y+17;
			
		}
	}
	
}

//--盾敌人 爆炸--//
export function enemy_explode(){
	
	for( let i = 0; i < E_A_NUM; i ++ ){
		
		//--盾1--//
		if( E_A[i].dead == 1 ){
			E_A[i].explode_delay ++;
			if(E_A[i].explode_delay % 2 == 0){
				
				// 爆炸图子图宽 128
				if(E_A[i].explode_px<896){
					E_A[i].explode_px=E_A[i].explode_px+128;
				}else{
				   if(E_A[i].explode_py==0){
					 E_A[i].explode_px=0;
					 E_A[i].explode_py=135;
				   }else{
					  E_A[i].explode_px=0;
					  E_A[i].explode_py=0;
					  E_A[i].dead=0;
					  //E_A->explode_delay=0;
				   }
				}
				
				gd.drawImage( E_explode[0],
					E_A[i].explode_px, E_A[i].explode_py,
					128,135,
					E_A[i].x,E_A[i].y,
					128,135
				);
				
				E_A[i].explode_delay=0;
			} // if(E_A[i].explode_delay % 2 == 0)
		} // if( E_A[i].dead == 1 )
		
	} // for i over
	
}

//--盾敌人圆形--//
export function enemy_generate_C(){
	
	let angle = 0;
	for( let i = 0; i < E_C_NUM; i ++ ){
		
		if( (E_C[i].exist==0)&&(E_C[i].dead==0) ){
			 E_C[i].exist	=1;
			 E_C[i].r		=1;
			 E_C[i].angle	=angle;
			 E_C[i].x		=800;
			 E_C[i].y		=300;    
			 E_C[i].w		=80;
			 E_C[i].h		=80;
			 E_C[i].px		=0;
			 E_C[i].py		=0;
			 E_C[i].dead	=0;
			 E_C[i].explode_delay	=0;
			 angle += 0.2; // 弧度增加
			 config.E_A_count ++;
		}
		
	} // for i over
}

//--盾敌人圆形--//
export function enemy_move2(){
	for( let i = 0; i < E_C_NUM; i ++ ){
		
		if( E_C[i].exist == 1 ){
			
			if( (E_C[i].x>550)&&(arrive<E_C_NUM) ) {
				E_C[i].x -= 2;
			}else{
				arrive ++;
			}
			
			if(arrive>=E_C_NUM){
				if(E_C[i].r<150) E_C[i].r ++;
				
				E_C[i].angle += 0.02;
				const sin = Math.sin( E_C[i].angle );
				const cos = Math.cos( E_C[i].angle );
				E_C[i].x = Math.round( E_C[i].r * cos ) + 550;
				E_C[i].y = Math.round( E_C[i].r * sin ) + 300;
			}
			
			// 显示
			gd.drawImage( E_bitmap[0], 
				E_C[i].px, E_C[i].py,
				E_C[i].w, E_C[i].h,
				E_C[i].x, E_C[i].y, 
				E_C[i].w, E_C[i].h
			);
			
		} // if( E_C[i].exist == 1 )
		
	} // for i over
}

//--盾敌人圆形--//
export function enemyC_explode(){
	
	for( let i = 0; i < E_C_NUM; i ++ ){
		
		//--盾2--//
	     if(E_C[i].dead==1)
		 {
			E_C[i].explode_delay++;

			if(E_C[i].explode_delay%2==0)
			{
		       if(E_C[i].explode_px<896)
			     E_C[i].explode_px=E_C[i].explode_px+128;
		       else
			   {
			       if(E_C[i].explode_py==0)
				   {
			         E_C[i].explode_px=0;
			         E_C[i].explode_py=135;
				   }
			       else
				   {
			          E_C[i].explode_px=0;
					  E_C[i].explode_py=0;
					  E_C[i].dead=0;
			          //E_C->explode_delay=0;
				   }
			   }

			   gd.drawImage(
				 E_explode[0],
				 E_C[i].explode_px,
				 E_C[i].explode_py,
				 128,135,
				 
				 E_C[i].x,E_C[i].y,
				 128,135
			   );

			   E_C[i].explode_delay=0;
			}//end if(E_A->explode_delay%2==0)
		 }//end if deade==1
		
	} // for i over
	
}