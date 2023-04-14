import styled from '@emotion/styled'
import { range } from 'lodash'
import * as React from 'react'
import { ReactNode } from 'react'

interface MovieCardsProps<T> {
  items?: T[]
  loading?: boolean
  loadingCount?: number
  children(item: T, options: { loading: boolean }): ReactNode
}

export default function Cards<T extends {id: string}>({items, children, loading, loadingCount}: MovieCardsProps<T>) {
  if (loading) {
    return (
      <StyledCardListWrapper>
        {range(loadingCount || 18).map((_, i) => <div style={{width: '100%'}} key={i}>{children(null, {loading})}</div>)}
      </StyledCardListWrapper>
    )
  } else {
    return (
      <StyledCardListWrapper>
        {/*{items?.map(item => children(item, {loading: false}))}*/}
        {items?.map(item => <div style={{width: '100%'}} key={item.id}>{children(item, {loading: false})}</div>)}
      </StyledCardListWrapper>
    )
  }
}

export const StyledCardListWrapper = styled.div`
  display: grid;
  gap: 20px;
  justify-items: start;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
`
