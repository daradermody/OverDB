import styled from '@emotion/styled'
import { Skeleton } from '@mui/material'
import { DataGrid as MuiDataGrid, DataGridProps, GridRow, GridRowProps } from '@mui/x-data-grid'
import { GridStateColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import * as React from 'react'
import Link from './Link'

export default function DataGrid(props: DataGridProps & {getRowLink?(params: GridRowProps): string}) {
  const loadingRows = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]
  const rows = props.loading ? loadingRows : props.rows

  return (
    <StyledDataGrid
      {...props}
      rows={rows}
      columns={props.loading ? props.columns.map(col => ({...col, renderCell: undefined})) : props.columns}
      getRowId={props.loading ? (() => Math.random()) : props.getRowId}
      onCellClick={(params, e) => {
        if (params.colDef.type === 'checkboxSelection') {
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

function getRowSlot(providedRow?: DataGridProps['slots']['row'], loading?: boolean, getRowLink?: ((params: GridRowProps) => string)) {
  let RowSlot = providedRow || ((rowProps) => <GridRow {...rowProps}/>)
  if (loading) {
    return (slotProps) => <LoadingRow columns={slotProps.renderedColumns}/>
  } else if (getRowLink) {
    return (rowProps: GridRowProps) => <Link to={getRowLink(rowProps)}><RowSlot {...rowProps}/></Link>
  } else {
    return (rowProps: GridRowProps) => <RowSlot {...rowProps}/>
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
