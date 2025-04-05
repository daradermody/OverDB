import styled from '@emotion/styled'
import { Skeleton } from '@mui/material'
import {
  DataGrid as MuiDataGrid,
  type DataGridProps,
  GridRow,
  type GridRowProps,
  type GridSlotProps
} from '@mui/x-data-grid';
import { type GridStateColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import Link from './Link'
import type { JSXElementConstructor } from 'react';
import type { GridCellParams } from '@mui/x-data-grid/models/params/gridCellParams';

export default function DataGrid(props: DataGridProps & {getRowLink?(params: GridRowProps): string}) {
  const loadingRows = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]
  const rows = props.loading ? loadingRows : props.rows

  return (
    <StyledDataGrid
      {...props}
      rows={rows}
      disableRowSelectionOnClick
      columns={props.loading ? props.columns.map(col => ({...col, renderCell: undefined})) : props.columns}
      getRowId={props.loading ? (() => Math.random()) : props.getRowId}
      onCellClick={(params: GridCellParams, e) => {
        if (params.field === '__check__') {
          e.stopPropagation()
        }
      }}
      slots={{
        ...props.slots,
        row: getRowSlot(props.slots?.row, props.loading, props.getRowLink),
        loadingOverlay: props.slots?.loadingOverlay || (() => null),
      }}
    />
  )
}

const StyledDataGrid = styled(MuiDataGrid)`
  & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus {
    outline: none;
  }

  & .MuiDataGrid-columnHeaderTitle {
    font-weight: bold;
  }
`

function getRowSlot(providedRow?: JSXElementConstructor<GridSlotProps['row']>, loading?: boolean, getRowLink?: ((params: GridRowProps) => string)): JSXElementConstructor<GridSlotProps['row']> {
  let RowSlot = providedRow || ((rowProps) => <GridRow {...rowProps}/>)
  if (loading) {
    return slotProps => <LoadingRow columns={slotProps.visibleColumns}/>
  } else
  if (getRowLink) {
    return rowProps => <Link to={getRowLink(rowProps)}><RowSlot {...rowProps}/></Link>
  } else {
    return rowProps => <RowSlot {...rowProps}/>
  }
}

function LoadingRow({columns}: { columns: GridStateColDef[] }) {
  return (
    <div style={{display: 'flex', gap: '1px', width: '100%'}}>
      {columns.map(col => (
        <div key={col.headerName} style={{height: '52px', width: `${col.computedWidth - 1}px`, padding: '8px'}}>
          <Skeleton height="100%" sx={{maxWidth: '200px'}}/>
        </div>
      ))}
    </div>
  )
}
