import { Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface GuessHistoryItem {
	attempt: number;
	guess: number;
	result: 'higher' | 'lower' | 'correct';
}

interface GuessHistoryProps {
	history: GuessHistoryItem[];
}

/**
 * Component hiển thị lịch sử các lần đoán của người chơi
 * Dùng Ant Design Table để render data
 */
const GuessHistory = ({ history }: GuessHistoryProps) => {
	// Định nghĩa columns cho bảng
	const columns: ColumnsType<GuessHistoryItem> = [
		{
			title: 'Lượt',
			dataIndex: 'attempt',
			key: 'attempt',
			width: 100,
			align: 'center',
			render: (attempt: number) => <Tag color='blue'>Lượt {attempt}</Tag>,
		},
		{
			title: 'Số đã đoán',
			dataIndex: 'guess',
			key: 'guess',
			width: 150,
			align: 'center',
			render: (guess: number) => <strong style={{ fontSize: 18 }}>{guess}</strong>,
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			align: 'center',
			render: (result: 'higher' | 'lower' | 'correct', record: GuessHistoryItem) => {
				// Render icon và message tương ứng với kết quả
				if (result === 'correct') {
					return (
						<Tag icon={<CheckCircleOutlined />} color='success' style={{ fontSize: 14 }}>
							Chúc mừng! Bạn đã đoán đúng!
						</Tag>
					);
				}

				if (result === 'higher') {
					return (
						<Tag icon={<ArrowUpOutlined />} color='warning' style={{ fontSize: 14 }}>
							Bạn đoán quá thấp!
						</Tag>
					);
				}

				return (
					<Tag icon={<ArrowDownOutlined />} color='error' style={{ fontSize: 14 }}>
						Bạn đoán quá cao!
					</Tag>
				);
			},
		},
	];

	return (
		<Table
			dataSource={history}
			columns={columns}
			pagination={false}
			rowKey='attempt'
			size='middle'
			bordered
			// Highlight row nếu đoán đúng
			rowClassName={(record) => (record.result === 'correct' ? 'success-row' : '')}
		/>
	);
};

export default GuessHistory;
