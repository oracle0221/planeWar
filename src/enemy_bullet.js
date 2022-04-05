import config from './config';
import {E_A_NUM, E_A} from './enemy';
import {loadImage, Point} from './common';
import {gd} from './render';

const E_A_BULLET_NUM = 10; //盾子弹的数量
const E_C_BULLET_NUM = 5;

export async function enemy_bullet_bitmap_load(){
	await Promise.all([
		loadImage('E_b'),
		loadImage('FireBall'),
	]).then(data=>{
		config.E_bullet_bitmap[0] = data[0];
		config.E_bullet_bitmap[1] = data[1];
	});
}

let E_A_bulletA = Array(E_A_BULLET_NUM).fill(0);
for( let i = 0; i < E_A_BULLET_NUM; i ++ ){
	E_A_bulletA[i]={
		x:0, y:0,
		w:0, h:0,
		type:0,
		exist: 0,
		px:0,
		py:0,
		A_delay:0,
		p:[],
		
		vx:0,
		vy:0,
		vel:0,
		gravity:0,
		wind_force:0,
		angle:0,
	};
}

let E_A_bulletB=Array(20).fill(0);
for( let i = 0; i < 20; i ++ ){
	E_A_bulletB[i] = [];
	for( let ii = 0; ii < 5; ii ++ ){
		E_A_bulletB[i][ii] = {
			x:0, y:0,
			w:0, h:0,
			type:0,
			exist: 0,
			px:0,
			py:0,
			A_delay:0,
			p:[],
			
			vx:0,
			vy:0,
			vel:0,
			gravity:0,
			wind_force:0,
			angle:0,
		};
	}
}


//==========
//散弹的产生
//==========
export function enemy_bullet_generateB(){
	
	
	
	for( let i = 0; i < E_A_NUM; i ++ ){
		
		if( (E_A[i].exist == 1) && ( E_A[i].x <= 550 ) ){ //E_A[i].x<=550是为了确定盾敌人不再移动时才产生子弹
			if(E_A[i].generate_delay%50==0){	//每个子弹产生之间的延时
				
				for( let j = 0; j < 10; j ++ ){
					
					let five_ok = 0; // 标识现在找到5颗不存在子弹
					
					for( let k = 0; k < 5; k ++ ){
						if( E_A_bulletB[j][k].exist == 0 ){ //确保这一行中有5个空位
							five_ok ++;
						}
					} // for k over
					
					if( five_ok >= 5 ){
						for(let k=0;k<5;k++){
							E_A_bulletB[j][k].exist=1;
							E_A_bulletB[j][k].x=E_A[i].x;
							E_A_bulletB[j][k].y=E_A[i].y+E_A[i].h/4;
							E_A_bulletB[j][k].w=20;
							E_A_bulletB[j][k].h=20;
							E_A_bulletB[j][k].type=1;
							E_A_bulletB[j][k].px=0;
							E_A_bulletB[j][k].py=0;
							E_A_bulletB[j][k].A_delay=0;
						}
						five_ok = 0;
						break;
					}else{
						five_ok = 0; //如果没有在这一行中找到5个空位也要把five_ok清0
					}
					
				} // for j over
				
			} // end if(E_A[i].generate_delay%50==0)
		} // end if( (E_A[i].exist == 1) && ( E_A[i].x <= 550 ) )
	
		if( E_A[i].generate_delay < 50 ){
			E_A[i].generate_delay ++;
		}else{
			E_A[i].generate_delay = 1;
		}
		
	} // for i over
	
}

//==========
//散弹的移动
//==========
export function enemy_bullet_moveB(){
	for( let i = 0; i < 10; i ++ ){
		for( let j = 0; j < 5; j ++ ){
			
			if( E_A_bulletB[i][j].exist == 1 ){
				
				switch(j){ // j 决定子弹的方向
					case 0:
					E_A_bulletB[i][j].x=E_A_bulletB[i][j].x-2;
					E_A_bulletB[i][j].y=E_A_bulletB[i][j].y-2;
					break;
					case 1:
					E_A_bulletB[i][j].x=E_A_bulletB[i][j].x-2;
					E_A_bulletB[i][j].y=E_A_bulletB[i][j].y-1;
					break;
					case 2:
					E_A_bulletB[i][j].x=E_A_bulletB[i][j].x-2;
					break;
					case 3:
					E_A_bulletB[i][j].x=E_A_bulletB[i][j].x-2;
					E_A_bulletB[i][j].y=E_A_bulletB[i][j].y+1;
					break;
					case 4:
					E_A_bulletB[i][j].x=E_A_bulletB[i][j].x-2;
					E_A_bulletB[i][j].y=E_A_bulletB[i][j].y+2;
					break;
				}
				
				//判断散弹的子弹是否超出了屏幕的可视范围
				if((E_A_bulletB[i][j].x<0)|| (E_A_bulletB[i][j].y<50)||(E_A_bulletB[i][j].y>500)){
					E_A_bulletB[i][j].exist=0;
				}
				
				//用于子弹动画控制
				E_A_bulletB[i][j].A_delay ++;
				
				if(E_A_bulletB[i][j].A_delay%5==0){
					if(E_A_bulletB[i][j].px<440)
						E_A_bulletB[i][j].px=E_A_bulletB[i][j].px+E_A_bulletB[i][j].w;
					else
						E_A_bulletB[i][j].px=0;

					E_A_bulletB[i][j].A_delay=0;
				}
				
				const bulletImg = config.E_bullet_bitmap[0];
				gd.drawImage( 
					bulletImg,
					E_A_bulletB[i][j].px, E_A_bulletB[i][j].py, E_A_bulletB[i][j].w, E_A_bulletB[i][j].h,
					E_A_bulletB[i][j].x,E_A_bulletB[i][j].y, E_A_bulletB[i][j].w, E_A_bulletB[i][j].h
				);
				
			} // end if
			
		} // for j over
	} // for i over
}

//=============
//水平子弹的产生
//=============
export function enemy_bullet_generate(){
	for( let i = 0; i < E_A_NUM; i ++ ){
		
		if((E_A[i].exist==1)&&(E_A[i].x<=550)){  //E_A[i].x<=550是为了确定盾敌人不再移动时才产生子弹
			if(E_A[i].generate_delay%25==0){		//每个子弹产生之间的延时
				
				for( let j = 0; j < E_A_BULLET_NUM; j ++ ){
					
					if(E_A_bulletA[j].exist==0){				//盾敌人存在则产生它的子弹
						E_A_bulletA[j].exist=1;
						E_A_bulletA[j].x=E_A[i].x;
						E_A_bulletA[j].y=E_A[i].y+E_A[i].h/4;
						E_A_bulletA[j].w=35;
						E_A_bulletA[j].h=35;
						E_A_bulletA[j].type=1;
						E_A_bulletA[j].px=0;
						E_A_bulletA[j].py=0;
						E_A_bulletA[j].A_delay=0;
						break;
					}
				} // for j over
				
			} // if(E_A[i].generate_delay%25==0)
				
		   if(E_A[i].generate_delay<25)
			  E_A[i].generate_delay++;
		   else
			  E_A[i].generate_delay=1;
		}
	} // for i over
}

//=============
//水平子弹的移动
//=============
export function enemy_bullet_move(){
	for( let i = 0; i < E_A_BULLET_NUM; i ++ ){
		
		if(E_A_bulletA[i].exist==1){
			
			if(E_A_bulletA[i].x>0){
				E_A_bulletA[i].x=E_A_bulletA[i].x-2;
				
				const bulletImg = config.E_bullet_bitmap[1];
				// 绘制
				gd.drawImage( bulletImg,
					E_A_bulletA[i].px, E_A_bulletA[i].py, E_A_bulletA[i].w, E_A_bulletA[i].h,
					E_A_bulletA[i].x,E_A_bulletA[i].y, E_A_bulletA[i].w,E_A_bulletA[i].h,
				);
				
				//用于子弹动画控制
				  E_A_bulletA[i].A_delay++;
				  
				  if(E_A_bulletA[i].A_delay%5==0){
						if(E_A_bulletA[i].px<440)
							E_A_bulletA[i].px=E_A_bulletA[i].px+E_A_bulletA[i].w;
						else
							E_A_bulletA[i].px=0;

						 E_A_bulletA[i].A_delay=0;
				  } 
				
			}else{
				E_A_bulletA[i].exist=0;
			} // if(E_A_bulletA[i].x>0)
			
		} // if(E_A_bulletA[i].exist==1)
		
	} // for i over
}


//==============
//炮塔子弹的产生
//==============
export function enemy_bullet_generateC(){
	
}