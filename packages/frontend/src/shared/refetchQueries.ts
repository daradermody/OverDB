import {ApolloCache} from '@apollo/client';

export default function refetchQueries(queryPaths: string[]) {
  return (cache: ApolloCache<any>) => {
    for (const queryPath of queryPaths) {
      const [query, field] = queryPath.split('.', 1)
      if (field) {
        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            [field]: obj => ({ ...obj, [field]: undefined })
          }
        });
      } else {
        cache.evict({ id: 'ROOT_QUERY', fieldName: query });
      }
    }
    cache.gc()
  }
}
