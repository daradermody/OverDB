import styled from '@emotion/styled'
import type { ReactNode } from 'react'

interface MovieCardsProps<T> {
  items?: T[]
  loading?: boolean
  loadingCount?: number
  children(item: T, options: { loading: boolean }): ReactNode
  minCardWidth?: string
}

export default function Cards<T extends {id: string}>({items, children, loading, loadingCount, minCardWidth}: MovieCardsProps<T>) {
  if (loading) {
    return (
      <StyledCardListWrapper minCardWidth={minCardWidth}>
        {range(loadingCount || 18).map((_, i) => <div style={{width: '100%'}} key={i}>{children(null as any, {loading})}</div>)}
      </StyledCardListWrapper>
    )
  } else {
    return (
      <StyledCardListWrapper minCardWidth={minCardWidth}>
        {items?.map(item => <div style={{width: '100%'}} key={item.id}>{children(item, {loading: false})}</div>)}
      </StyledCardListWrapper>
    )
  }
}

function range(n: number) {
  return Array.from({length: n}, (_, i) => i)
}

export const StyledCardListWrapper = styled.div<{minCardWidth?: string}>`
  display: grid;
  gap: 20px;
  justify-items: start;
  grid-template-columns: repeat(auto-fill, minmax(${({minCardWidth}) => minCardWidth || '170px'}, 1fr));
`
