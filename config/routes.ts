export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/guess-number',
		name: 'GuessNumber',
		component: './GuessNumber',
		icon: 'TrophyOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		component: './TodoList',
		icon: 'UnorderedListOutlined',
	},
	{
		path: '/giai-bai-1',
		name: 'Oẳn Tù Tì',
		component: './GiaiBai1',
		icon: 'ScissorOutlined',
	},

	// QUẢN LÝ NGÂN HÀNG CÂU HỎI
	{
		name: 'Ngân hàng câu hỏi',
		path: '/ngan-hang-cau-hoi',
		icon: 'DatabaseOutlined',
		routes: [
			{
				name: 'Khối kiến thức',
				path: 'khoi-kien-thuc',
				component: './QuanLyNganHangCauHoi/KhoiKienThuc',
			},
			{
				name: 'Môn học',
				path: 'mon-hoc',
				component: './QuanLyNganHangCauHoi/MonHoc',
			},
			{
				name: 'Câu hỏi',
				path: 'cau-hoi',
				component: './QuanLyNganHangCauHoi/CauHoi',
			},
			{
				name: 'Đề thi',
				path: 'de-thi',
				component: './QuanLyNganHangCauHoi/DeThi',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
