import React, { useState, useCallback, useEffect } from 'react';
import Table from './Table';
import { initialData } from './data'; // Import dữ liệu từ file data.js
import './assets/style.css';

// Danh sách các tháng trong năm
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const App = () => {
    const [startMonth, setStartMonth] = useState(initialData.startMonth);
    const [endMonth, setEndMonth] = useState(initialData.endMonth);
    const [data, setData] = useState({ startMonth, endMonth, items: [] });

    // Hàm để lấy các tháng trong khoảng thời gian đã chọn
    const getMonthsInRange = useCallback((start, end) => {
        const startIndex = months.indexOf(start);
        const endIndex = months.indexOf(end);

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            return [];
        }

        return months.slice(startIndex, endIndex + 1);
    }, []);

    // Hàm để tạo dữ liệu dựa trên các tháng đã chọn
    const generateData = useCallback(() => {
        const monthsInRange = getMonthsInRange(startMonth, endMonth);

        const updatedItems = initialData.items.map(item => ({
            ...item,
            values: Object.keys(item.values).reduce((acc, month) => {
                if (monthsInRange.includes(month)) {
                    acc[month] = item.values[month];
                }
                return acc;
            }, {})
        }));

        return { startMonth, endMonth, items: updatedItems };
    }, [startMonth, endMonth, getMonthsInRange]);

    // Cập nhật dữ liệu khi tháng bắt đầu hoặc tháng kết thúc thay đổi
    useEffect(() => {
        setData(generateData());
    }, [startMonth, endMonth, generateData]);

    // Hàm để xử lý khi có thay đổi trong ô
    const handleCellChange = (path, month, value) => {
        setData(prevData => {
            const items = [...prevData.items];
            const item = items[path[0]];
            const key = months[path[1]];

            item.values[key] = value;

            if (item.children) {
                item.children.forEach(child => {
                    child.values[key] = value;
                });
            }

            return { ...prevData, items };
        });
    };

    return (
        <div className="app">
            <div className="controls">
                <label>
                    Start Month:
                    <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </label>
                <label>
                    End Month:
                    <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </label>
            </div>
            <button onClick={() => setData(generateData())}>Update Table</button>
            <Table data={data} months={getMonthsInRange(startMonth, endMonth)} onCellChange={handleCellChange} />
        </div>
    );
};

export default App;
