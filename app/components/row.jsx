
export default function Row(props) {
    return (
        <tr>
            <th>{props.rowNumber}</th>
            <td>{props.code}</td>
            <td>{props.itemDesc}</td>
            <td>{props.amount}</td>
            <td>{props.unitPrice}</td>
            <td>{props.totalValue}</td>
            <td>{props.stockLocation}</td>
            <td>{props.weight}</td>
        </tr>
    )
}


