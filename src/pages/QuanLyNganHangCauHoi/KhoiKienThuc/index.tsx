import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IKnowledgeBlock } from '../typing';

const KhoiKienThuc = () => {
	const [data, setData] = useState<IKnowledgeBlock[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingItem, setEditingItem] = useState<IKnowledgeBlock | null>(null);
	const [form] = Form.useForm();

	// Mock fetching data
	useEffect(() => {
		const mockData: IKnowledgeBlock[] = [
			{ id: '1', name: 'Tổng quan', description: 'Kiến thức cơ bản' },
			{ id: '2', name: 'Chuyên sâu', description: 'Kiến thức nâng cao' },
		];
		// In real app, load from localStorage or an API
		const stored = localStorage.getItem('knowledgeBlocks');
		if (stored) {
			setData(JSON.parse(stored));
		} else {
			setData(mockData);
			localStorage.setItem('knowledgeBlocks', JSON.stringify(mockData));
		}
	}, []);

	const handleSave = (values: any) => {
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
		localStorage.setItem('knowledgeBlocks', JSON.stringify(newData));
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
		localStorage.setItem('knowledgeBlocks', JSON.stringify(newData));
		message.success('Xóa thành công');
	};

	const columns = [
		{ title: 'Tên khối kiến thức', dataIndex: 'name', key: 'name' },
		{ title: 'Mô tả', dataIndex: 'description', key: 'description' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: IKnowledgeBlock) => (
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
					<Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Card
				title='Quản lý Khối kiến thức'
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
				title={editingItem ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item name='name' label='Tên khối kiến thức' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default KhoiKienThuc;
