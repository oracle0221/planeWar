export default {
	select_ok : 0, // 角色选择
	k_id: 0, // 哪个飞机角色
	
	fs_x: 36,
	fs_y: 380,
	fs_w: 240,
	fs_h: 180,
	
	F_S:[],
	Role_bg: null, // 飞机选择背景图
	
	// 游戏陆地
	land:[],
	bg_bit:null,
	
	p_3:[], // 飞机数据
	P_bitmap:[], // 飞机图
	P_NUM: 3, // 飞机的数量
	score: 0, // 当飞机击中敌人时该数值会增加
	
	bullet_bitmap:[], // 飞机子弹图片
	
	
	// 敌人的变量
	E_A_count: 0, //盾敌人的数量
	
	
	// 敌人子弹图片
	E_bullet_bitmap:[],
	
	// 角色状态图
	R_state: [],
};