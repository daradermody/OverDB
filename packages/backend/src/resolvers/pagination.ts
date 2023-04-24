interface PaginatedResults<T> {
  offset: number
  limit: number
  endReached: boolean
  results: T[]
}

export async function paginate<T, R>(data: T[], processor: (item: T) => Promise<R>, offset?: number | null, limit?: number | null): Promise<PaginatedResults<R>> {
  offset = offset || 0
  limit = limit || 24
  processor = processor || ((item) => item)
  const dataSubset = data.slice(offset, offset + limit)
  return {
    offset,
    limit,
    endReached: !limit || offset + limit >= data.length,
    results: await Promise.all(dataSubset.map(processor))
  }
}
