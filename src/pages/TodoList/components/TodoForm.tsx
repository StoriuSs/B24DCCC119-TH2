import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';

interface TodoFormProps {
	visible: boolean;
	editingItem: any;
	onCancel: () => void;
	onSave: (values: any) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ visible, editingItem, onCancel, onSave }) => {
	const [form] = Form.useForm();

	// Cập nhật giá trị form khi editingItem thay đổi
	useEffect(() => {
		if (visible) {
			if (editingItem) {
				form.setFieldsValue(editingItem);
			} else {
				form.resetFields();
			}
		}
	}, [visible, editingItem, form]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onSave(values);
			form.resetFields();
		} catch (info) {
			console.log('Validate Failed:', info);
		}
	};

	return (
		<Modal
			title={editingItem ? 'Chỉnh sửa công việc' : 'Thêm mới công việc'}
			visible={visible}
			onOk={handleOk}
			onCancel={onCancel}
			okText='Lưu'
			cancelText='Hủy'
			destroyOnClose
		>
			<Form form={form} layout='vertical' initialValues={{ completed: false }}>
				<Form.Item
					name='title'
					label='Tiêu đề công việc'
					rules={[
						{ required: true, message: 'Vui lòng nhập tiêu đề công việc!' },
						{ max: 200, message: 'Tiêu đề không được quá 200 ký tự!' },
					]}
				>
					<Input placeholder='Nhập tiêu đề...' />
				</Form.Item>
				<Form.Item name='completed' valuePropName='checked'>
					<Checkbox>Đã hoàn thành</Checkbox>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TodoForm;
