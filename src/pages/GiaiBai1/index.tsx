import React, { useState } from 'react';
import { Card, Button, Typography, Space, Table, Tag } from 'antd';
// Xóa bỏ các icon cũ không dùng đến
import styles from './index.less';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface GameHistory {
    key: number;
    id: number;
    player: Choice;
    computer: Choice;
    result: Result;
}

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

// Định nghĩa choiceIcons sử dụng Emoji để trực quan hơn
const choiceIcons: Record<Choice, React.ReactNode> = {
    'Kéo': <span style={{ fontSize: '1.5em', marginRight: '8px' }}>✌️</span>, // Emoji✌️ cho Kéo
    'Búa': <span style={{ fontSize: '1.5em', marginRight: '8px' }}>✊</span>, // Emoji ✊ (nắm đấm) cho Búa
    'Bao': <span style={{ fontSize: '1.5em', marginRight: '8px' }}>✋</span>, // Emoji ✋ (bàn tay mở) cho Bao
};

// Định nghĩa choiceIcons bản nhỏ hơn dùng trong Table
const choiceIconsSmall: Record<Choice, React.ReactNode> = {
    'Kéo': <span style={{ fontSize: '1.2em' }}>✌️</span>,
    'Búa': <span style={{ fontSize: '1.2em' }}>✊</span>,
    'Bao': <span style={{ fontSize: '1.2em' }}>✋</span>,
};

const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
};

const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'Hòa';
    if (
        (player === 'Kéo' && computer === 'Bao') ||
        (player === 'Búa' && computer === 'Kéo') ||
        (player === 'Bao' && computer === 'Búa')
    ) {
        return 'Thắng';
    }
    return 'Thua';
};

const GiaiBai1: React.FC = () => {
    const [history, setHistory] = useState<GameHistory[]>([]);
    const [currentGame, setCurrentGame] = useState<{ player: Choice; computer: Choice; result: Result } | null>(null);

    const handlePlay = (playerChoice: Choice) => {
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);

        setCurrentGame({ player: playerChoice, computer: computerChoice, result });

        setHistory((prev) => [
            {
                key: prev.length + 1,
                id: prev.length + 1,
                player: playerChoice,
                computer: computerChoice,
                result,
            },
            ...prev,
        ]);
    };

    const columns = [
        {
            title: 'Ván',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Người chơi',
            dataIndex: 'player',
            key: 'player',
            render: (text: Choice) => (
                <Space>
                    {choiceIconsSmall[text]} {text}
                </Space>
            ),
        },
        {
            title: 'Máy tính',
            dataIndex: 'computer',
            key: 'computer',
            render: (text: Choice) => (
                <Space>
                    {choiceIconsSmall[text]} {text}
                </Space>
            ),
        },
        {
            title: 'Kết quả',
            dataIndex: 'result',
            key: 'result',
            render: (result: Result) => {
                let color = result === 'Thắng' ? 'green' : result === 'Thua' ? 'red' : 'orange';
                return <Tag color={color} style={{ fontWeight: 'bold' }}>{result.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <div className={styles.container} style={{ padding: '24px' }}>
            <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 32, color: '#1890ff' }}>
                    TRÒ CHƠI OẮN TÙ TÌ
                </Title>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
                    <Space size="large">
                        {choices.map((choice) => (
                            <Button
                                key={choice}
                                type="primary"
                                size="large"
                                onClick={() => handlePlay(choice)}
                                style={{
                                    width: 140,
                                    height: 70,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px'
                                }}
                            >
                                {choiceIcons[choice]}
                                {choice}
                            </Button>
                        ))}
                    </Space>
                </div>

                {currentGame && (
                    <Card type="inner" style={{ textAlign: 'center', marginBottom: 40, backgroundColor: '#f0f2f5', borderRadius: '8px', border: '1px solid #d9d9d9' }}>
                        <Space size="large" align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '150px' }}>
                                <Text type="secondary" style={{ fontSize: '16px' }}>Bạn chọn</Text>
                                <Title level={3} style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {choiceIcons[currentGame.player]}
                                    <span style={{ fontSize: '28px' }}>{currentGame.player}</span>
                                </Title>
                            </div>

                            <Title level={1} style={{ margin: '0 40px', fontSize: '48px', color: '#bfbfbf' }}>VS</Title>

                            <div style={{ width: '150px' }}>
                                <Text type="secondary" style={{ fontSize: '16px' }}>Máy chọn</Text>
                                <Title level={3} style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {choiceIcons[currentGame.computer]}
                                    <span style={{ fontSize: '28px' }}>{currentGame.computer}</span>
                                </Title>
                            </div>
                        </Space>
                        <div style={{ marginTop: 32, borderTop: '1px solid #d9d9d9', paddingTop: '16px' }}>
                            <Title level={2} style={{ fontSize: '36px', margin: 0 }} type={currentGame.result === 'Thắng' ? 'success' : currentGame.result === 'Thua' ? 'danger' : 'warning'}>
                                {currentGame.result === 'Hòa' ? 'HÒA NHAU!' : `BẠN ${currentGame.result.toUpperCase()}!`}
                            </Title>
                        </div>
                    </Card>
                )}

                <Title level={4} style={{ marginBottom: '16px' }}>Lịch sử trận đấu</Title>
                <Table
                    columns={columns}
                    dataSource={history}
                    pagination={{ pageSize: 5 }}
                    bordered
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default GiaiBai1;