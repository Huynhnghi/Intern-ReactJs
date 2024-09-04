import React, { useRef, useState, useEffect } from 'react';

const value = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
};

const Table = ({ data: initialData, months, onCellChange }) => {
    const tableRef = useRef(null);
    const [data, setData] = useState(initialData);
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);

    const handleInputChange = (path, month, value) => {
        const numericValue = value === '' ? '' : parseFloat(value);
        onCellChange(path, month, numericValue);
    };

    const handleKeyDown = (e, path) => {
        const [itemIndex, monthIndex] = path;

        const moveSelection = (newItemIndex, newMonthIndex) => {
            e.preventDefault();
            setSelectedCell([newItemIndex, newMonthIndex]);
        };

        switch (e.key) {
            case 'ArrowDown':
                if (data.items[itemIndex + 1]) moveSelection(itemIndex + 1, monthIndex);
                break;
            case 'ArrowUp':
                if (data.items[itemIndex - 1]) moveSelection(itemIndex - 1, monthIndex);
                break;
            case 'ArrowRight':
                if (months[monthIndex + 1]) moveSelection(itemIndex, monthIndex + 1);
                break;
            case 'ArrowLeft':
                if (months[monthIndex - 1]) moveSelection(itemIndex, monthIndex - 1);
                break;
            default:
                break;
        }
    };

    const handleContextMenu = (e, path) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, path });
        setSelectedCell(path);
    };

    const handleApplyToAll = () => {
        if (selectedCell) {
            const [itemIndex, monthIndex] = selectedCell;
            const month = months[monthIndex];
            const value = data.items[itemIndex].values[month];

            const updateItemValues = (item) => {
                const updatedItem = { ...item, values: { ...item.values, [month]: value } };
                if (item.children) {
                    updatedItem.children = item.children.map(updateItemValues);
                }
                return updatedItem;
            };

            const updatedItems = data.items.map(updateItemValues);
            setData({ ...data, items: updatedItems });
        }
        setContextMenu(null);
    };

    const handleAddNewCategory = (path) => {
        const newCategoryName = prompt("Enter the name of the new category:");

        if (newCategoryName) {
            setData(prevData => {
                const items = [...prevData.items];
                let item = items[path[0]];

                for (let i = 1; i < path.length; i++) {
                    item = item.children[path[i]];
                }

                item.children.push({
                    name: newCategoryName,
                    values: months.reduce((acc, month) => ({ ...acc, [month]: '' }), {}),
                    children: []
                });

                return { ...prevData, items };
            });
        }
    };

    const calculateSubTotals = (data) => {
        const generalIncome = data.items.find(item => item.name === 'Income')
            ?.children.find(child => child.name === 'General Income');

        // Ensure General Income category exists
        if (!generalIncome) {
            console.error("General Income category not found");
            return { ...value };  // Return default values to prevent further errors
        }

        const subTotals = generalIncome.children.reduce((acc, child) => {
            Object.keys(child.values).forEach(month => {
                acc[month] += child.values[month] || 0;
            });
            return acc;
        }, { ...value });

        return subTotals;
    };

    useEffect(() => {
        const updatedData = { ...data };

        // Ensure that Income category exists
        const incomeCategory = updatedData.items.find(item => item.name === 'Income');
        if (!incomeCategory) {
            console.error("Income category not found");
            return;
        }

        // Ensure that Sub Totals category exists
        const subTotalsCategory = incomeCategory.children.find(child => child.name === 'Sub Totals');
        if (!subTotalsCategory) {
            console.error("Sub Totals category not found");
            return;
        }

        // Calculate and set Sub Totals values
        subTotalsCategory.values = calculateSubTotals(data);
        setData(updatedData);
    }, [data]);

    const renderRow = (item, path, isSubItem = false) => (
        <tr key={path.join('-')} className={isSubItem ? 'sub-item' : ''}>
            <td>
                {item.name === "Add a new 'General Income' Category" ? (
                    <button onClick={() => handleAddNewCategory(path)}>+ Add a new category</button>
                ) : (
                    item.name
                )}
            </td>
            {months.map((month, monthIndex) => (
                <td key={monthIndex}>
                    {item.name !== "Add a new 'General Income' Category" && (
                        <input
                            type="number"
                            inputMode="numeric"
                            step="any"
                            value={item.values[month] || ''}
                            onChange={(e) => handleInputChange([...path], month, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, [...path])}
                            onContextMenu={(e) => handleContextMenu(e, [...path])}
                        />
                    )}
                </td>
            ))}
        </tr>
    );

    const renderTableRows = (items, parentPath = []) => (
        items.map((item, index) => (
            <React.Fragment key={index}>
                {renderRow(item, [...parentPath, index])}
                {item.children && renderTableRows(item.children, [...parentPath, index])}
            </React.Fragment>
        ))
    );

    return (
        <div>
            <table className="budget-table" ref={tableRef}>
                <thead>
                    <tr>
                        <th>Category</th>
                        {months.map((month, index) => (
                            <th key={index}>{month}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows(data.items || [])}
                </tbody>
            </table>
            {contextMenu && (
                <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <button onClick={handleApplyToAll}>Apply to all</button>
                </div>
            )}
        </div>
    );
};

export default Table;
