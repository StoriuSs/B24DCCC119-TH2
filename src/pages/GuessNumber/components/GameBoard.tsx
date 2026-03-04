import { Button, Card, InputNumber, Space, Tag, Typography, Alert, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { TrophyOutlined, CloseCircleOutlined, SmileOutlined, FrownOutlined, ReloadOutlined } from '@ant-design/icons';
import GuessHistory from './GuessHistory';

const { Text } = Typography;

/**
 * Component chứa logic chính của game đoán số
 * Quản lý state: số ngẫu nhiên, lượt chơi, lịch sử dự đoán, kết quả
 */
const GameBoard = () => {
	// State quản lý số ngẫu nhiên cần đoán
	const [secretNumber, setSecretNumber] = useState<number>(0);

	// State quản lý số người chơi nhập vào
	const [guessValue, setGuessValue] = useState<number | null>(null);

	// State quản lý số lượt đã chơi
	const [attempts, setAttempts] = useState<number>(0);

	// State lưu lịch sử các lần đoán
	const [history, setHistory] = useState<
		{
			attempt: number;
			guess: number;
			result: 'higher' | 'lower' | 'correct';
		}[]
	>([]);

	// State quản lý trạng thái game (đang chơi, thắng, thua)
	const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

	// State lưu thông báo phản hồi cho người chơi
	const [feedback, setFeedback] = useState<string>('');

	// Số lượt tối đa
	const MAX_ATTEMPTS = 10;

	/**
	 * Khởi tạo game mới
	 * Sinh số ngẫu nhiên từ 1-100 và reset các state
	 */
	const initGame = () => {
		const randomNum = Math.floor(Math.random() * 100) + 1;
		setSecretNumber(randomNum);
		setGuessValue(null);
		setAttempts(0);
		setHistory([]);
		setGameStatus('playing');
		setFeedback('Hãy nhập số từ 1 đến 100 và bắt đầu đoán!');
	};

	// Khởi tạo game khi component mount
	useEffect(() => {
		initGame();
	}, []);

	/**
	 * Xử lý logic khi người chơi submit dự đoán
	 */
	const handleGuess = () => {
		// Validate input
		if (guessValue === null || guessValue < 1 || guessValue > 100) {
			setFeedback('Vui lòng nhập số từ 1 đến 100!');
			return;
		}

		// Kiểm tra game đã kết thúc chưa
		if (gameStatus !== 'playing') {
			return;
		}

		// Tăng số lượt chơi
		const newAttempts = attempts + 1;
		setAttempts(newAttempts);

		// Xác định kết quả
		let result: 'higher' | 'lower' | 'correct';
		let message: string;

		if (guessValue === secretNumber) {
			// Đoán đúng!
			result = 'correct';
			message = `Chúc mừng! Bạn đã đoán đúng số ${secretNumber} sau ${newAttempts} lượt!`;
			setGameStatus('won');
		} else if (guessValue < secretNumber) {
			// Số đoán nhỏ hơn số cần tìm
			result = 'higher';
			message = `Bạn đoán quá thấp! Số cần tìm lớn hơn ${guessValue}.`;

			// Kiểm tra hết lượt chưa
			if (newAttempts >= MAX_ATTEMPTS) {
				message += ` Bạn đã hết lượt! Số đúng là ${secretNumber}.`;
				setGameStatus('lost');
			}
		} else {
			// Số đoán lớn hơn số cần tìm
			result = 'lower';
			message = `Bạn đoán quá cao! Số cần tìm nhỏ hơn ${guessValue}.`;

			// Kiểm tra hết lượt chưa
			if (newAttempts >= MAX_ATTEMPTS) {
				message += ` Bạn đã hết lượt! Số đúng là ${secretNumber}.`;
				setGameStatus('lost');
			}
		}

		// Cập nhật feedback và lịch sử
		setFeedback(message);
		setHistory([
			...history,
			{
				attempt: newAttempts,
				guess: guessValue,
				result,
			},
		]);

		// Reset input
		setGuessValue(null);
	};

	/**
	 * Hiển thị Alert theo trạng thái game
	 */
	const renderStatusAlert = () => {
		if (gameStatus === 'won') {
			return (
				<Alert
					message='Chiến thắng!'
					description={feedback}
					type='success'
					showIcon
					icon={<TrophyOutlined />}
					style={{ marginBottom: 16 }}
				/>
			);
		}

		if (gameStatus === 'lost') {
			return (
				<Alert
					message='Đã hết lượt!'
					description={feedback}
					type='error'
					showIcon
					icon={<CloseCircleOutlined />}
					style={{ marginBottom: 16 }}
				/>
			);
		}

		return (
			<Alert
				message={`Lượt ${attempts}/${MAX_ATTEMPTS}`}
				description={feedback}
				type='info'
				showIcon
				icon={attempts > 0 ? <SmileOutlined /> : <FrownOutlined />}
				style={{ marginBottom: 16 }}
			/>
		);
	};

	return (
		<div style={{ marginTop: 24 }}>
			{/* Hiển thị trạng thái game */}
			{renderStatusAlert()}

			{/* Card input và controls */}
			<Card
				title={
					<Space>
						<Text strong>Nhập dự đoán của bạn</Text>
						<Tag color='blue'>Còn lại: {MAX_ATTEMPTS - attempts} lượt</Tag>
					</Space>
				}
				extra={
					<Button type='primary' icon={<ReloadOutlined />} onClick={initGame}>
						Chơi lại
					</Button>
				}
				style={{ marginBottom: 24 }}
			>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					{/* Input nhập số */}
					<Space size='large'>
						<InputNumber
							value={guessValue}
							onChange={(value) => setGuessValue(value as number | null)}
							placeholder='Nhập số từ 1-100'
							size='large'
							style={{ width: 200 }}
							disabled={gameStatus !== 'playing'}
							status={typeof guessValue === 'number' && (guessValue < 1 || guessValue > 100) ? 'error' : undefined}
							onPressEnter={handleGuess}
						/>
						<Button
							type='primary'
							size='large'
							onClick={handleGuess}
							disabled={
								gameStatus !== 'playing' ||
								guessValue === null ||
								(typeof guessValue === 'number' && (guessValue < 1 || guessValue > 100))
							}
						>
							Đoán
						</Button>
					</Space>
				</Space>
			</Card>

			{/* Hiển thị lịch sử đoán */}
			{history.length > 0 && (
				<>
					<Divider orientation='left'>Lịch sử dự đoán</Divider>
					<GuessHistory history={history} />
				</>
			)}
		</div>
	);
};

export default GameBoard;
