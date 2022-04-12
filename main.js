import './style.css'
import {loadImage} from './src/common';
import {update, draw} from './src/render';
import config from './src/config';

import {plane_generate, plane_select_load, plane_bitmap_load} from './src/plane';
import {bg_bitmap_load} from './src/bg';
import {enemy_bitmap_load} from './src/enemy';
import {enemy_bullet_bitmap_load} from './src/enemy_bullet';
import {bullet_bitmap_load} from './src/bullet';
import {plane_state_bitmap_load} from './src/plane_state';

async function create(){
	
	//--读入对象图片--//
	await plane_select_load();
	await bg_bitmap_load();
	await plane_bitmap_load();
	await enemy_bitmap_load();
	await enemy_bullet_bitmap_load();
	await bullet_bitmap_load();
	await plane_state_bitmap_load();
	
	//--对象的产生--//
	plane_generate();
	
	// 游戏循环定时器
	setUp(); 
}

create();


function setUp(){
	setInterval(()=>{
		update();
		draw();
	}, 16);
}
