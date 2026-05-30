import './List.css';
function List({
    data,
    columns,
    onRowClick,
    scrollable = true,
    pagination = null,
}) {
    const table = (
        <table className="list-table">
            <thead>
                <tr>
                    { columns.map((col) => (
                        <th key={ col.key }>{ col.label }</th>
                    )) }
                </tr>
            </thead>

            <tbody>
                { data.map((item, idx) => (
                    <tr
                        key={ item.id || idx }
                        onClick={ () => onRowClick?.(item) }
                    >
                        { columns.map((col) => (
                            <td key={ col.key }>
                                <div className="cell-content">
                                    { col.key === "index"
                                        ? idx + 1
                                        : col.render
                                            ? col.render(item)
                                            : item[col.key] ?? "-" }
                                </div>
                            </td>
                        )) }
                    </tr>
                )) }
            </tbody>
        </table>
    );

    return (
        <div className="list-container">
            { scrollable ? (
                <div className="list-scroll-area">
                    { table }
                </div>
            ) : table }

            { pagination && (
                <div className="list-pagination">
                    { pagination }
                </div>
            ) }
        </div>
    );
}

export default List;
