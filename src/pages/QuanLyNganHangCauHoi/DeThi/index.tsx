import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, InputNumber, message, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { IExamStructure, ISubject, IKnowledgeBlock } from '../typing';

const { Option } = Select;

const DeThi = () => {
	const [data, setData] = useState<IExamStructure[]>([]);
	const [subjects, setSubjects] = useState<ISubject[]>([]);
	const [knowledgeBlocks, setKnowledgeBlocks] = useState<IKnowledgeBlock[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		setSubjects(JSON.parse(localStorage.getItem('subjects') || '[]'));
		setKnowledgeBlocks(JSON.parse(localStorage.getItem('knowledgeBlocks') || '[]'));
		const stored = localStorage.getItem('examStructures');
		if (stored) {
			setData(JSON.parse(stored));
		}
	}, []);

	const handleSave = (values: any) => {
		// Basic Task 4 - Structuring
		const newItem = { id: Date.now().toString(), ...values };
		const newData = [...data, newItem];
		setData(newData);
		localStorage.setItem('examStructures', JSON.stringify(newData));
		setIsModalVisible(false);
		form.resetFields();
		message.success('Tạo cấu trúc đề thành công');
	};

	const columns = [
		{ title: 'Tên cấu trúc đề', dataIndex: 'name', key: 'name' },
		{
			title: 'Môn học',
			key: 'subject',
			render: (_: any, record: IExamStructure) => subjects.find((s) => s.id === record.subjectId)?.name || 'N/A',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: IExamStructure) => (
				<Space size='middle'>
					<Button type='link' onClick={() => {}}>
						Sinh đề tự động
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Card
				title='Quản lý Đề thi'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							form.resetFields();
							setIsModalVisible(true);
						}}
					>
						Tạo cấu trúc đề mới
					</Button>
				}
			>
				<Table rowKey='id' columns={columns} dataSource={data} />
			</Card>

			<Modal
				title='Tạo cấu trúc đề thi'
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => setIsModalVisible(false)}
				width={800}
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item name='name' label='Tên cấu trúc (VD: Đề thi giữa kì)' rules={[{ required: true }]}>
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

					<Divider>Yêu cầu câu hỏi (Mức độ / Khối kiến thức)</Divider>
					<Form.List name='requirements'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
										<Form.Item
											{...restField}
											name={[name, 'difficulty']}
											rules={[{ required: true, message: 'Chọn độ khó' }]}
										>
											<Select placeholder='Chọn độ khó' style={{ width: 130 }}>
												{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((d) => (
													<Option key={d} value={d}>
														{d}
													</Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'knowledgeBlockId']}
											rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
										>
											<Select placeholder='Khối kiến thức' style={{ width: 200 }}>
												{knowledgeBlocks.map((k) => (
													<Option key={k.id} value={k.id}>
														{k.name}
													</Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'count']}
											rules={[{ required: true, message: 'Nhập số lượng' }]}
										>
											<InputNumber placeholder='Số lượng' min={1} />
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Space>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
										Thêm yêu cầu
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		</div>
	);
};

export default DeThi;
