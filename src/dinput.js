import config from './config';
import {bullet_generate, MB_total, MB_total2, MB_total_minus, MB_total2_minus, fast_bullet_generate} from './bullet';
import {wp} from './weapon';


const DIK_LEFT = 37, DIK_RIGHT = 39, DIK_UP = 38, DIK_DOWN = 40; // 方向键 keycode
const DIK_ENTER = 13; // 回车键
const DIK_SPACE = 32; // 空格键
const DIK_S = 83; // 飞机大子弹

// 按键的松开状态
let IsJust_DIK_UP = false, IsJust_DIK_DOWN = false;
let Now_DIK_UP_Relax = false, Now_DIK_DOWN_Relax = false;

let DX_U = 0, DX_D = 0;
const DIK_A = 65; // A键 发射子弹

let select_role_delay = 0;
let keyCode = ''; // 代表按住了哪个键

document.onkeydown = ev=>{
	
	keyCode = ev.keyCode;
};

document.onkeyup = ev =>{
	keyCode = '';
	
	if( ev.keyCode == DIK_UP ){
		Now_DIK_UP_Relax = true;
	}
	
	if( ev.keyCode == DIK_DOWN ){
		Now_DIK_DOWN_Relax = true;
	}
};

export function Dx_keyboard_control(){
	const {p_3} = config;

	// 飞机武器的切换(空格键)
	if( keyCode == DIK_SPACE && wp.change_delay == 0 ){
		wp.change_delay=1;
		switch( wp.type ){
			case 0:
			wp.type = 1
			wp.px = 0
			break;
			case 1:
			wp.type = 2
			wp.px = 0
			break;
			case 2:
			wp.type = 3
			wp.px = 0
			break;
			case 3:
			wp.type = 1
			wp.px = 0
			break;
		}
	}
	
	// 武器切换延时
	if( wp.change_delay > 0 ){
		if( wp.change_delay % 20 == 0 ){
			wp.change_delay = 0
		}else{
			wp.change_delay ++
		}
	}
	
	 //武器的子弹数量统计
	if( keyCode ==  DIK_S ){
		switch(wp.type){
			case 1:
			//加速子弹
			if( MB_total > 0 ){
				MB_total_minus();
				if(wp.px<200)
					wp.px=wp.px+wp.w;
				else
					wp.px=0;
			}else{
				wp.px = 0;
			}
			
			fast_bullet_generate();	 //产生加速子弹
			break;
			case 2:
			break;
		}
	}else{
		// 键盘松开了, 武器重置状态
		wp.px = 0;
	}
	
	
	// 选择角色
	if( keyCode == DIK_LEFT ){
		if( config.select_ok == 0  && select_role_delay == 0 ){
			select_role_delay = 1;
			if( config.k_id > 0 ){
				config.k_id --;
			}
		}
		
		// 角色移动
		if( config.select_ok == 2 ){
			if( p_3[0].p_x > 0 ){
				p_3[0].p_x -= 4;
			}
		}
	}
	
	// 选择角色 
	if( keyCode == DIK_RIGHT ){
		if( config.select_ok == 0 && select_role_delay == 0 ){
			select_role_delay = 1;
			if( config.k_id < 2 ){
				config.k_id ++;
			}
		}
		
		// 角色移动
		if( config.select_ok == 2 ){
			if( p_3[0].p_x < 800 - p_3[0].w ){
				p_3[0].p_x += 4;
			}
		}
	}
	
	// 向上松开一刻
	if( Now_DIK_UP_Relax && IsJust_DIK_UP){
		IsJust_DIK_UP = false;
	}
	
	// 向下松开一刻
	if( Now_DIK_DOWN_Relax && IsJust_DIK_DOWN ){
		IsJust_DIK_DOWN = false;
	}
	
	// 向上
	if( config.select_ok == 2 && keyCode == DIK_UP ){
		IsJust_DIK_UP = true;
		if(p_3[0].p_y>0)
			p_3[0].p_y=p_3[0].p_y-4;
	}
	
	// 向下
	if( config.select_ok == 2 && keyCode == DIK_DOWN ){
		IsJust_DIK_DOWN = true;
		if(p_3[0].p_y<500)
			p_3[0].p_y=p_3[0].p_y+4;
		
		
	}
	
	if( config.select_ok == 2 ){
		
		if(IsJust_DIK_UP ){
			if( p_3[0].p_px < 550 - p_3[0].w && DX_D == 0 ){
				if( p_3[0].time % 5 == 0 ){
					//飞机每一帧图的维持时间
					p_3[0].p_px += p_3[0].w;
				}
				if( DX_U == 0 ){
					DX_U = 1;
				}
				p_3[0].time ++;
			}
			
			
		}
		
		if(IsJust_DIK_DOWN ){
			if( p_3[0].p_px < 550 - 2 * p_3[0].w && DX_U == 0 ){
				p_3[0].p_py=p_3[0].h; // 第二行
				
				if( p_3[0].time % 5 == 0 ){
					p_3[0].p_px += p_3[0].w;
				}
				
				if( DX_D == 0 ){
					DX_D = 1;
				}
				
				p_3[0].time ++;
			}
		}
		
		
	}
	
	if( config.select_ok == 2 ){
		if( Now_DIK_UP_Relax ){
			if( p_3[0].p_px > 0 && DX_U == 1 ){
				if( p_3[0].time % 5 == 0 ){
					p_3[0].p_px -= p_3[0].w;
				}
				
				if( p_3[0].time > 0 ){
					p_3[0].time --;
				}
			}else{
				if(DX_U == 1){
					Now_DIK_UP_Relax = false;
					DX_U = 0; //当飞机从向上状态恢复为正常状态后向下才可执行
					p_3[0].time = 0;
					p_3[0].p_px = 0;
				}
			}
		}
		
		if( Now_DIK_DOWN_Relax ){
			if( DX_D == 1 && p_3[0].p_px > 0 ){
				if(p_3[0].time%5==0)						//每侦图的维持时间
					p_3[0].p_px=p_3[0].p_px-p_3[0].w;
				if(p_3[0].time>0){
					p_3[0].time --;
				}
			}else{
				if( DX_D == 1 ){
					Now_DIK_DOWN_Relax = false;
					DX_D = 0;
					p_3[0].p_py=0;							//飞机正常状态在第一行
					p_3[0].p_px=0;
					p_3[0].time=0;
				}
			}
		}
	}
	
	
	
	
	// 飞机选择的按键延时
	if( select_role_delay > 0 && config.select_ok == 0 ){
		if( select_role_delay % 15 == 0 ){
			select_role_delay = 0;
		}else{
			select_role_delay ++;
		}
	}
	
	// 角色选择确定 按下回车键
	if( keyCode == DIK_ENTER ){
		if( config.select_ok == 0 ){
			config.select_ok = 1;
			if( config.k_id == 0 ){
				config.p_3[0].type = 1;
			}
			
			if( config.k_id == 1 ){
				config.p_3[0].type = 2;
			}
			
			if( config.k_id == 2 ){
				config.p_3[0].type = 3;
			}
		}
	}
	
	//发射常态子弹
	if( keyCode == DIK_A ){
		bullet_generate();
	}
	
}