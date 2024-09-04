import React, { useState, useCallback, useEffect } from 'react';
import Table from './Table';
import { initialData } from './data'; // Import dữ liệu từ file data.js
import './assets/style.css';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const App = () => {
    const [startMonth, setStartMonth] = useState(initialData.startMonth);
    const [endMonth, setEndMonth] = useState(initialData.endMonth);
    const [data, setData] = useState(initialData); // Initialized with initialData

    const getMonthsInRange = useCallback((start, end) => {
        const startIndex = months.indexOf(start);
        const endIndex = months.indexOf(end);

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            return [];
        }

        return months.slice(startIndex, endIndex + 1);
    }, []);

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

    useEffect(() => {
        setData(generateData());
    }, [startMonth, endMonth, generateData]);

    const handleCellChange = (path, month, value) => {
        setData(prevData => {
            const items = [...prevData.items];
            let item = items[path[0]];
            for (let i = 1; i < path.length; i++) {
                item = item.children[path[i]];
            }
            item.values[month] = value;

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
