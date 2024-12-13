import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'

export type TableProps = {
  data: { [key: string]: [value: any] }[]
}

function Table({ data }: TableProps) {
  const itemsPerPage = 10
  const [page, setPage] = useState<number>(1)
  const [searchKey, setSearchKey] = useState<string>('')
  const [filteredData, setFilteredData] = useState<
    { [key: string]: [value: any] }[]
  >([])

  useEffect(() => {
    setFilteredData(data)
    setPage(1)
  }, [data])

  const headers = useMemo(() => {
    if (data && data.length > 0) {
      return Object.keys(data[0])
    }

    return []
  }, [data])

  const paginatedData = useMemo(() => {
    let processedData: { [key: string]: [value: any] }[][] = []
    let index = 0
    while (index < filteredData.length) {
      processedData.push(filteredData.slice(index, index + itemsPerPage))
      index += itemsPerPage
    }

    return processedData
  }, [filteredData])

  const searchData = useCallback(() => {
    const searchedData = data.filter((item) => {
      for (const header of headers) {
        if (
          item[header]
            ?.toString()
            .toLowerCase()
            .includes(searchKey.toLowerCase())
        ) {
          return true
        }
      }
      return false
    })
    setPage(1)
    setFilteredData(searchedData)
  }, [searchKey, data, headers])

  return (
    <div>
      <div
        className='d-flex justify-content-end'
        style={{ paddingRight: '16px' }}
      >
        <form
          className='mb-3'
          onSubmit={(e) => {
            e.preventDefault()
            searchData()
          }}
        >
          <input
            onChange={(e) => {
              setSearchKey(e.target.value)
            }}
          ></input>
          <button onClick={() => searchData()}>Search</button>
        </form>
      </div>

      <table className='table table-bordered'>
        <thead className='table-primary'>
          <tr>
            {headers.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.length > 0 &&
            paginatedData[page - 1].map((item, dataIndex) => (
              <tr key={dataIndex}>
                {headers.map((header, headerIndex) => (
                  <th key={headerIndex} style={{ fontWeight: 'normal' }}>
                    {item[header]}
                  </th>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {filteredData.length > 0 && (
        <div className='d-flex justify-content-center'>
          <ReactPaginate
            previousLabel='Previous'
            nextLabel='Next'
            pageClassName='page-item'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextClassName='page-item'
            nextLinkClassName='page-link'
            breakLabel='...'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            pageCount={paginatedData?.length ?? 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => {
              setPage(e.selected + 1)
            }}
            forcePage={page - 1}
            containerClassName='pagination'
            activeClassName='active'
          />
        </div>
      )}
    </div>
  )
}

export default Table
