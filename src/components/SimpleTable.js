import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const Table = ({ data, columns }) => (<ReactTable
  filterable
  className="-striped -highlight"
  data={data}
  columns={columns}
  showPagination={false}
  minRows={0}
/>);

export default Table
;
