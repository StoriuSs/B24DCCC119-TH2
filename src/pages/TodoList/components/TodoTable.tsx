import React from 'react';
import { Table, Space, Button, Tag, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface TodoTableProps {
	dataSource: any[];
	loading: boolean;
	onEdit: (record: any) => void;
	onDelete: (id: string) => void;
	onToggleStatus: (record: any) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({ dataSource, loading, onEdit, onDelete, onToggleStatus }) => {
	const columns = [
		{
			title: 'Trạng thái',
			dataIndex: 'completed',
			key: 'completed',
			width: 120,
			render: (completed: boolean, record: any) => (
				<Tooltip title='Click để thay đổi trạng thái'>
					<Tag
						color={completed ? 'success' : 'processing'}
						icon={completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
						style={{ cursor: 'pointer' }}
						onClick={() => onToggleStatus(record)}
					>
						{completed ? 'Hoàn thành' : 'Đang làm'}
					</Tag>
				</Tooltip>
			),
		},
		{
			title: 'Nội dung công việc',
			dataIndex: 'title',
			key: 'title',
			render: (text: string, record: any) => (
				<span
					style={{
						textDecoration: record.completed ? 'line-through' : 'none',
						color: record.completed ? '#999' : 'inherit',
					}}
				>
					{text}
				</span>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 180,
			render: (text: string) => new Date(text).toLocaleString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			render: (_: any, record: any) => (
				<Space size='middle'>
					<Tooltip title='Sửa'>
						<Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => onEdit(record)} />
					</Tooltip>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa công việc này?'
						onConfirm={() => onDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
						placement='topLeft'
					>
						<Tooltip title='Xóa'>
							<Button type='text' danger icon={<DeleteOutlined />} />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Table loading={loading} dataSource={dataSource} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />
	);
};

export default TodoTable;
