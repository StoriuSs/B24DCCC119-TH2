import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd'; // Thêm Popconfirm ở đây
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IKnowledgeBlock } from '../typing';

const KhoiKienThuc = () => {
    const [data, setData] = useState<IKnowledgeBlock[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<IKnowledgeBlock | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const mockData: IKnowledgeBlock[] = [
            { id: '1', name: 'Tổng quan', description: 'Kiến thức cơ bản' },
            { id: '2', name: 'Chuyên sâu', description: 'Kiến thức nâng cao' },
        ];
        const stored = localStorage.getItem('knowledgeBlocks');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            setData(mockData);
            localStorage.setItem('knowledgeBlocks', JSON.stringify(mockData));
        }
    }, []);

    const handleSave = (values: any) => {
        const isDuplicate = data.some(item => 
            item.name.trim().toLowerCase() === values.name.trim().toLowerCase() && 
            (editingItem ? item.id !== editingItem.id : true)
        );

        if (isDuplicate) {
            message.error('Tên khối kiến thức đã tồn tại!');
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
        { 
            title: 'Tên khối kiến thức', 
            dataIndex: 'name', 
            key: 'name',
            align: 'center' as const 
        },
        { 
            title: 'Mô tả', 
            dataIndex: 'description', 
            key: 'description',
            align: 'center' as const 
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
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
                    
                    {/* Bọc nút Xóa trong Popconfirm để xác nhận */}
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
                <Table rowKey='id' columns={columns} dataSource={data} bordered />
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