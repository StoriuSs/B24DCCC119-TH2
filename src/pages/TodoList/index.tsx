import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TodoTable from './components/TodoTable';
import TodoForm from './components/TodoForm';

interface TodoItem {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
}

const TodoListPage: React.FC = () => {
	const [todos, setTodos] = useState<TodoItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [editingItem, setEditingItem] = useState<TodoItem | null>(null);

	// Khởi tạo dữ liệu từ localStorage
	useEffect(() => {
		const savedTodos = localStorage.getItem('todo_list_data');
		if (savedTodos) {
			try {
				setTodos(JSON.parse(savedTodos));
			} catch (e) {
				console.error('Lỗi parse dữ liệu từ localStorage', e);
				setTodos([]);
			}
		}
		setLoading(false);
	}, []);

	// Hàm lưu dữ liệu vào localStorage
	const saveToLocalStorage = (data: TodoItem[]) => {
		localStorage.setItem('todo_list_data', JSON.stringify(data));
		setTodos(data);
	};

	// Thêm mới hoặc cập nhật công việc
	const handleSave = (values: { title: string; completed: boolean }) => {
		if (editingItem) {
			// Cập nhật
			const newTodos = todos.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item));
			saveToLocalStorage(newTodos);
			message.success('Cập nhật công việc thành công');
		} else {
			// Thêm mới
			const newItem: TodoItem = {
				id: Date.now().toString(),
				title: values.title,
				completed: values.completed,
				createdAt: new Date().toISOString(),
			};
			saveToLocalStorage([newItem, ...todos]);
			message.success('Thêm mới công việc thành công');
		}
		setModalVisible(false);
		setEditingItem(null);
	};

	// Xóa công việc
	const handleDelete = (id: string) => {
		const newTodos = todos.filter((item) => item.id !== id);
		saveToLocalStorage(newTodos);
		message.success('Xóa công việc thành công');
	};

	// Thay đổi nhanh trạng thái hoàn thành
	const handleToggleStatus = (record: TodoItem) => {
		const newTodos = todos.map((item) => (item.id === record.id ? { ...item, completed: !item.completed } : item));
		saveToLocalStorage(newTodos);
	};

	const handleEdit = (record: TodoItem) => {
		setEditingItem(record);
		setModalVisible(true);
	};

	const handleAdd = () => {
		setEditingItem(null);
		setModalVisible(true);
	};

	return (
		<PageContainer>
			<Card
				title='Danh sách công việc cần làm'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm mới
					</Button>
				}
			>
				<TodoTable
					loading={loading}
					dataSource={todos}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onToggleStatus={handleToggleStatus}
				/>
			</Card>

			<TodoForm
				visible={modalVisible}
				editingItem={editingItem}
				onCancel={() => setModalVisible(false)}
				onSave={handleSave}
			/>
		</PageContainer>
	);
};

export default TodoListPage;
