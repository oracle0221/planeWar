// import {p_3, R_state} from './config'
import config from './config';
import {MB_total, MB_total2} from './bullet'
import {loadImage} from './common';
import {gd} from './render';

let score=0;			    //当飞机击中敌人时该数值会增加
let bomb_count = 0;

// 加载角色状态图
export async function plane_state_bitmap_load(){
	const {R_state} = config;
	
	await Promise.all([
		loadImage('Bar3'),
		loadImage('R'),
		loadImage('life_count'),
		loadImage('w'),
		loadImage('bomb'),
		loadImage('score'),
		loadImage('WB_NUM'),
		loadImage('boold_count'),
	]).then(data=>{
		R_state[0] = data[0];
		R_state[1] = data[1];
		R_state[2] = data[2];
		R_state[3] = data[3];
		R_state[4] = data[4];
		R_state[5] = data[5];
		R_state[6] = data[6];
		R_state[7] = data[7];
	});
}

//=================
//飞机状态图的显示
//=================
export function plane_state_display(){
	
	const {p_3, R_state} = config;
	
	let num_i = 0;
	let a, b, w; //用于显示主角生命图
	
	// 最底部的Bar
	gd.drawImage(
		R_state[0],
		0, 0, 308, 55
	);
	
	//-------------得分R_state[5]-------------------//
	let am = 202, bm = score, cm = 1000000;
	
	for( let i = 0; i < 7; i ++ ){
		switch( parseInt( bm / cm ) ){
			case 0: gd.drawImage( R_state[5], 0, 0, 8, 12, am,12, 8, 12 );
			break;
			case 1: gd.drawImage( R_state[5], 8, 0, 8, 12, am,12, 8, 12 );
			break;
			case 2: gd.drawImage( R_state[5], 16, 0, 8, 12, am,12, 8, 12 );
			break;
			case 3: gd.drawImage( R_state[5], 24, 0, 8, 12, am,12, 8, 12 );
			break;
			case 4: gd.drawImage( R_state[5], 32, 0, 8, 12, am,12, 8, 12 );
			break;
			case 5: gd.drawImage( R_state[5], 40, 0, 8, 12, am,12, 8, 12 );
			break;
			case 6: gd.drawImage( R_state[5], 48, 0, 8, 12, am,12, 8, 12 );
			break;
			case 7: gd.drawImage( R_state[5], 56, 0, 8, 12, am,12, 8, 12 );
			break;
			case 8: gd.drawImage( R_state[5], 64, 0, 8, 12, am,12, 8, 12 );
			break;
			case 9: gd.drawImage( R_state[5], 72, 0, 8, 12, am,12, 8, 12 );
			break;
		}
		
		bm = bm % cm;
		cm = parseInt(cm / 10);
		am = am + 8;
		
	} // for i over
	
	//--------------保险数目R_state[4]--------------//
	if(p_3[num_i].exist==1){
		gd.drawImage(
			R_state[4],
			110,0,55,21,
			197,30,55,21
		);
	}
	
	//--------------主角图----------------//
	switch( p_3[num_i].type ){
		case 1:
			a = 1;
			w = 0;
		break;
		case 2:
			a = 1;
			w = 52;
		break;
		case 3:
			a = 1;
			w = 104;
		break;
	}
	
	gd.drawImage(
		R_state[a],
		w,0,52,55,
		0,0,52,55
	);
	
	if( p_3[num_i].exist == 1 ){
		//------------主角的生命值显示 R_state[7]---------------//
		
		switch(p_3[num_i].boold_count){
			case 18:
				gd.drawImage(
					R_state[7],
					0,0,108,3,
					84,43,108,3
				);
			break;
			case 15:
				gd.drawImage(
					R_state[7],
					0,0,90,3,
					84,43,90,3
				);
			break;
			case 12:
				gd.drawImage(
					R_state[7],
					0,0,72,3,
					84,43,72,3
				);
			break;
			case 9:
				gd.drawImage(
					R_state[7],
					0,0,54,3,
					84,43,54,3
				);
			break;
			case 6:
				gd.drawImage(
					R_state[7],
					0,0,38,3,
					84,43,38,3
				);
			break;
			case 3:
				gd.drawImage(
					R_state[7],
					0,0,22,3,
					84,43,22,3
				);
			break;
		}
		
		//生命数量的显示 R_State[2]
		gd.drawImage(
			R_state[2],
			36,0, 18,11,
			55,13,18,11
		);
		
	}
	
}