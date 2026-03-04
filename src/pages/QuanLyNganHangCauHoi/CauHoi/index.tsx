import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IQuestion, ISubject, IKnowledgeBlock } from '../typing';
import Popconfirm from 'antd/es/popconfirm';

const { Option } = Select;

const CauHoi = () => {
	const [data, setData] = useState<IQuestion[]>([]);
	const [subjects, setSubjects] = useState<ISubject[]>([]);
	const [knowledgeBlocks, setKnowledgeBlocks] = useState<IKnowledgeBlock[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingItem, setEditingItem] = useState<IQuestion | null>(null);
	const [form] = Form.useForm();

	const [filterSubject, setFilterSubject] = useState<string | null>(null);
	const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
	const [filterKnowledgeBlock, setFilterKnowledgeBlock] = useState<string | null>(null);

	useEffect(() => {
		setSubjects(JSON.parse(localStorage.getItem('subjects') || '[]'));
		setKnowledgeBlocks(JSON.parse(localStorage.getItem('knowledgeBlocks') || '[]'));

		const stored = localStorage.getItem('questions');
		if (stored) {
			setData(JSON.parse(stored));
		}
	}, []);

	const handleSave = (values: any) => {
		const isDuplicate = data.some(
			(item) => item.questionCode === values.questionCode && item.id !== editingItem?.id
		);

		if (isDuplicate) {
			message.error('Mã câu hỏi đã tồn tại!');
			return;
		}

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
		localStorage.setItem('questions', JSON.stringify(newData));
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
		localStorage.setItem('questions', JSON.stringify(newData));
		message.success('Xóa thành công');
	};

	const filteredData = data.filter((item) => {
		if (filterSubject && item.subjectId !== filterSubject) return false;
		if (filterDifficulty && item.difficulty !== filterDifficulty) return false;
		if (filterKnowledgeBlock && item.knowledgeBlockId !== filterKnowledgeBlock) return false;
		return true;
	});

	const columns = [
		{ title: 'Mã câu hỏi', dataIndex: 'questionCode', key: 'questionCode' },
		{ title: 'Nội dung', dataIndex: 'content', key: 'content' },
		{
			title: 'Môn học',
			key: 'subject',
			render: (_: any, record: IQuestion) => subjects.find((s) => s.id === record.subjectId)?.name || 'N/A',
		},
		{
			title: 'Khối kiến thức',
			key: 'knowledgeBlock',
			render: (_: any, record: IQuestion) => knowledgeBlocks.find((k) => k.id === record.knowledgeBlockId)?.name || 'N/A',
		},
		{ title: 'Mức độ', dataIndex: 'difficulty', key: 'difficulty' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: IQuestion) => (
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
				title='Quản lý Câu hỏi'
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
				<Space style={{ marginBottom: 16 }}>
					<Select
						placeholder='Chọn môn học'
						style={{ width: 200 }}
						allowClear
						onChange={(value) => setFilterSubject(value)}
					>
						{subjects.map((s) => (
							<Option key={s.id} value={s.id}>
								{s.name}
							</Option>
						))}
					</Select>
					<Select
						placeholder='Chọn khối kiến thức'
						style={{ width: 200 }}
						allowClear
						onChange={(value) => setFilterKnowledgeBlock(value)}
					>
						{knowledgeBlocks.map((k) => (
							<Option key={k.id} value={k.id}>
								{k.name}
							</Option>
						))}
					</Select>
					<Select
						placeholder='Chọn mức độ khó'
						style={{ width: 200 }}
						allowClear
						onChange={(value) => setFilterDifficulty(value)}
					>
						{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((d) => (
							<Option key={d} value={d}>
								{d}
							</Option>
						))}
					</Select>
				</Space>
				<Table rowKey='id' columns={columns} dataSource={filteredData} />
			</Card>

			<Modal
				title={editingItem ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item
						name='questionCode'
						label='Mã câu hỏi'
						rules={[
							{ required: true, message: 'Vui lòng nhập mã câu hỏi' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name='subjectId' label='Môn học' rules={[{ required: true }]}>
						<Select>
							{subjects.map((s) => (
								<Option key={s.id} value={s.id}>
									{s.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='knowledgeBlockId' label='Khối kiến thức' rules={[{ required: true }]}>
						<Select>
							{knowledgeBlocks.map((k) => (
								<Option key={k.id} value={k.id}>
									{k.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='difficulty' label='Mức độ khó' rules={[{ required: true }]}>
						<Select>
							{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((d) => (
								<Option key={d} value={d}>
									{d}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='content' label='Nội dung' rules={[{ required: true }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default CauHoi;
