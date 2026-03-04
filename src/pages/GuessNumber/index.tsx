import { Card, Typography } from 'antd';
import GameBoard from './components/GameBoard';
import './style.less';

const { Title, Paragraph } = Typography;

/**
 * Page component cho trò chơi đoán số
 * Hiển thị rule và game board
 */
const GuessNumberPage = () => {
	return (
		<div style={{ padding: '24px' }}>
			<Card>
				<Title level={2}>Trò chơi đoán số</Title>
				<Paragraph>
					Hệ thống sẽ sinh ra một số ngẫu nhiên từ <strong>1 đến 100</strong>.
				</Paragraph>
				<Paragraph>
					Bạn có <strong>10 lượt</strong> để đoán số đó. Sau mỗi lần đoán, hệ thống sẽ thông báo dự đoán của bạn cao
					hơn, thấp hơn hay đúng!
				</Paragraph>

				{/* Game Board Component */}
				<GameBoard />
			</Card>
		</div>
	);
};

export default GuessNumberPage;
