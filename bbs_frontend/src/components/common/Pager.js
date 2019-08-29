import React, {useState} from 'react'

import '../../css/pager.css'

// function PagerLink(props) {
//     let page = parseInt(props.page)
//     let changePage = props.changePage
//     let highlighted = props.currentPage === page ? 'highlighted-page-link' : ''
//     return (
//         <button className={`link-button page-link ${highlighted}`} onClick={changePage}
//                 id={`page-${page}`}>{page}</button>
//     )
// }

function Pager(props) {
    let changePage = props.onChangePage
    let currentPage = props.currentPage
    let pageCount = props.pageCount
    let previousPage = currentPage === 1 ? currentPage : currentPage - 1
    let nextPage = currentPage === pageCount ? currentPage : currentPage + 1
    let pager = (
        <div className="pager">
            <button className="link-button page-link" onClick={changePage} id={`page-${previousPage}`}>&lt;</button>
            <button className="link-button page-link" onClick={changePage} id={`page-${nextPage}`}>&gt;</button>
        </div>

    )

    const [page, setPage] = useState('')

    return (
        <div className="pager-container">
            {pager}
            <input className="pager-current-page" placeholder={currentPage} value={page} onChange={(e) => {
                setPage(e.target.value)
            }}/>
            <span> / {pageCount}</span>
            <button id={`page-${page}`} className="pager-button" onClick={(e) => {
                if (page !== '') {
                    changePage(e)
                    setPage('')
                }
            }}>转到页面
            </button>
        </div>
    )
}

export default Pager