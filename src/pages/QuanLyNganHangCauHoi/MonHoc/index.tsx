import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ISubject } from '../typing';

const MonHoc = () => {
	const [data, setData] = useState<ISubject[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingItem, setEditingItem] = useState<ISubject | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		const stored = localStorage.getItem('subjects');
		if (stored) {
			setData(JSON.parse(stored));
		} else {
			const mockData = [{ id: '1', subjectCode: 'INT14162', name: 'Lập trình Web', credits: 3 }];
			setData(mockData);
			localStorage.setItem('subjects', JSON.stringify(mockData));
		}
	}, []);

	const handleSave = (values: any) => {
		const newCode = values.subjectCode.trim();
		const newName = values.name.trim();

		const isDuplicateCode = data.some(
			(item) => item.subjectCode.toLowerCase() === newCode.toLowerCase() && item.id !== editingItem?.id
		);
		if (isDuplicateCode) {
			message.error('Mã môn học đã tồn tại!');
			return;
		}
		values.subjectCode = newCode;
		values.name = newName;
		let newData = [...data];
		if (editingItem) {
			newData = newData.map((item) => (item.id === editingItem.id ? { ...editingItem, ...values } : item));
			message.success('Cập nhật thành công');
		} else {
			const newItem = { id: Date.now().toString(), ...values };
			newData.push(newItem);
			message.success('Thêm mới thành công');
		}
		setData(newData);
		localStorage.setItem('subjects', JSON.stringify(newData));
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
		localStorage.setItem('subjects', JSON.stringify(newData));
		message.success('Xóa thành công');
	};

	const columns = [
		{ title: 'Mã môn học', dataIndex: 'subjectCode', key: 'subjectCode', align: 'center' as const, },
		{ title: 'Tên môn học', dataIndex: 'name', key: 'name', align: 'center' as const, },
		{ title: 'Số tín chỉ', dataIndex: 'credits', key: 'credits', align: 'center' as const, },
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: ISubject) => (
				<Space size='middle'>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingItem(record);
							form.setFieldsValue(record);
							setIsModalVisible(true);
						}}
					/>
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa mục này?"
						onConfirm={() => handleDelete(record.id)}
						okText="Có"
						cancelText="Không"
						placement="topRight"
					>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Card
				title='Quản lý Môn học'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingItem(null);
							form.resetFields();
							setIsModalVisible(true);
						}}
					>
						Thêm mới
					</Button>
				}
			>
				<Table rowKey='id' columns={columns} dataSource={data} />
			</Card>

			<Modal
				title={editingItem ? 'Sửa môn học' : 'Thêm môn học'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item name='subjectCode' label='Mã môn học' rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='name' label='Tên môn học' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name='credits'
						label='Số tín chỉ'
						rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
					>
						<InputNumber min={1} max={10} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default MonHoc;
