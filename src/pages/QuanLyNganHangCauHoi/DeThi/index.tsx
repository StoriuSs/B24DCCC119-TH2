import { useState, useEffect } from 'react';
import {
	Card,
	Table,
	Button,
	Space,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	message,
	Divider,
	Tabs,
	List,
	Typography,
	Tag,
	Transfer,
} from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	MinusCircleOutlined,
	EyeOutlined,
	SyncOutlined,
	EditOutlined,
} from '@ant-design/icons';
import type { IExamStructure, ISubject, IKnowledgeBlock, IQuestion, IExam } from '../typing';

const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

const DeThi = () => {
	const [data, setData] = useState<IExamStructure[]>([]);
	const [exams, setExams] = useState<IExam[]>([]);
	const [subjects, setSubjects] = useState<ISubject[]>([]);
	const [knowledgeBlocks, setKnowledgeBlocks] = useState<IKnowledgeBlock[]>([]);
	const [questions, setQuestions] = useState<IQuestion[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingStructure, setEditingStructure] = useState<IExamStructure | null>(null);
	const [isEditExamModalVisible, setIsEditExamModalVisible] = useState(false);
	const [editingExam, setEditingExam] = useState<IExam | null>(null);
	const [editExamTargetKeys, setEditExamTargetKeys] = useState<string[]>([]);

	// Viewing exam modal
	const [viewExam, setViewExam] = useState<IExam | null>(null);
	const [viewSearch, setViewSearch] = useState('');
	const [viewDifficulty, setViewDifficulty] = useState<string | undefined>(undefined);
	const [viewKnowledgeBlockId, setViewKnowledgeBlockId] = useState<string | undefined>(undefined);

	const [form] = Form.useForm();

	useEffect(() => {
		setSubjects(JSON.parse(localStorage.getItem('subjects') || '[]'));
		setKnowledgeBlocks(JSON.parse(localStorage.getItem('knowledgeBlocks') || '[]'));
		setQuestions(JSON.parse(localStorage.getItem('questions') || '[]'));

		const storedStructures = localStorage.getItem('examStructures');
		if (storedStructures) setData(JSON.parse(storedStructures));

		const storedExams = localStorage.getItem('exams');
		if (storedExams) setExams(JSON.parse(storedExams));
	}, []);

	const handleSaveStructure = (values: any) => {
		let newData = [...data];
		if (editingStructure) {
			newData = newData.map((item) => (item.id === editingStructure.id ? { ...editingStructure, ...values } : item));
			message.success('Cập nhật cấu trúc đề thành công');
		} else {
			const newItem = { id: Date.now().toString(), ...values };
			newData = [...data, newItem];
			message.success('Tạo cấu trúc đề thành công');
		}

		setData(newData);
		localStorage.setItem('examStructures', JSON.stringify(newData));
		setIsModalVisible(false);
		setEditingStructure(null);
		form.resetFields();
	};

	const handleDeleteStructure = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
		localStorage.setItem('examStructures', JSON.stringify(newData));
		message.success('Xóa cấu trúc đề thành công');
	};

	const getAvailableQuestionsCount = (subjectId: string, difficulty: string, blockId: string) => {
		if (!subjectId || !difficulty || !blockId) return 0;
		return questions.filter(
			(q) => q.subjectId === subjectId && q.difficulty === difficulty && q.knowledgeBlockId === blockId,
		).length;
	};

	const generateExam = (structure: IExamStructure) => {
		const subjectQuestions = questions.filter((q) => q.subjectId === structure.subjectId);
		let selectedQuestions: IQuestion[] = [];

		for (const req of structure.requirements || []) {
			const candidates = subjectQuestions.filter(
				(q) => q.difficulty === req.difficulty && q.knowledgeBlockId === req.knowledgeBlockId,
			);

			if (candidates.length < req.count) {
				const blockName = knowledgeBlocks.find((k) => k.id === req.knowledgeBlockId)?.name;
				message.error(
					`Không đủ câu hỏi! Yêu cầu: ${req.count} câu [${req.difficulty}] - Khối "${blockName}". Hiện có: ${candidates.length} câu.`,
				);
				return;
			}

			// Pick random
			const shuffled = [...candidates].sort(() => 0.5 - Math.random());
			selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, req.count)];
		}

		const newExam: IExam = {
			id: `EXAM_${Date.now()}`,
			structureId: structure.id,
			subjectId: structure.subjectId,
			questions: selectedQuestions,
			createdAt: new Date().toISOString(),
		};

		const newExams = [newExam, ...exams];
		setExams(newExams);
		localStorage.setItem('exams', JSON.stringify(newExams));
		message.success('Sinh đề tự động thành công!');
	};

	const handleDeleteExam = (id: string) => {
		const newExams = exams.filter((e) => e.id !== id);
		setExams(newExams);
		localStorage.setItem('exams', JSON.stringify(newExams));
		message.success('Xóa đề thi thành công');
	};

	const openViewExamModal = (exam: IExam) => {
		setViewExam(exam);
		setViewSearch('');
		setViewDifficulty(undefined);
		setViewKnowledgeBlockId(undefined);
	};

	const openEditExamModal = (exam: IExam) => {
		setEditingExam(exam);
		setIsEditExamModalVisible(true);
		setEditExamTargetKeys(exam.questions.map((q) => q.id));
	};

	const handleSaveEditedExam = () => {
		if (!editingExam) return;
		if (editExamTargetKeys.length === 0) {
			message.error('Vui lòng chọn ít nhất 1 câu hỏi');
			return;
		}

		const pool = questions.filter((q) => q.subjectId === editingExam.subjectId);
		const selectedQuestions = editExamTargetKeys
			.map((id) => pool.find((q) => q.id === id))
			.filter((q): q is IQuestion => !!q);

		const newExams = exams.map((exam) =>
			exam.id === editingExam.id
				? {
						...exam,
						questions: selectedQuestions,
				  }
				: exam,
		);

		setExams(newExams);
		localStorage.setItem('exams', JSON.stringify(newExams));
		setIsEditExamModalVisible(false);
		setEditingExam(null);
		setEditExamTargetKeys([]);
		message.success('Cập nhật đề thi thành công');
	};

	const columnsStructure = [
		{ title: 'Tên cấu trúc đề', dataIndex: 'name', key: 'name', align: 'center' as const },
		{
			title: 'Môn học',
			key: 'subject',
			align: 'center' as const,
			render: (_: any, record: IExamStructure) => subjects.find((s) => s.id === record.subjectId)?.name || 'N/A',
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: IExamStructure) => (
				<Space size='middle'>
					<Button type='primary' icon={<SyncOutlined />} size='small' onClick={() => generateExam(record)}>
						Sinh đề
					</Button>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingStructure(record);
							form.setFieldsValue(record);
							setIsModalVisible(true);
						}}
					/>
					<Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleDeleteStructure(record.id)} />
				</Space>
			),
		},
	];

	const columnsExams = [
		{ title: 'Mã Đề thi', dataIndex: 'id', key: 'id', align: 'center' as const },
		{
			title: 'Cấu trúc (Nguồn)',
			key: 'structure',
			align: 'center' as const,
			render: (_: any, record: IExam) => data.find((s) => s.id === record.structureId)?.name || 'N/A',
		},
		{
			title: 'Môn học',
			key: 'subject',
			align: 'center' as const,
			render: (_: any, record: IExam) => subjects.find((s) => s.id === record.subjectId)?.name || 'N/A',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			align: 'center' as const,
			render: (date: string) => new Date(date).toLocaleString(),
		},
		{
			title: 'Số câu hỏi',
			key: 'count',
			align: 'center' as const,
			render: (_: any, record: IExam) => record.questions?.length || 0,
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: IExam) => (
				<Space size='middle'>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEditExamModal(record)}>
						Sửa
					</Button>
					<Button type='link' icon={<EyeOutlined />} onClick={() => openViewExamModal(record)}>
						Xem
					</Button>
					<Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleDeleteExam(record.id)} />
				</Space>
			),
		},
	];

	const editExamQuestionPool = questions.filter((q) => q.subjectId === editingExam?.subjectId);
	const transferData = editExamQuestionPool.map((q) => ({
		key: q.id,
		question: q,
	}));
	const filteredViewQuestions = (viewExam?.questions || []).filter((q) => {
		const blockName = knowledgeBlocks.find((k) => k.id === q.knowledgeBlockId)?.name || '';
		const matchesSearch =
			!viewSearch || `${q.questionCode} ${q.content} ${blockName}`.toLowerCase().includes(viewSearch.toLowerCase());
		const matchesDifficulty = !viewDifficulty || q.difficulty === viewDifficulty;
		const matchesBlock = !viewKnowledgeBlockId || q.knowledgeBlockId === viewKnowledgeBlockId;

		return matchesSearch && matchesDifficulty && matchesBlock;
	});

	return (
		<div style={{ padding: '24px' }}>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Quản lý cấu trúc đề' key='1'>
					<Card
						title='Danh sách Cấu trúc đề'
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
						<Table rowKey='id' columns={columnsStructure} dataSource={data} />
					</Card>
				</TabPane>

				<TabPane tab='Đề thi đã sinh' key='2'>
					<Card title='Danh sách Đề thi'>
						<Table rowKey='id' columns={columnsExams} dataSource={exams} />
					</Card>
				</TabPane>
			</Tabs>

			{/* Modal Tạo/Sửa cấu trúc */}
			<Modal
				title={editingStructure ? 'Sửa cấu trúc đề thi' : 'Tạo cấu trúc đề thi'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingStructure(null);
					form.resetFields();
				}}
				width={800}
			>
				<Form form={form} layout='vertical' onFinish={handleSaveStructure}>
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
											dependencies={[
												'subjectId',
												['requirements', name, 'difficulty'],
												['requirements', name, 'knowledgeBlockId'],
											]}
											rules={[
												{ required: true, message: 'Nhập số lượng' },
												({ getFieldValue }) => ({
													validator(_, value) {
														if (!value) return Promise.resolve();
														const subjectId = getFieldValue('subjectId');
														const diff = getFieldValue(['requirements', name, 'difficulty']);
														const blockId = getFieldValue(['requirements', name, 'knowledgeBlockId']);

														if (subjectId && diff && blockId) {
															const available = getAvailableQuestionsCount(subjectId, diff, blockId);
															if (value > available) {
																return Promise.reject(new Error(`Chỉ còn ${available} câu`));
															}
														}
														return Promise.resolve();
													},
												}),
											]}
										>
											<InputNumber placeholder='Số lượng' min={1} />
										</Form.Item>
										<Form.Item
											noStyle
											shouldUpdate={(prevValues, curValues) => {
												const prevRequirement = prevValues?.requirements?.[name];
												const curRequirement = curValues?.requirements?.[name];
												return (
													prevValues?.subjectId !== curValues?.subjectId ||
													prevRequirement?.difficulty !== curRequirement?.difficulty ||
													prevRequirement?.knowledgeBlockId !== curRequirement?.knowledgeBlockId
												);
											}}
										>
											{({ getFieldValue }) => {
												const subjectId = getFieldValue('subjectId');
												const difficulty = getFieldValue(['requirements', name, 'difficulty']);
												const knowledgeBlockId = getFieldValue(['requirements', name, 'knowledgeBlockId']);
												const available = getAvailableQuestionsCount(subjectId, difficulty, knowledgeBlockId);

												if (!subjectId || !difficulty || !knowledgeBlockId) {
													return <Text type='secondary'>Chọn môn/độ khó/khối để xem số câu</Text>;
												}

												return <Text type={available > 0 ? 'secondary' : 'danger'}>Hiện có: {available} câu</Text>;
											}}
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

			{/* Modal Sửa Đề Thi */}
			<Modal
				title={editingExam ? `Sửa đề thi: ${editingExam.id}` : 'Sửa đề thi'}
				visible={isEditExamModalVisible}
				onOk={handleSaveEditedExam}
				onCancel={() => {
					setIsEditExamModalVisible(false);
					setEditingExam(null);
					setEditExamTargetKeys([]);
				}}
				width={1100}
			>
				<div style={{ marginBottom: 12 }}>
					<Text strong>Môn học: </Text>
					<Text>{subjects.find((s) => s.id === editingExam?.subjectId)?.name || 'N/A'}</Text>
					<Text type='secondary' style={{ marginLeft: 16 }}>
						Đã chọn: {editExamTargetKeys.length} câu
					</Text>
				</div>

				<Transfer
					dataSource={transferData}
					titles={['Ngân hàng câu hỏi', 'Câu hỏi trong đề']}
					targetKeys={editExamTargetKeys}
					onChange={(nextTargetKeys) => setEditExamTargetKeys(nextTargetKeys as string[])}
					showSearch
					listStyle={{
						width: 500,
						height: 420,
					}}
					filterOption={(inputValue, item) => {
						const q = (item as any).question as IQuestion;
						const blockName = knowledgeBlocks.find((k) => k.id === q.knowledgeBlockId)?.name || '';
						const haystack = `${q.questionCode} ${q.content} ${q.difficulty} ${blockName}`.toLowerCase();
						return haystack.includes(inputValue.toLowerCase());
					}}
					render={(item) => {
						const q = (item as any).question as IQuestion;
						const blockName = knowledgeBlocks.find((k) => k.id === q.knowledgeBlockId)?.name || 'N/A';
						return (
							<div style={{ paddingRight: 8 }}>
								<div>
									<Text strong>[{q.questionCode}]</Text>{' '}
									<Tag color='blue' style={{ marginLeft: 4 }}>
										{q.difficulty}
									</Tag>
									<Tag color='cyan'>{blockName}</Tag>
								</div>
								<div style={{ color: 'rgba(0,0,0,0.65)' }}>{q.content.slice(0, 120)}</div>
							</div>
						);
					}}
				/>
			</Modal>

			{/* Modal Xem Đề Thi */}
			<Modal
				title={`Chi tiết đề thi: ${viewExam?.id}`}
				visible={!!viewExam}
				onCancel={() => {
					setViewExam(null);
					setViewSearch('');
					setViewDifficulty(undefined);
					setViewKnowledgeBlockId(undefined);
				}}
				footer={[
					<Button
						key='close'
						onClick={() => {
							setViewExam(null);
							setViewSearch('');
							setViewDifficulty(undefined);
							setViewKnowledgeBlockId(undefined);
						}}
					>
						Đóng
					</Button>,
				]}
				width={1000}
				bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
			>
				{viewExam && (
					<div>
						<div style={{ marginBottom: 12 }}>
							<Text strong>Môn học: </Text> {subjects.find((s) => s.id === viewExam.subjectId)?.name} <br />
							<Text strong>Ngày tạo: </Text> {new Date(viewExam.createdAt).toLocaleString()} <br />
							<Text strong>Tổng số câu hỏi: </Text> {viewExam.questions?.length || 0}
						</div>

						<Space style={{ marginBottom: 16 }} wrap>
							<Input
								allowClear
								placeholder='Tìm theo mã câu hỏi / nội dung'
								style={{ width: 280 }}
								value={viewSearch}
								onChange={(e) => setViewSearch(e.target.value)}
							/>
							<Select
								allowClear
								placeholder='Lọc mức độ'
								style={{ width: 160 }}
								value={viewDifficulty}
								onChange={(value) => setViewDifficulty(value)}
							>
								{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((d) => (
									<Option key={d} value={d}>
										{d}
									</Option>
								))}
							</Select>
							<Select
								allowClear
								placeholder='Lọc khối kiến thức'
								style={{ width: 220 }}
								value={viewKnowledgeBlockId}
								onChange={(value) => setViewKnowledgeBlockId(value)}
							>
								{knowledgeBlocks.map((k) => (
									<Option key={k.id} value={k.id}>
										{k.name}
									</Option>
								))}
							</Select>
							<Text type='secondary'>Hiển thị: {filteredViewQuestions.length} câu</Text>
						</Space>

						<List
							itemLayout='vertical'
							dataSource={filteredViewQuestions}
							pagination={{ pageSize: 5, hideOnSinglePage: true }}
							renderItem={(q, index) => (
								<List.Item>
									<List.Item.Meta
										title={
											<Space>
												<Text strong>
													Câu {index + 1} - [{q.questionCode}]
												</Text>
												<Tag color='blue'>{q.difficulty}</Tag>
												<Tag color='cyan'>{knowledgeBlocks.find((k) => k.id === q.knowledgeBlockId)?.name}</Tag>
											</Space>
										}
										description={
											<div style={{ whiteSpace: 'pre-wrap', marginTop: 8, lineHeight: 1.6 }}>{q.content}</div>
										}
									/>
								</List.Item>
							)}
						/>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default DeThi;
