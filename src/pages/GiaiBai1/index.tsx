import React, { useState } from 'react';
import { Card, Button, Typography, Space, Table, Tag } from 'antd';
import { ScissorOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
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

const choiceIcons: Record<Choice, React.ReactNode> = {
  'Kéo': <ScissorOutlined />,
  'Búa': <DeleteOutlined />, // DeleteOutlined looks somewhat like a hammer/rock
  'Bao': <FileOutlined />,
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
    },
    {
      title: 'Người chơi',
      dataIndex: 'player',
      key: 'player',
      render: (text: Choice) => (
        <Space>
          {choiceIcons[text]} {text}
        </Space>
      ),
    },
    {
      title: 'Máy tính',
      dataIndex: 'computer',
      key: 'computer',
      render: (text: Choice) => (
        <Space>
          {choiceIcons[text]} {text}
        </Space>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result: Result) => {
        let color = result === 'Thắng' ? 'green' : result === 'Thua' ? 'red' : 'orange';
        return <Tag color={color}>{result}</Tag>;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <Card bordered={false}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Trò chơi Oẳn Tù Tì
        </Title>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Space size="large">
            {choices.map((choice) => (
              <Button
                key={choice}
                type="primary"
                size="large"
                icon={choiceIcons[choice]}
                onClick={() => handlePlay(choice)}
                style={{ width: 120, height: 60, fontSize: 18 }}
              >
                {choice}
              </Button>
            ))}
          </Space>
        </div>

        {currentGame && (
          <Card type="inner" style={{ textAlign: 'center', marginBottom: 32, backgroundColor: '#f0f2f5' }}>
            <Space size="large" align="center">
              <div>
                <Text type="secondary">Bạn chọn</Text>
                <Title level={3} style={{ marginTop: 8 }}>
                  {choiceIcons[currentGame.player]} {currentGame.player}
                </Title>
              </div>
              <Title level={1} style={{ margin: '0 24px' }}>VS</Title>
              <div>
                <Text type="secondary">Máy chọn</Text>
                <Title level={3} style={{ marginTop: 8 }}>
                  {choiceIcons[currentGame.computer]} {currentGame.computer}
                </Title>
              </div>
            </Space>
            <div style={{ marginTop: 24 }}>
              <Title level={2} type={currentGame.result === 'Thắng' ? 'success' : currentGame.result === 'Thua' ? 'danger' : 'warning'}>
                {currentGame.result === 'Hòa' ? 'Hòa Nhau!' : `Bạn ${currentGame.result}!`}
              </Title>
            </div>
          </Card>
        )}

        <Title level={4}>Lịch sử trận đấu</Title>
        <Table columns={columns} dataSource={history} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default GiaiBai1;
