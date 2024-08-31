import React, { useRef, useState } from 'react';

const Table = ({ data, months, onCellChange }) => {
    const tableRef = useRef(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);

    const handleInputChange = (path, month, value) => {
        const numericValue = value === '' ? '' : parseFloat(value);
        onCellChange(path, month, numericValue);
    };

    const handleKeyDown = (e, path) => {
        // Implementation for keyboard navigation
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

            // Update all items' values in range
            data.items.forEach((item, index) => {
                item.values[month] = value;
                item.children.forEach(child => {
                    child.values[month] = value;
                });
            });

            // Call onCellChange for each item to trigger re-render
            data.items.forEach((item, index) => {
                onCellChange([index], month, item.values[month]);
                item.children.forEach((child, childIndex) => {
                    onCellChange([index, childIndex], month, child.values[month]);
                });
            });
        }
        setContextMenu(null);
    };

    const renderRow = (item, path, isSubItem = false) => (
        <tr key={path.join('-')} className={isSubItem ? 'sub-item' : ''}>
            <td>{item.name}</td>
            {months.map((month, monthIndex) => (
                <td key={monthIndex}>
                    <input
                        type="number"
                        inputMode="numeric"
                        step="any"
                        value={item.values[month] || ''}
                        onChange={(e) => handleInputChange([...path, monthIndex], month, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, [...path, monthIndex])}
                        onContextMenu={(e) => handleContextMenu(e, [...path, monthIndex])}
                    />
                </td>
            ))}
        </tr>
    );

    const renderTableRows = (items) => (
        items.map((item, index) => (
            <React.Fragment key={index}>
                {renderRow(item, [index])}
                {item.children && item.children.map((child, childIndex) => renderRow(child, [index, childIndex], true))}
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